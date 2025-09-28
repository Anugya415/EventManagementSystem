import TopNavigation from './TopNavigation';

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
