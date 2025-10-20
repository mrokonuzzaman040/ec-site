'use client'

import { useLanguage } from '@/contexts/language-context'

export default function HeroSection() {
  const { t } = useLanguage()
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t('hero.title')}</h2>
            <p className="text-lg mb-8 opacity-95">
              {t('hero.description')}
            </p>
            <div className="flex gap-4">
              <button className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
                {t('hero.learnMore')}
              </button>
              <button className="border-2 border-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition">
                {t('hero.contact')}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-lg px-8">
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗳️</div>
                <p className="text-foreground font-semibold">{t('hero.electionProcess')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
