import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import NewsSection from "@/components/news-section"
import NoticesSection from "@/components/notices-section"
import OfficersSection from "@/components/officers-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <NewsSection />
      <NoticesSection />
      <OfficersSection />
      <Footer />
    </main>
  )
}
