import RoleBasedSidebar from './RoleBasedSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <RoleBasedSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-x-hidden relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
