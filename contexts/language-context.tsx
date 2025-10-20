'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'bn'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.retry': 'Retry',
    'common.viewAll': 'View All',
    'common.readMore': 'Read More',
    'common.download': 'Download',
    'common.scrapeData': 'Scrape Data',
    'common.noDataFound': 'No data found',
    
    // News Section
    'news.title': 'Latest News',
    'news.viewAll': 'View All News',
    'news.noNews': 'No news found',
    'news.scrapeNews': 'Scrape News Data',
    'news.failedToLoad': 'Failed to load news',
    
    // Notices Section
    'notices.title': 'Important Notices',
    'notices.viewAll': 'View All Notices',
    'notices.noNotices': 'No notices found',
    'notices.scrapeNotices': 'Scrape Notices Data',
    'notices.failedToLoad': 'Failed to load notices',
    'notices.priority.high': 'High Priority',
    'notices.priority.medium': 'Medium Priority',
    'notices.priority.low': 'Low Priority',
    
    // Officers Section
    'officers.title': 'Our Officers',
    'officers.viewAll': 'View All Officers',
    'officers.noOfficers': 'No officers found',
    'officers.noOfficersDescription': 'No officers data available at the moment',
    'officers.scrapingOfficers': 'Scraping officers data...',
    'officers.scrapeOfficers': 'Scrape Officers Data',
    'officers.errorLoading': 'Error loading officers',
    'officers.unknownOfficer': 'Unknown Officer',
    'officers.officer': 'Officer',
    
    // Hero Section
    'hero.title': 'Election Commission Secretariat',
    'hero.description': 'Ensuring free, fair, and credible elections in Bangladesh',
    'hero.learnMore': 'Learn More',
    'hero.contact': 'Contact Us',
    'hero.electionProcess': 'Election Process',
    
    // Footer
    'footer.about.title': 'About',
    'footer.about.description': 'The Election Commission Secretariat is responsible for conducting free, fair, and credible elections in Bangladesh.',
    'footer.quickLinks.title': 'Quick Links',
    'footer.quickLinks.home': 'Home',
    'footer.quickLinks.elections': 'Elections',
    'footer.quickLinks.news': 'News',
    'footer.quickLinks.notices': 'Notices',
    'footer.information.title': 'Information',
    'footer.information.laws': 'Election Laws',
    'footer.information.training': 'Training',
    'footer.information.downloads': 'Downloads',
    'footer.information.sitemap': 'Sitemap',
    'footer.contact.title': 'Contact',
    'footer.contact.address': 'Agargaon, Dhaka-1207, Bangladesh',
    'footer.contact.phone': 'Phone: +880-2-8181185',
    'footer.contact.email': 'Email: info@ecs.gov.bd',
    'footer.contact.hours': 'Office Hours: 9:00 AM - 5:00 PM',
    'footer.copyright': '© 2024 Election Commission Secretariat. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.accessibility': 'Accessibility',
    
    // Admin Dashboard
    'admin.title': 'Admin Dashboard',
    'admin.description': 'Monitor and manage web scraping operations',
    'admin.backToSite': 'Back to Main Site',
    'admin.statistics': 'Statistics',
    'admin.recentLogs': 'Recent Scraping Logs',
    'admin.triggerScrape': 'Trigger Full Scrape',
    'admin.stats.totalNews': 'Total News',
    'admin.stats.totalNotices': 'Total Notices',
    'admin.stats.totalOfficers': 'Total Officers',
    'admin.stats.totalElections': 'Total Elections',
    'admin.systemStatus.title': 'System Status',
    'admin.systemStatus.scrapingStatus': 'Scraping Status',
    'admin.systemStatus.successRate': 'Success Rate',
    'admin.systemStatus.totalScrapes': 'Total Scrapes',
    'admin.systemStatus.lastScrape': 'Last Scrape',
    'admin.systemStatus.never': 'Never',
    'admin.quickActions.title': 'Quick Actions',
    'admin.quickActions.triggerFullScrape': 'Trigger Full Scrape',
    'admin.quickActions.scrapingAll': 'Scraping All Data...',
    'admin.quickActions.refreshDashboard': 'Refresh Dashboard',
    'admin.logs.title': 'Recent Scraping Logs',
    'admin.logs.description': 'Latest scraping activities and their status',
    'admin.logs.noLogs': 'No scraping logs found',
    'admin.logs.scraping': 'scraping',
    'admin.logs.items': 'items',
    'admin.status.success': 'Success',
    'admin.status.error': 'Error',
    'admin.status.running': 'Running',
    'admin.status.idle': 'Idle',
    'admin.status.unknown': 'Unknown',
    'admin.failedToLoad': 'Failed to load dashboard data',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.about': 'সম্পর্কে',
    'nav.services': 'সেবাসমূহ',
    'nav.contact': 'যোগাযোগ',
    'nav.admin': 'অ্যাডমিন',
    
    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'ত্রুটি ঘটেছে',
    'common.retry': 'পুনরায় চেষ্টা করুন',
    'common.viewAll': 'সব দেখুন',
    'common.readMore': 'আরও পড়ুন',
    'common.download': 'ডাউনলোড',
    'common.scrapeData': 'ডেটা সংগ্রহ করুন',
    'common.noDataFound': 'কোন তথ্য পাওয়া যায়নি',
    
    // News Section
    'news.title': 'সর্বশেষ সংবাদ',
    'news.viewAll': 'সব সংবাদ দেখুন',
    'news.noNews': 'কোন সংবাদ পাওয়া যায়নি',
    'news.scrapeNews': 'সংবাদ ডেটা সংগ্রহ করুন',
    'news.failedToLoad': 'সংবাদ লোড করতে ব্যর্থ',
    
    // Notices Section
    'notices.title': 'গুরুত্বপূর্ণ নোটিশ',
    'notices.viewAll': 'সব নোটিশ দেখুন',
    'notices.noNotices': 'কোন নোটিশ পাওয়া যায়নি',
    'notices.scrapeNotices': 'নোটিশ ডেটা সংগ্রহ করুন',
    'notices.failedToLoad': 'নোটিশ লোড করতে ব্যর্থ',
    'notices.priority.high': 'উচ্চ অগ্রাধিকার',
    'notices.priority.medium': 'মধ্যম অগ্রাধিকার',
    'notices.priority.low': 'নিম্ন অগ্রাধিকার',
    
    // Officers Section
    'officers.title': 'আমাদের কর্মকর্তাগণ',
    'officers.viewAll': 'সব কর্মকর্তা দেখুন',
    'officers.noOfficers': 'কোন কর্মকর্তা পাওয়া যায়নি',
    'officers.noOfficersDescription': 'এই মুহূর্তে কোন কর্মকর্তার তথ্য উপলব্ধ নেই',
    'officers.scrapingOfficers': 'কর্মকর্তা ডেটা সংগ্রহ করা হচ্ছে...',
    'officers.scrapeOfficers': 'কর্মকর্তা ডেটা সংগ্রহ করুন',
    'officers.errorLoading': 'কর্মকর্তা লোড করতে ত্রুটি',
    'officers.unknownOfficer': 'অজানা কর্মকর্তা',
    'officers.officer': 'কর্মকর্তা',
    
    // Hero Section
    'hero.title': 'নির্বাচন কমিশন সচিবালয়',
    'hero.description': 'বাংলাদেশে অবাধ, সুষ্ঠু ও বিশ্বাসযোগ্য নির্বাচন নিশ্চিতকরণ',
    'hero.learnMore': 'আরও জানুন',
    'hero.contact': 'যোগাযোগ করুন',
    'hero.electionProcess': 'নির্বাচনী প্রক্রিয়া',
    
    // Footer
    'footer.about.title': 'সম্পর্কে',
    'footer.about.description': 'নির্বাচন কমিশন সচিবালয় বাংলাদেশে অবাধ, সুষ্ঠু ও বিশ্বাসযোগ্য নির্বাচন পরিচালনার জন্য দায়বদ্ধ।',
    'footer.quickLinks.title': 'দ্রুত লিংক',
    'footer.quickLinks.home': 'হোম',
    'footer.quickLinks.elections': 'নির্বাচন',
    'footer.quickLinks.news': 'সংবাদ',
    'footer.quickLinks.notices': 'নোটিশ',
    'footer.information.title': 'তথ্য',
    'footer.information.laws': 'নির্বাচনী আইন',
    'footer.information.training': 'প্রশিক্ষণ',
    'footer.information.downloads': 'ডাউনলোড',
    'footer.information.sitemap': 'সাইটম্যাপ',
    'footer.contact.title': 'যোগাযোগ',
    'footer.contact.address': 'আগারগাঁও, ঢাকা-১২০৭, বাংলাদেশ',
    'footer.contact.phone': 'ফোন: +৮৮০-২-৮১৮১১৮৫',
    'footer.contact.email': 'ইমেইল: info@ecs.gov.bd',
    'footer.contact.hours': 'অফিস সময়: সকাল ৯:০০ - বিকাল ৫:০০',
    'footer.copyright': '© ২০২৪ নির্বাচন কমিশন সচিবালয়। সকল অধিকার সংরক্ষিত।',
    'footer.privacy': 'গোপনীয়তা নীতি',
    'footer.terms': 'ব্যবহারের শর্তাবলী',
    'footer.accessibility': 'অ্যাক্সেসিবিলিটি',
    
    // Admin Dashboard
    'admin.title': 'অ্যাডমিন ড্যাশবোর্ড',
    'admin.description': 'ওয়েব স্ক্র্যাপিং অপারেশন পর্যবেক্ষণ ও পরিচালনা করুন',
    'admin.backToSite': 'মূল সাইটে ফিরে যান',
    'admin.statistics': 'পরিসংখ্যান',
    'admin.recentLogs': 'সাম্প্রতিক স্ক্র্যাপিং লগ',
    'admin.triggerScrape': 'সম্পূর্ণ স্ক্র্যাপ ট্রিগার করুন',
    'admin.stats.totalNews': 'মোট সংবাদ',
    'admin.stats.totalNotices': 'মোট নোটিশ',
    'admin.stats.totalOfficers': 'মোট কর্মকর্তা',
    'admin.stats.totalElections': 'মোট নির্বাচন',
    'admin.systemStatus.title': 'সিস্টেম স্ট্যাটাস',
    'admin.systemStatus.scrapingStatus': 'স্ক্র্যাপিং স্ট্যাটাস',
    'admin.systemStatus.successRate': 'সফলতার হার',
    'admin.systemStatus.totalScrapes': 'মোট স্ক্র্যাপ',
    'admin.systemStatus.lastScrape': 'শেষ স্ক্র্যাপ',
    'admin.systemStatus.never': 'কখনো নয়',
    'admin.quickActions.title': 'দ্রুত কার্যক্রম',
    'admin.quickActions.triggerFullScrape': 'সম্পূর্ণ স্ক্র্যাপ ট্রিগার করুন',
    'admin.quickActions.scrapingAll': 'সব ডেটা স্ক্র্যাপ করা হচ্ছে...',
    'admin.quickActions.refreshDashboard': 'ড্যাশবোর্ড রিফ্রেশ করুন',
    'admin.logs.title': 'সাম্প্রতিক স্ক্র্যাপিং লগ',
    'admin.logs.description': 'সর্বশেষ স্ক্র্যাপিং কার্যক্রম এবং তাদের অবস্থা',
    'admin.logs.noLogs': 'কোন স্ক্র্যাপিং লগ পাওয়া যায়নি',
    'admin.logs.scraping': 'স্ক্র্যাপিং',
    'admin.logs.items': 'আইটেম',
    'admin.status.success': 'সফল',
    'admin.status.error': 'ত্রুটি',
    'admin.status.running': 'চলমান',
    'admin.status.idle': 'নিষ্ক্রিয়',
    'admin.status.unknown': 'অজানা',
    'admin.failedToLoad': 'ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('bn') // Default to Bengali

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'bn')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}