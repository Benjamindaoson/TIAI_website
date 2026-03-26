'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm({ lang }: { lang: string }) {
  const t = useTranslations('Contact')
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      })
      if (!res.ok) throw new Error(await res.text())
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setState('error')
    }
  }

  if (state === 'success') {
    return <div className="p-6 rounded-lg bg-green-900/30 border border-green-700 text-green-300">{t('successMessage')}</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">{t('name')} *</label>
          <input name="name" required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">{t('email')} *</label>
          <input name="email" type="email" required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">{t('phone')}</label>
          <input name="phone" type="tel" className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">{t('program')} *</label>
          <select name="program" required className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500">
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
        <label className="block text-sm text-slate-400 mb-1">{t('message')} *</label>
        <textarea name="message" required rows={4} className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500" />
      </div>
      {state === 'error' && <p className="text-red-400 text-sm">{error}</p>}
      <Button type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? t('sending') : t('submit')}
      </Button>
    </form>
  )
}
