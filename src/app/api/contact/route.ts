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
