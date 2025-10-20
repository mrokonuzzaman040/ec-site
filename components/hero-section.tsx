export default function HeroSection() {
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">স্বচ্ছ ও নিরপেক্ষ নির্বাচন</h2>
            <p className="text-lg mb-8 opacity-95">
              বাংলাদেশ নির্বাচন কমিশন গণতান্ত্রিক প্রক্রিয়া নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। আমরা সকল নির্বাচনে স্বচ্ছতা, নিরপেক্ষতা এবং সততা বজায়
              রাখি।
            </p>
            <div className="flex gap-4">
              <button className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
                আরও জানুন
              </button>
              <button className="border-2 border-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition">
                যোগাযোগ করুন
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-lg px-8">
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗳️</div>
                <p className="text-foreground font-semibold">নির্বাচন প্রক্রিয়া</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
