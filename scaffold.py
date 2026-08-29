import os

routes = [
    # Public pages
    "src/app/practice-areas/page.tsx",
    "src/app/lawyers/page.tsx",
    "src/app/testimonials/page.tsx",
    "src/app/gallery/page.tsx",
    "src/app/blog/page.tsx",
    "src/app/contact/page.tsx",
    "src/app/booking/page.tsx",
    "src/app/faqs/page.tsx",
    "src/app/about/page.tsx",
    
    # Admin Panel (15 CRUD modules - stubbing main layout and a few)
    "src/app/admin/layout.tsx",
    "src/app/admin/page.tsx",
    "src/app/admin/users/page.tsx",
    "src/app/admin/cases/page.tsx",
    "src/app/admin/documents/page.tsx",
    "src/app/admin/appointments/page.tsx",
    "src/app/admin/billing/page.tsx",
    "src/app/admin/settings/page.tsx",
    # (other 9 modules can be similar folders)
    "src/app/admin/lawyers/page.tsx",
    "src/app/admin/practice-areas/page.tsx",
    "src/app/admin/blogs/page.tsx",
    "src/app/admin/faqs/page.tsx",
    "src/app/admin/testimonials/page.tsx",
    "src/app/admin/messages/page.tsx",
    "src/app/admin/analytics/page.tsx",
    "src/app/admin/reports/page.tsx",
    "src/app/admin/roles/page.tsx",
    
    # Client Portal
    "src/app/portal/layout.tsx",
    "src/app/portal/page.tsx",
    "src/app/portal/login/page.tsx",
    "src/app/portal/register/page.tsx",
    "src/app/portal/dashboard/page.tsx",
    "src/app/portal/cases/page.tsx",
    "src/app/portal/documents/page.tsx",
    "src/app/portal/invoices/page.tsx",
    
    # API Routes
    "src/app/api/auth/[...nextauth]/route.ts",
    "src/app/api/stripe/webhook/route.ts",
    "src/app/api/cases/route.ts",
    "src/app/api/users/route.ts",
]

base_content = """export default function Page() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-serif font-bold mb-4">{TITLE}</h1>
      <p className="font-sans text-gray-600">This module is currently under construction.</p>
    </div>
  );
}
"""

layout_content = """export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Navigation</h2>
        {/* Navigation links would go here */}
      </aside>
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
"""

api_content = """import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
"""

for route in routes:
    os.makedirs(os.path.dirname(route), exist_ok=True)
    if "layout.tsx" in route:
        with open(route, "w") as f:
            f.write(layout_content)
    elif "api/" in route:
        with open(route, "w") as f:
            f.write(api_content)
    else:
        title = route.split("/")[-2].replace("-", " ").title() if "page.tsx" in route and len(route.split("/")) > 3 else "Page"
        if title == "App": title = "Dashboard"
        with open(route, "w") as f:
            f.write(base_content.replace("{TITLE}", title))

print("Scaffolded all routes.")
