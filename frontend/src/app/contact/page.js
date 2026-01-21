'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Globe,
  Twitter,
  Linkedin,
  Github,
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function ContactPage() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/3"></div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:px-8 text-center space-y-6">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px]">
          Direct Link
        </Badge>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground">
          Reach the <br />
          <span className="premium-text-gradient italic font-extrabold">Control Center.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-medium leading-relaxed">
          Need tactical assistance or strategic inquiries? Our operations team is on standby to help you scale your experiences.
        </p>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact Info (Left) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tight">Comms Endpoints</h2>
              <p className="text-muted-foreground font-medium">Choose your preferred channel for instantaneous response.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {[
                { label: "Email Terminal", val: "hello@festify.io", sub: "24h Response Goal", icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "Voice Support", val: "+1 (800) FESTIFY", sub: "09:00 - 18:00 PST", icon: Phone, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Physical HQ", val: "San Francisco, CA", sub: "Silicon Gateway", icon: MapPin, color: "text-purple-500", bg: "bg-purple-500/10" },
                { label: "Global Presence", val: "available in 50+ Cities", sub: "Distributed Network", icon: Globe, color: "text-amber-500", bg: "bg-amber-500/10" },
              ].map((item, i) => (
                <Card key={i} className="glass border-none hover:bg-white/5 dark:hover:bg-primary/5 transition-all group overflow-hidden">
                  <CardContent className="p-6 flex items-start gap-5">
                    <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                      <h4 className="text-lg font-black text-foreground">{item.val}</h4>
                      <p className="text-xs text-muted-foreground font-bold">{item.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-6 space-y-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Connect Digitally</h3>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Github].map((Soc, i) => (
                  <Button key={i} variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 hover:bg-primary/5 group">
                    <Soc className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side (Right) */}
          <div className="lg:col-span-7">
            <Card className="glass-card border-none shadow-2xl p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5"><MessageSquare className="w-32 h-32" /></div>

              <div className="space-y-10 relative z-10">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-foreground">Secure Transmission</h2>
                  <p className="text-muted-foreground font-medium">Encrypt your message and send it directly to our core team.</p>
                </div>

                {submitStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-fade-in">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-black">Link Established!</h3>
                    <p className="text-muted-foreground font-medium max-w-sm">Transmission received. Our intelligence team will contact you within the next cycle.</p>
                    <Button variant="outline" className="h-12 px-8 rounded-xl font-bold" onClick={() => setSubmitStatus(null)}>Return to Form</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Identity Name</Label>
                        <Input
                          name="name"
                          placeholder="Ex: Marcus Aurelius"
                          className="h-14 glass border-white/10 rounded-2xl"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Comms Email</Label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="name@endpoint.com"
                          className="h-14 glass border-white/10 rounded-2xl"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Subject Protocol</Label>
                      <Input
                        name="subject"
                        placeholder="Ex: Enterprise Partnership Query"
                        className="h-14 glass border-white/10 rounded-2xl"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Message Content</Label>
                      <Textarea
                        name="message"
                        placeholder="Detail your request..."
                        className="min-h-[180px] glass border-white/10 rounded-[2rem] p-6 resize-none"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-16 premium-gradient text-white font-black text-xl rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-7 h-7 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-3">
                          Establish Connection <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 md:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-black text-primary uppercase tracking-[0.3em]">Knowledge Base</h2>
            <h3 className="text-5xl font-black tracking-tight">Frequent Dispatches.</h3>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              { q: "How do I upgrade to Enterprise?", a: "Contact our business terminal directly at business@festify.io for customized infrastructure and dedicated support nodes." },
              { q: "What is your data retention policy?", a: "We utilize multi-region primary snapshots with AES-256 binary encryption. Your data is your property, and we maintain it with absolute confidentiality." },
              { q: "Can I manage concurrent events?", a: "Our platform is built on an elastic grid. Organizers can manifest and monitor an unlimited number of concurrent experiences from a single console." },
              { q: "Is there a global service limit?", a: "None. Whether you are running a local workshop or a global festival with millions of attendees, our routing protocols adapt automatically." }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass rounded-2xl border-none px-6 shadow-sm overflow-hidden">
                <AccordionTrigger className="text-lg font-bold hover:no-underline py-6">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-medium text-base pb-6 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 premium-gradient opacity-90 skew-y-1 -z-10"></div>
        <div className="max-w-3xl mx-auto space-y-10 text-white">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Manifest Greatness.</h2>
          <p className="text-xl opacity-80 font-medium">Don't wait for the right moment. Build it on the most resilient platform in the industry.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button className="bg-white text-primary h-16 px-12 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl">
                Launch Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
