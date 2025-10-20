export default function NewsSection() {
  const news = [
    {
      id: 1,
      title: "নতুন নির্বাচন কমিশন গঠিত হয়েছে",
      date: "২০ অক্টোবর ২০২৫",
      category: "সংবাদ",
      excerpt: "নতুন নির্বাচন কমিশন আজ আনুষ্ঠানিকভাবে গঠিত হয়েছে যা আগামী নির্বাচনগুলি পরিচালনা করবে।",
    },
    {
      id: 2,
      title: "ডিজিটাল নির্বাচন ব্যবস্থা চালু হচ্ছে",
      date: "১৮ অক্টোবর ২০২৫",
      category: "আপডেট",
      excerpt: "আধুনিক প্রযুক্তি ব্যবহার করে নির্বাচন প্রক্রিয়া আরও স্বচ্ছ এবং দক্ষ করা হবে।",
    },
    {
      id: 3,
      title: "প্রশিক্ষণ কর্মসূচি সম্পন্ন হয়েছে",
      date: "১৫ অক্টোবর ২০২৫",
      category: "ঘোষণা",
      excerpt: "নির্বাচন কর্মীদের জন্য ব্যাপক প্রশিক্ষণ কর্মসূচি সফলভাবে সম্পন্ন হয়েছে।",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">সর্বশেষ সংবাদ</h2>
          <div className="w-16 h-1 rounded-full bg-secondary"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition"
            >
              <div className="h-32 flex items-center justify-center bg-secondary">
                <span className="text-4xl">📰</span>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-semibold bg-opacity-10 px-3 py-1 rounded-full bg-secondary text-background">
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.excerpt}</p>
                <a href="#" className="font-semibold hover:text-secondary transition text-secondary">
                  আরও পড়ুন →
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition bg-secondary">
            সকল সংবাদ দেখুন
          </button>
        </div>
      </div>
    </section>
  )
}
