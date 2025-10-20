"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

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
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-foreground hover:text-primary font-medium transition">
              হোম
            </a>
            <a href="#" className="text-foreground hover:text-primary font-medium transition">
              নির্বাচন
            </a>
            <a href="#" className="text-foreground hover:text-primary font-medium transition">
              সংবাদ
            </a>
            <a href="#" className="text-foreground hover:text-primary font-medium transition">
              নোটিশ
            </a>
            <a href="#" className="text-foreground hover:text-primary font-medium transition">
              যোগাযোগ
            </a>
          </nav>

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
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6 overflow-x-auto text-sm font-medium">
          <a href="#" className="hover:opacity-80 whitespace-nowrap">
            হোম
          </a>
          <a href="#" className="hover:opacity-80 whitespace-nowrap">
            নির্বাচন সূচী
          </a>
          <a href="#" className="hover:opacity-80 whitespace-nowrap">
            নোটিশ ও আদেশ
          </a>
          <a href="#" className="hover:opacity-80 whitespace-nowrap">
            প্রশাসনিক নির্দেশনা
          </a>
          <a href="#" className="hover:opacity-80 whitespace-nowrap">
            নির্বাচন আইন
          </a>
          <a href="#" className="hover:opacity-80 whitespace-nowrap">
            নির্বাচন পরিচালনা
          </a>
        </div>
      </div>
    </header>
  )
}
