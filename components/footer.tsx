'use client'

import { useLanguage } from '@/contexts/language-context'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4">{t('footer.about.title')}</h4>
            <p className="text-sm opacity-80 mb-4">{t('footer.about.description')}</p>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-80 transition">
                f
              </a>
              <a href="#" className="hover:opacity-80 transition">
                𝕏
              </a>
              <a href="#" className="hover:opacity-80 transition">
                in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">{t('footer.quickLinks.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  {t('footer.quickLinks.home')}
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  {t('footer.quickLinks.elections')}
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  {t('footer.quickLinks.news')}
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  {t('footer.quickLinks.notices')}
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg font-bold mb-4">{t('footer.information.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  {t('footer.information.laws')}
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  {t('footer.information.training')}
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  {t('footer.information.downloads')}
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  {t('footer.information.sitemap')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">{t('footer.contact.title')}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>{t('footer.contact.address')}</li>
              <li>{t('footer.contact.phone')}</li>
              <li>{t('footer.contact.email')}</li>
              <li>{t('footer.contact.hours')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
            <p>{t('footer.copyright')}</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:opacity-100 transition">
                {t('footer.privacy')}
              </a>
              <a href="#" className="hover:opacity-100 transition">
                {t('footer.terms')}
              </a>
              <a href="#" className="hover:opacity-100 transition">
                {t('footer.accessibility')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
