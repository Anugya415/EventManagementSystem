import TopNavigation from './TopNavigation';

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <TopNavigation />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <footer className="bg-muted/30 border-t border-border py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">🎪</span>
                </div>
                <span className="text-2xl font-bold premium-text-gradient">Festify</span>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Elevating the art of event management. We provide the tools for visionaries to create unforgettable experiences.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-foreground">Platform</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="/events" className="hover:text-primary transition-colors">Browse Events</a></li>
                <li><a href="/register" className="hover:text-primary transition-colors">Start Organizing</a></li>
                <li><a href="/pricing" className="hover:text-primary transition-colors">Premium Plans</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-foreground">Legal</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/support" className="hover:text-primary transition-colors">Support Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Festify Elite. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
