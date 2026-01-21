'use client';

import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import {
  ArrowRight,
  Calendar,
  Users,
  Zap,
  ShieldCheck,
  BarChart3,
  MapPin,
  Ticket,
  Sparkles,
  Layout
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await api.events.getAll();
        if (response.ok) {
          const events = await response.json();
          const now = new Date();
          const upcoming = events
            .filter(event => new Date(event.startDateTime) > now && event.status === 'ACTIVE')
            .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
            .slice(0, 3);
          setUpcomingEvents(upcoming);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 premium-gradient rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <Layout className="text-white w-8 h-8" />
          </div>
          <p className="text-xl font-bold premium-text-gradient">Returning to Workspace...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      title: "Effortless Control",
      description: "Manage complex event logistics with a minimal, intuitive interface designed for speed.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Smart Ticketing",
      description: "Secure, real-time ticket distribution with dynamic pricing and instant QR validation.",
      icon: Ticket,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Actionable Insights",
      description: "Deep dive into attendee behavior and revenue metrics with our advanced dashboard.",
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <div className="relative isolate">
      {/* Background Decorative Elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-6 py-1.5 px-4 bg-primary/5 text-primary border-primary/20 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse" />
              Revolutionizing Event Management
            </Badge>
            <h1 className="text-5xl lg:text-8xl font-black tracking-tight text-foreground sm:text-7xl mb-8 animate-fade-in delay-100">
              Transform Your <br />
              <span className="premium-text-gradient">Event Experience</span>
            </h1>
            <p className="mt-8 text-lg lg:text-xl leading-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-200">
              The elite platform for visionaries. Host conferences, festivals, and exclusive gatherings with the world's most sophisticated toolkit.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6 animate-fade-in delay-300">
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 text-lg font-bold premium-gradient hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] transition-all">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-bold border-2 hover:bg-muted/50 transition-all">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="glass-card bg-white/50 dark:bg-black/20 border-white/20">
                <CardHeader>
                  <div className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="text-left">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">Trending Live Events</h2>
              <p className="text-xl text-muted-foreground">Join thousands of others at our most anticipated gatherings.</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 p-0 hover:p-4 transition-all">
                View All Events <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[240px] w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <Card key={event.id} className="group overflow-hidden border-none shadow-none bg-transparent hover:-translate-y-2 transition-all duration-500">
                  <div className="relative h-72 rounded-3xl overflow-hidden mb-6 shadow-xl">
                    <img
                      src={`https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80&sig=${event.id}`}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <Badge className="absolute top-6 right-6 bg-white/90 backdrop-blur text-black font-bold uppercase tracking-wider text-[10px] px-3">
                      {event.type}
                    </Badge>
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="flex items-center text-xs font-medium bg-primary/20 backdrop-blur w-fit px-2 py-1 rounded-lg mb-2 border border-white/20">
                        <Calendar className="w-3 h-3 mr-2" />
                        {new Date(event.startDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-1">{event.name}</CardTitle>
                    <div className="flex items-center text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{event.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-0 mt-6 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground uppercase">From</span>
                      <p className="text-2xl font-black text-foreground">₹{event.price.toLocaleString()}</p>
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <Button className="rounded-xl premium-gradient px-6 font-bold shadow-lg shadow-primary/20">
                        Book Spot
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-full py-20 bg-muted/50 border-dashed border-2 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Calendar className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <CardTitle className="text-2xl">Quiet for now...</CardTitle>
                <CardDescription className="text-lg mt-2">New experiences are being curated just for you.</CardDescription>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto premium-gradient rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

          <h2 className="text-4xl lg:text-6xl font-black mb-8 relative z-10">Host Your Next Elite <br /> Event with Ease</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 relative z-10 leading-relaxed font-medium">
            Join the world's most innovative organizers using Festify to sell out shows, power conferences, and build local communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/register">
              <Button variant="secondary" size="lg" className="h-16 px-12 text-lg font-bold text-primary rounded-2xl bg-white hover:bg-white/90">
                Register as Organizer
              </Button>
            </Link>
            <Button size="lg" className="h-16 px-12 text-lg font-bold rounded-2xl bg-white/10 backdrop-blur border-none hover:bg-white/20">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Decorative Blur Bottom */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </div>
  );
}
