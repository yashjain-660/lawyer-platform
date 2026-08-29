export default function Layout({ children }: { children: React.ReactNode }) {
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
