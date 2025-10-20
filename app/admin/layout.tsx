import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - ECS Web Scraping',
  description: 'Monitor and manage ECS web scraping operations',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">ECS Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Web Scraping Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Site
              </a>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}