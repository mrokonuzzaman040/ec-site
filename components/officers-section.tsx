export default function OfficersSection() {
  const officers = [
    {
      id: 1,
      name: "ড. মোহাম্মদ সালিম উদ্দিন",
      title: "প্রধান নির্বাচন কমিশনার",
      image: "👨‍💼",
    },
    {
      id: 2,
      name: "মিসেস ফাতিমা বেগম",
      title: "নির্বাচন কমিশনার",
      image: "👩‍💼",
    },
    {
      id: 3,
      name: "মোহাম্মদ করিম আহমেদ",
      title: "নির্বাচন কমিশনার",
      image: "👨‍💼",
    },
    {
      id: 4,
      name: "ড. আবদুল হাসান",
      title: "নির্বাচন কমিশনার",
      image: "👨‍💼",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">নির্বাচন কমিশনের সদস্যবৃন্দ</h2>
          <div className="w-16 h-1 bg-primary rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {officers.map((officer) => (
            <div
              key={officer.id}
              className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition text-center"
            >
              <div className="bg-primary h-40 flex items-center justify-center text-6xl">{officer.image}</div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">{officer.name}</h3>
                <p className="text-sm text-primary font-semibold">{officer.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
