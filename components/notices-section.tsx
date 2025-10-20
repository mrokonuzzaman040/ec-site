export default function NoticesSection() {
  const notices = [
    {
      id: 1,
      title: "নির্বাচন কমিশন নোটিশ নং-১",
      date: "২০ অক্টোবর ২০২৫",
      type: "নোটিশ",
    },
    {
      id: 2,
      title: "প্রশাসনিক আদেশ নং-২৫",
      date: "১৮ অক্টোবর ২০২৫",
      type: "আদেশ",
    },
    {
      id: 3,
      title: "সার্কুলার নং-০৫/২০২৫",
      date: "১৬ অক্টোবর ২০২৫",
      type: "সার্কুলার",
    },
    {
      id: 4,
      title: "গুরুত্বপূর্ণ ঘোষণা",
      date: "১৪ অক্টোবর ২০২৫",
      type: "ঘোষণা",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">নোটিশ ও আদেশ</h2>
          <div className="w-16 h-1 rounded-full bg-primary"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-card p-6 rounded-lg border border-border hover:border-primary transition cursor-pointer group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs font-semibold bg-opacity-10 px-3 py-1 rounded-full text-background bg-primary">
                      {notice.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition mb-2">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{notice.date}</p>
                </div>
                <div className="text-2xl">📄</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition bg-primary">
            সকল নোটিশ দেখুন
          </button>
        </div>
      </div>
    </section>
  )
}
