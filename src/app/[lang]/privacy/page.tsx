import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://texasinstituteofai.org'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isZh = lang === 'zh'
  return {
    title: isZh ? '隐私政策 | TIAI' : 'Privacy Policy | TIAI',
    robots: { index: false, follow: false },
    alternates: { canonical: `${siteUrl}/${lang}/privacy` },
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isZh = lang === 'zh'
  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-invert prose-slate">
      <h1>{isZh ? '隐私政策' : 'Privacy Policy'}</h1>
      <p className="text-slate-500 text-sm">{isZh ? '最后更新：2026 年 1 月 1 日' : 'Last updated: January 1, 2026'}</p>
      {isZh ? (
        <>
          <h2>我们收集的信息</h2>
          <p>当您通过本网站提交联系表单时，我们会收集您提供的姓名、邮箱、电话及留言内容。</p>
          <h2>信息使用方式</h2>
          <p>我们仅将收集的信息用于回复您的咨询请求。我们不会向第三方出售或共享您的个人信息，除非法律要求。</p>
          <h2>数据存储</h2>
          <p>表单提交数据存储在 Airtable（美国服务器）。邮件通知通过 Resend 发送。</p>
          <h2>Cookie</h2>
          <p>本网站使用功能性 Cookie 记录您的语言偏好。您可以通过浏览器设置拒绝 Cookie。</p>
          <h2>联系我们</h2>
          <p>如有隐私相关问题，请发送邮件至 privacy@texasinstituteofai.org。</p>
        </>
      ) : (
        <>
          <h2>Information We Collect</h2>
          <p>When you submit a contact form on this website, we collect the name, email address, phone number, and message you provide.</p>
          <h2>How We Use Your Information</h2>
          <p>We use the collected information solely to respond to your inquiry. We do not sell or share your personal information with third parties except as required by law.</p>
          <h2>Data Storage</h2>
          <p>Form submissions are stored in Airtable (US servers). Email notifications are sent via Resend.</p>
          <h2>Cookies</h2>
          <p>This website uses functional cookies to remember your language preference. You may disable cookies through your browser settings.</p>
          <h2>Contact</h2>
          <p>For privacy-related questions, email privacy@texasinstituteofai.org.</p>
        </>
      )}
    </article>
  )
}
