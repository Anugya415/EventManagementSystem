'use client';

import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import {
  Rocket,
  Target,
  Users,
  ShieldCheck,
  Sparkles,
  Globe,
  ArrowRight,
  Code2,
  Paintbrush,
  LineChart,
  Heart,
  Calendar
} from 'lucide-react';

export default function AboutPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -z-10 translate-y-1/2 -translate-x-1/4"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-8 animate-fade-in">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]">
            The Festify Origin
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9]">
            Architecting <br />
            <span className="premium-text-gradient">Experiences.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-muted-foreground font-medium leading-relaxed">
            We don't just build software; we build the digital infrastructure for humanity's most memorable moments. Festify is where high-technology meets high-touch event management.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <Link href="/register">
              <Button size="lg" className="premium-gradient h-14 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:translate-y-[-2px] transition-all">
                Join the Network
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-black text-lg border-2 hover:bg-primary/5 transition-all">
                Talk to Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center shadow-xl">
              <Target className="text-white w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              A Mission to <br />
              <span className="text-primary italic">Universalize</span> Success.
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg font-medium leading-relaxed">
              <p>
                Festify was born from a singular vision: event organizers shouldn't be bogged down by logistics. They should be free to create art, foster connections, and build communities.
              </p>
              <p>
                By engineering a platform that handles everything from identity verification to real-time revenue analytics, we've returned the "creative" to the "creative director."
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card className="glass-card border-none mt-12">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Rocket className="text-blue-500 w-6 h-6" />
                </div>
                <h3 className="font-black text-lg">Hyper-Scale</h3>
                <p className="text-sm text-muted-foreground font-bold">Engineered for 100 to 1M+ attendees seamlessly.</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-none">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="text-emerald-500 w-6 h-6" />
                </div>
                <h3 className="font-black text-lg">Fortified</h3>
                <p className="text-sm text-muted-foreground font-bold">Military-grade protection for your user data.</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-none mt-[-1rem]">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-purple-500 w-6 h-6" />
                </div>
                <h3 className="font-black text-lg">Immersive</h3>
                <p className="text-sm text-muted-foreground font-bold">Unrivaled UX for both organizers and guests.</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-none mt-[-3rem]">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Globe className="text-amber-500 w-6 h-6" />
                </div>
                <h3 className="font-black text-lg">Ubiquitous</h3>
                <p className="text-sm text-muted-foreground font-bold">Access your command center from any device.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 premium-gradient opacity-90 skew-y-[-2deg] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "EVENT MANIFESTED", value: "24K+" },
              { label: "GLOBAL ATTENDEES", value: "2.1M" },
              { label: "REVENUE PROCESSED", value: "₹450Cr" },
              { label: "USER SATISFACTION", value: "99.8%" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-5xl md:text-6xl font-black tracking-tighter">{stat.value}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-black text-primary uppercase tracking-[0.2em]">The Architects</h2>
            <h3 className="text-5xl font-black tracking-tight">The Minds Behind the Machine.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Alex Chen", role: "Logic Architect", desc: "Crafting the invisible infrastructure that powers millions of interactions.", icon: Code2, color: "text-blue-500" },
              { name: "Sarah Johnson", role: "Visual Director", desc: "Redefining the aesthetic boundary and interaction model of event tech.", icon: Paintbrush, color: "text-pink-500" },
              { name: "Michael Rodriguez", role: "Strategy Lead", desc: "Aligning global event trends with high-performance digital tools.", icon: LineChart, color: "text-emerald-500" },
            ].map((member, i) => (
              <Card key={i} className="glass-card border-none group hover:translate-y-[-8px] transition-all duration-500">
                <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-[2.5rem] premium-gradient flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                    <member.icon className="text-white w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black">{member.name}</h4>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${member.color}`}>{member.role}</p>
                  </div>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">{member.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto glass p-12 md:p-20 rounded-[3rem] border-white/20 shadow-2xl space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight">Core Philosophies</h2>
              <p className="text-muted-foreground font-medium max-w-md">Our build principles ensure every event is a masterpiece of digital execution.</p>
            </div>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted overflow-hidden flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-background premium-gradient flex items-center justify-center text-[10px] font-black text-white">+500</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Innovation", desc: "We deploy bleeding-edge tech weeks before it becomes industry standard.", icon: Sparkles },
              { title: "Security", desc: "Your data is locked behind multiple layers of adaptive encryption.", icon: ShieldCheck },
              { title: "Empathy", desc: "Every line of code is written with the organizer's stress in mind.", icon: Heart },
              { title: "Scaling", desc: "Our infrastructure lives in a global mesh that reacts in milliseconds.", icon: Globe },
            ].map((v, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <v.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold tracking-tight">{v.title}</h4>
                  <p className="text-muted-foreground font-medium leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 px-4 md:px-8 text-center bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-5xl font-black tracking-tighter">Ready to Redefine your Events?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button size="lg" className="premium-gradient h-16 px-12 rounded-2xl font-black text-xl gap-3 group">
                Launch Project <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground font-medium">Join 5,000+ elite curators on the platform.</p>
        </div>
      </section>
    </div>
  );
}
