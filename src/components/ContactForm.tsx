'use client'
import { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { localizedHref } from '@/lib/routes'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm({ lang }: { lang: string }) {
  const t = useTranslations('Contact')
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const formIdPrefix = `contact-${lang}`

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setError('')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const turnstileInput = e.currentTarget.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')
    const turnstileToken = turnstileInput?.value
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang, turnstileToken }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        if (body?.error?.fieldErrors?.privacyConsent?.length) {
          throw new Error(t('privacyConsentError'))
        }
        throw new Error(t('errorMessage'))
      }
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorMessage'))
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div role="status" aria-live="polite" className="rounded-lg border border-green-700 bg-green-900/30 p-6 text-green-300">
        {t('successMessage')}
      </div>
    )
  }

  return (
    <>
      {turnstileSiteKey && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      )}
      <form onSubmit={handleSubmit} className="space-y-4" aria-busy={state === 'loading'}>
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${formIdPrefix}-name`} className="mb-1 block text-sm text-slate-400">{t('name')} *</label>
            <input id={`${formIdPrefix}-name`} name="name" autoComplete="name" required className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor={`${formIdPrefix}-email`} className="mb-1 block text-sm text-slate-400">{t('email')} *</label>
            <input id={`${formIdPrefix}-email`} name="email" type="email" autoComplete="email" required className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${formIdPrefix}-phone`} className="mb-1 block text-sm text-slate-400">{t('phone')}</label>
            <input id={`${formIdPrefix}-phone`} name="phone" type="tel" autoComplete="tel" className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor={`${formIdPrefix}-program`} className="mb-1 block text-sm text-slate-400">{t('program')} *</label>
            <select id={`${formIdPrefix}-program`} name="program" required className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none">
              <option value="">{t('programPlaceholder')}</option>
              <option value="ai-ml">{t('programAiMl')}</option>
              <option value="cs">{t('programCs')}</option>
              <option value="information-systems">{t('programIs')}</option>
              <option value="partnership">{t('programPartnership')}</option>
              <option value="faculty">{t('programFaculty')}</option>
              <option value="other">{t('programOther')}</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor={`${formIdPrefix}-message`} className="mb-1 block text-sm text-slate-400">{t('message')} *</label>
          <textarea id={`${formIdPrefix}-message`} name="message" required rows={4} className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-start gap-3">
            <input
              id={`${formIdPrefix}-privacy-consent`}
              name="privacyConsent"
              type="checkbox"
              value="true"
              required
              className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-400 focus:ring-amber-400"
            />
            <label htmlFor={`${formIdPrefix}-privacy-consent`} className="text-sm leading-6 text-slate-300">
              {t.rich('privacyConsent', {
                privacy: (chunks) => (
                  <Link href={localizedHref(lang, '/privacy')} className="underline underline-offset-4 hover:text-white">
                    {chunks}
                  </Link>
                ),
                disclosures: (chunks) => (
                  <Link href={localizedHref(lang, '/institutional-disclosures')} className="underline underline-offset-4 hover:text-white">
                    {chunks}
                  </Link>
                ),
              })}
            </label>
          </div>
        </div>
        {turnstileSiteKey && (
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
        )}
        {state === 'error' && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={state === 'loading'}>
          {state === 'loading' ? t('sending') : t('submit')}
        </Button>
      </form>
    </>
  )
}
