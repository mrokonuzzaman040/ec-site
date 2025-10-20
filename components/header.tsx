"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <a href="#" className="hover:opacity-80">
              বাংলা
            </a>
            <span>|</span>
            <a href="#" className="hover:opacity-80">
              English
            </a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:opacity-80">
              সাইট ম্যাপ
            </a>
            <span>|</span>
            <a href="#" className="hover:opacity-80">
              যোগাযোগ
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              ঢ
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">বাংলাদেশ নির্বাচন কমিশন</h1>
              <p className="text-sm text-muted-foreground">Bangladesh Election Commission</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="text-foreground font-medium">
                  হোম
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>নির্বাচন</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[500px] lg:w-[600px]">
                    <ul className="grid grid-cols-2 gap-2">
                      <li>
                        <NavigationMenuLink href="/election/schedule">নির্বাচন সূচী</NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="/election/notices">নোটিশ ও আদেশ</NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="/election/admin-guidelines">প্রশাসনিক নির্দেশনা</NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="/election/laws">নির্বাচন আইন</NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="/election/management">নির্বাচন পরিচালনা</NavigationMenuLink>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>সেবা</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[400px] lg:w-[500px]">
                    <ul className="grid grid-cols-2 gap-2">
                      <li><NavigationMenuLink href="/services/voter-registration">ভোটার নিবন্ধন</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/services/nid-correction">এনআইডি সংশোধন</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/services/address-change">ঠিকানা পরিবর্তন</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/services/smart-card">স্মার্টকার্ড</NavigationMenuLink></li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>প্রকাশনা</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[400px] lg:w-[500px]">
                    <ul className="grid grid-cols-2 gap-2">
                      <li><NavigationMenuLink href="/publications/reports">বার্ষিক প্রতিবেদন</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/publications/rules">বিধিমালা</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/publications/handbook">হ্যান্ডবুক</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/publications/research">গবেষণা</NavigationMenuLink></li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>মিডিয়া</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[400px] lg:w-[500px]">
                    <ul className="grid grid-cols-2 gap-2">
                      <li><NavigationMenuLink href="/media/press">প্রেস বিজ্ঞপ্তি</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/media/photos">ছবি গ্যালারী</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/media/videos">ভিডিও</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/media/news">সংবাদ</NavigationMenuLink></li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className="text-foreground font-medium">
                  যোগাযোগ
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-3 pb-4">
            <a href="#" className="text-foreground hover:text-primary font-medium transition py-2">
              হোম
            </a>
            <a href="#" className="text-foreground hover:text-primary font-medium transition py-2">
              নির্বাচন
            </a>
            <a href="#" className="text-foreground hover:text-primary font-medium transition py-2">
              সংবাদ
            </a>
            <a href="#" className="text-foreground hover:text-primary font-medium transition py-2">
              নোটিশ
            </a>
            <a href="#" className="text-foreground hover:text-primary font-medium transition py-2">
              যোগাযোগ
            </a>
          </nav>
        )}
      </div>

      {/* Mega Menu Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <NavigationMenu className="w-full justify-start" viewport={true}>
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="bg-transparent text-primary-foreground hover:bg-primary/20 rounded px-3 py-2">
                  হোম
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-primary/20 rounded px-3 py-2">
                  নির্বাচন সূচী
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[500px] lg:w-[600px]">
                    <ul className="grid grid-cols-2 gap-2">
                      <li><NavigationMenuLink href="/election/schedule/national">জাতীয় সংসদ</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/election/schedule/local">স্থানীয় সরকার</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/election/schedule/by-election">উপনির্বাচন</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/election/schedule/others">অন্যান্য</NavigationMenuLink></li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-primary/20 rounded px-3 py-2">
                  নোটিশ ও আদেশ
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[500px] lg:w-[600px]">
                    <ul className="grid grid-cols-2 gap-2">
                      <li><NavigationMenuLink href="/notices/latest">সর্বশেষ নোটিশ</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/orders">আদেশ</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/circulars">সার্কুলার</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/notices/archive">আর্কাইভ</NavigationMenuLink></li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-primary/20 rounded px-3 py-2">
                  প্রশাসনিক নির্দেশনা
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[500px] lg:w-[600px]">
                    <ul className="grid grid-cols-2 gap-2">
                      <li><NavigationMenuLink href="/admin/directives">পরিপত্র/প্রজ্ঞাপন</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/admin/orders">অফিস আদেশ</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/admin/instructions">নির্দেশনা</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/admin/forms">ফর্মস</NavigationMenuLink></li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-primary/20 rounded px-3 py-2">
                  নির্বাচন আইন
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[500px] lg:w-[600px]">
                    <ul className="grid grid-cols-2 gap-2">
                      <li><NavigationMenuLink href="/laws/rpo-1972">Representation of the People Order, 1972</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/laws/rules">নির্বাচনী বিধিমালা</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/laws/constitution">সংবিধানের সংশ্লিষ্ট অনুচ্ছেদ</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/laws/others">অন্যান্য আইন</NavigationMenuLink></li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-primary-foreground hover:bg-primary/20 rounded px-3 py-2">
                  নির্বাচন পরিচালনা
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 md:w-[500px] lg:w-[600px]">
                    <ul className="grid grid-cols-2 gap-2">
                      <li><NavigationMenuLink href="/management/training">প্রশিক্ষণ</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/management/handbook">হ্যান্ডবুক</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/management/guidelines">নির্দেশিকা</NavigationMenuLink></li>
                      <li><NavigationMenuLink href="/management/resources">রিসোর্স</NavigationMenuLink></li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}
