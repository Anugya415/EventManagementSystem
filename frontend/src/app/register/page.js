'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Complexity Mismatch: Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Security Alert: Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null
      };

      const response = await api.auth.register(userData);
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.message || 'Registration failure encountered');
      }
    } catch (err) {
      setError('Protocol Error: Check backend connectivity');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 translate-y-[-2rem]">
        <Card className="max-w-md w-full glass border-white/20 shadow-2xl p-12 text-center rounded-[2.5rem] animate-fade-in">
          <div className="w-24 h-24 premium-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4">Identity Established!</h2>
          <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
            Your profile has been synchronized with our core databases. Teleporting you to the login terminal...
          </p>
          <div className="flex items-center justify-center gap-3 py-3 px-6 bg-primary/5 rounded-2xl w-fit mx-auto border border-primary/10">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-sm font-bold text-primary uppercase tracking-widest">Redirecting...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500/10 via-background to-background"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden glass rounded-[2.5rem] shadow-2xl border-white/20">
        {/* Left Side: Form */}
        <div className="p-8 md:p-12 lg:border-r border-white/10 order-2 lg:order-1">
          <div className="mb-10 lg:hidden">
            <h1 className="text-3xl font-black text-foreground">Join Festify</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Identity</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    name="name"
                    placeholder="Enter full name"
                    className="pl-10 h-12 glass border-white/10 rounded-xl"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Comms Endpoint</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    name="phone"
                    placeholder="Comms number"
                    className="pl-10 h-12 glass border-white/10 rounded-xl"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Primary Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  name="email"
                  type="email"
                  placeholder="name@domain.com"
                  className="pl-10 h-12 glass border-white/10 rounded-xl"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Security Key</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 glass border-white/10 rounded-xl"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Verify Key</Label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 glass border-white/10 rounded-xl"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3 mt-4">
                <AlertCircle className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 premium-gradient text-white font-black text-lg rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95 group mt-8"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Complete Registration <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground font-medium mb-3">Already part of the ecosystem?</p>
            <Link href="/login">
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl border-b-2 border-transparent hover:border-primary/20">
                Access Existing Identity
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Visual/Context */}
        <div className="hidden lg:flex flex-col justify-between p-12 premium-gradient text-white relative order-1 lg:order-2 overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

          <div className="relative">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/20 py-1.5 px-4 rounded-full mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Unlock Global Experiences
            </Badge>
            <h2 className="text-5xl font-black leading-tight mb-8">
              Your Journey <br /> Begins Here
            </h2>
            <ul className="space-y-6">
              {[
                { title: "Universal Pass", desc: "One identity for all global event access." },
                { title: "Priority Booking", desc: "Early-bird notifications for trending shows." },
                { title: "Vibrant Community", desc: "Sync with thousands of like-minded enthusiasts." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                    <span className="text-xs font-black">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-[10px] mb-1">{item.title}</h4>
                    <p className="text-sm text-white/70 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative pt-12 mt-auto">
            <p className="text-lg font-bold italic opacity-80 leading-relaxed mb-4">
              "The most fluid event platform I've ever experienced. Pure digital art."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 shadow-xl" />
              <div>
                <h5 className="text-sm font-black">Alex Rivera</h5>
                <span className="text-xs opacity-60">Global Creative Director</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
