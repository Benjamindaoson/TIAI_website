import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isZh = lang === 'zh'
  const siteUrl = getSiteUrl()
  return {
    title: isZh ? '服务条款 | TIAI' : 'Terms of Service | TIAI',
    robots: { index: false, follow: false },
    alternates: { canonical: `${siteUrl}/${lang}/terms` },
  }
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isZh = lang === 'zh'
  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-invert prose-slate">
      <h1>{isZh ? '服务条款' : 'Terms of Service'}</h1>
      <p className="text-slate-500 text-sm">{isZh ? '最后更新：2026 年 1 月 1 日' : 'Last updated: January 1, 2026'}</p>
      {isZh ? (
        <>
          <h2>接受条款</h2>
          <p>访问本网站即表示您同意遵守以下服务条款。如不同意，请勿使用本网站。</p>
          <h2>网站用途</h2>
          <p>本网站仅供了解德州人工智能学院（TIAI）的教育项目、合作机会及相关信息之用。</p>
          <h2>信息准确性</h2>
          <p>我们力求提供准确信息，但不对网站内容的完整性或时效性作出保证。</p>
          <h2>知识产权</h2>
          <p>本网站所有内容（包括文字、图片及标志）均为 TIAI 所有，未经许可不得转载或使用。</p>
          <h2>免责声明</h2>
          <p>本网站按现状提供，不附带任何明示或暗示的保证。TIAI 不对因使用本网站而产生的任何损失承担责任。</p>
          <h2>联系我们</h2>
          <p>如有服务条款相关问题，请发送邮件至 info@texasinstituteofai.org。</p>
        </>
      ) : (
        <>
          <h2>Acceptance of Terms</h2>
          <p>By accessing this website, you agree to be bound by these Terms of Service. If you do not agree, please do not use this website.</p>
          <h2>Use of Website</h2>
          <p>This website is intended solely for learning about Texas Institute of Artificial Intelligence (TIAI) educational programs, partnership opportunities, and related information.</p>
          <h2>Accuracy of Information</h2>
          <p>We strive to provide accurate information but make no guarantees regarding the completeness or timeliness of the content on this website.</p>
          <h2>Intellectual Property</h2>
          <p>All content on this website, including text, images, and logos, is the property of TIAI and may not be reproduced or used without permission.</p>
          <h2>Disclaimer</h2>
          <p>This website is provided as-is without any express or implied warranties. TIAI is not liable for any loss arising from the use of this website.</p>
          <h2>Contact</h2>
          <p>For questions about these Terms of Service, email info@texasinstituteofai.org.</p>
        </>
      )}
    </article>
  )
}
