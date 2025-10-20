"use client"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

interface DropdownItem {
  label: string
  href: string
}

interface DropdownMenuProps {
  trigger: string
  items: DropdownItem[]
  className?: string
}

function DropdownMenu({ trigger, items, className = "" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors ${className}`}
      >
        {trigger}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-[500px] bg-white border rounded-md shadow-lg z-50 p-4"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <ul className="grid grid-cols-2 gap-2">
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="block p-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const electionItems = [
    { label: "নির্বাচন সূচী", href: "/election/schedule" },
    { label: "নোটিশ ও আদেশ", href: "/election/notices" },
    { label: "প্রশাসনিক নির্দেশনা", href: "/election/admin-guidelines" },
    { label: "নির্বাচন আইন", href: "/election/laws" },
    { label: "নির্বাচন পরিচালনা", href: "/election/management" }
  ]

  const serviceItems = [
    { label: "ভোটার নিবন্ধন", href: "/services/voter-registration" },
    { label: "এনআইডি সংশোধন", href: "/services/nid-correction" },
    { label: "ঠিকানা পরিবর্তন", href: "/services/address-change" },
    { label: "স্মার্টকার্ড", href: "/services/smart-card" }
  ]

  const publicationItems = [
    { label: "বার্ষিক প্রতিবেদন", href: "/publications/reports" },
    { label: "বিধিমালা", href: "/publications/rules" },
    { label: "হ্যান্ডবুক", href: "/publications/handbook" },
    { label: "গবেষণা", href: "/publications/research" }
  ]

  const mediaItems = [
    { label: "প্রেস বিজ্ঞপ্তি", href: "/media/press" },
    { label: "ছবি গ্যালারী", href: "/media/photos" },
    { label: "ভিডিও", href: "/media/videos" },
    { label: "সংবাদ", href: "/media/news" }
  ]

  const megaMenuItems = {
    schedule: [
      { label: "জাতীয় সংসদ", href: "/election/schedule/national" },
      { label: "স্থানীয় সরকার", href: "/election/schedule/local" },
      { label: "উপনির্বাচন", href: "/election/schedule/by-election" },
      { label: "অন্যান্য", href: "/election/schedule/others" }
    ],
    notices: [
      { label: "সর্বশেষ নোটিশ", href: "/notices/latest" },
      { label: "আদেশ", href: "/orders" },
      { label: "সার্কুলার", href: "/circulars" },
      { label: "আর্কাইভ", href: "/notices/archive" }
    ],
    admin: [
      { label: "পরিপত্র/প্রজ্ঞাপন", href: "/admin/directives" },
      { label: "অফিস আদেশ", href: "/admin/orders" },
      { label: "নির্দেশনা", href: "/admin/instructions" },
      { label: "ফর্মস", href: "/admin/forms" }
    ],
    laws: [
      { label: "Representation of the People Order, 1972", href: "/laws/rpo-1972" },
      { label: "নির্বাচনী বিধিমালা", href: "/laws/rules" },
      { label: "সংবিধানের সংশ্লিষ্ট অনুচ্ছেদ", href: "/laws/constitution" },
      { label: "অন্যান্য আইন", href: "/laws/others" }
    ],
    management: [
      { label: "প্রশিক্ষণ", href: "/management/training" },
      { label: "হ্যান্ডবুক", href: "/management/handbook" },
      { label: "নির্দেশিকা", href: "/management/guidelines" },
      { label: "রিসোর্স", href: "/management/resources" }
    ]
  }

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>English | বাংলা</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">ECS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">নির্বাচন কমিশন সচিবালয়</h1>
              <p className="text-muted-foreground">Election Commission Secretariat</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <a href="/" className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors">
              হোম
            </a>
            <DropdownMenu trigger="নির্বাচন" items={electionItems} />
            <DropdownMenu trigger="সেবা" items={serviceItems} />
            <DropdownMenu trigger="প্রকাশনা" items={publicationItems} />
            <DropdownMenu trigger="মিডিয়া" items={mediaItems} />
            <a href="/contact" className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors">
              যোগাযোগ
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-3 pb-4">
            <a href="#" className="text-foreground hover:text-accent-foreground font-medium transition py-2">
              হোম
            </a>
            <a href="#" className="text-foreground hover:text-accent-foreground font-medium transition py-2">
              নির্বাচন
            </a>
            <a href="#" className="text-foreground hover:text-accent-foreground font-medium transition py-2">
              সংবাদ
            </a>
            <a href="#" className="text-foreground hover:text-accent-foreground font-medium transition py-2">
              নোটিশ
            </a>
            <a href="#" className="text-foreground hover:text-accent-foreground font-medium transition py-2">
              যোগাযোগ
            </a>
          </nav>
        )}
      </div>

      {/* Mega Menu Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <a href="/" className="py-3 px-4 hover:bg-primary/80 transition-colors">
                হোম
              </a>
              <DropdownMenu 
                trigger="নির্বাচন সূচী" 
                items={megaMenuItems.schedule} 
                className="py-3 px-4 hover:bg-primary/80 transition-colors"
              />
              <DropdownMenu 
                trigger="নোটিশ ও আদেশ" 
                items={megaMenuItems.notices} 
                className="py-3 px-4 hover:bg-primary/80 transition-colors"
              />
              <DropdownMenu 
                trigger="প্রশাসনিক নির্দেশনা" 
                items={megaMenuItems.admin} 
                className="py-3 px-4 hover:bg-primary/80 transition-colors"
              />
              <DropdownMenu 
                trigger="নির্বাচন আইন" 
                items={megaMenuItems.laws} 
                className="py-3 px-4 hover:bg-primary/80 transition-colors"
              />
              <DropdownMenu 
                trigger="নির্বাচন পরিচালনা" 
                items={megaMenuItems.management} 
                className="py-3 px-4 hover:bg-primary/80 transition-colors"
              />
            </div>
            
            {/* Mobile Menu Button */}
             <button
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="md:hidden p-2 hover:bg-primary/80 rounded"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
             </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
