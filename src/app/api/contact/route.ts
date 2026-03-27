import { z } from 'zod'
import { Resend } from 'resend'

export const runtime = 'edge'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  program: z.enum(['ai-ml', 'cs', 'information-systems', 'partnership', 'faculty', 'other']),
  message: z.string().min(1).max(2000),
  lang: z.enum(['en', 'zh']),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 })
  }

  const { name, email, phone, program, message, lang } = parsed.data
  const adminEmail = process.env.ADMIN_EMAIL
  const resendApiKey = process.env.RESEND_API_KEY

  if (!adminEmail || !resendApiKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 })
  }

  const resend = new Resend(resendApiKey)

  // Send email notification
  try {
    await resend.emails.send({
      from: 'TIAI Contact <noreply@texasinstituteofai.org>',
      to: adminEmail,
      subject: `New contact form submission: ${program}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? 'N/A'}\nProgram: ${program}\nLang: ${lang}\n\n${message}`,
    })
  } catch (err) {
    console.error('Resend error:', err)
    return new Response(JSON.stringify({ error: 'Failed to send notification email' }), { status: 500 })
  }

  // Send confirmation email to submitter
  const confirmationSubject = lang === 'zh'
    ? '感谢您联系 TIAI — 我们已收到您的留言'
    : 'Thank you for contacting TIAI — we received your message'

  const confirmationText = lang === 'zh'
    ? `您好 ${name}，\n\n感谢您联系德州人工智能学院（TIAI）。我们已收到您的留言，将在 2 个工作日内与您联系。\n\n---\n您的留言摘要：\n姓名：${name}\n意向方向：${program}\n\n${message}\n---\n\nTexas Institute of Artificial Intelligence\nhttps://texasinstituteofai.org`
    : `Hi ${name},\n\nThank you for reaching out to the Texas Institute of Artificial Intelligence (TIAI). We have received your message and will be in touch within 2 business days.\n\n---\nYour submission summary:\nName: ${name}\nArea of interest: ${program}\n\n${message}\n---\n\nTexas Institute of Artificial Intelligence\nhttps://texasinstituteofai.org`

  try {
    await resend.emails.send({
      from: 'TIAI <noreply@texasinstituteofai.org>',
      to: email,
      subject: confirmationSubject,
      text: confirmationText,
    })
  } catch (err) {
    // Non-fatal: log but do not fail the request
    console.error('Resend confirmation error:', err)
  }

  // Write to Airtable via REST API
  const airtableBaseId = process.env.AIRTABLE_BASE_ID
  const airtableApiKey = process.env.AIRTABLE_API_KEY
  const airtableTable = process.env.AIRTABLE_TABLE_NAME ?? 'Contacts'

  if (airtableBaseId && airtableApiKey) {
    try {
      const airtableRes = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTable)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              Name: name,
              Email: email,
              Phone: phone ?? '',
              Program: program,
              Message: message,
              Lang: lang,
              'Submitted At': new Date().toISOString(),
            },
          }),
        }
      )
      if (!airtableRes.ok) {
        const errText = await airtableRes.text()
        console.error('Airtable error:', errText)
      }
    } catch (err) {
      console.error('Airtable fetch error:', err)
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
