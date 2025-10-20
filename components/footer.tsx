export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4">বাংলাদেশ নির্বাচন কমিশন</h4>
            <p className="text-sm opacity-80 mb-4">গণতান্ত্রিক প্রক্রিয়া নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।</p>
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
            <h4 className="text-lg font-bold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  হোম
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  নির্বাচন
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  সংবাদ
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  নোটিশ
                </a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-lg font-bold mb-4">তথ্য</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  আইন ও নিয়ম
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  প্রশিক্ষণ
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  ডাউনলোড
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition">
                  সাইট ম্যাপ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">যোগাযোগ</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>ঢাকা, বাংলাদেশ</li>
              <li>ফোন: +880-2-XXXXXXXX</li>
              <li>ইমেইল: info@ecs.gov.bd</li>
              <li>সময়: সোম-শুক্র ৯-৫</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
            <p>&copy; ২০২৫ বাংলাদেশ নির্বাচন কমিশন। সর্বাধিকার সংরক্ষিত।</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:opacity-100 transition">
                গোপনীয়তা নীতি
              </a>
              <a href="#" className="hover:opacity-100 transition">
                ব্যবহারের শর্তাবলী
              </a>
              <a href="#" className="hover:opacity-100 transition">
                অ্যাক্সেসিবিলিটি
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
