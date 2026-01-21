'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden glass rounded-[2.5rem] shadow-2xl border-white/20">
        {/* Left Side: Visual/Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 premium-gradient text-white relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>

          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group/back">
            <ChevronLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-tight">Return to Gallery</span>
          </Link>

          <div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-8 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black leading-tight mb-4">
              Access the Elite <br /> Event Console
            </h2>
            <p className="text-white/70 text-lg leading-relaxed font-medium">
              Securely orchestrate world-class experiences. Connect with your audience and manage logistics from one sophisticated dashboard.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-sm font-bold text-white/90 uppercase tracking-widest">System Status: Optimal</span>
            </div>
            <p className="text-xs text-white/50">Festify Security Protocol v3.4.1 Active</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 bg-white/5 dark:bg-black/20 backdrop-blur-sm">
          <div className="mb-10 lg:hidden">
            <div className="w-12 h-12 premium-gradient rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎪</span>
            </div>
            <h1 className="text-3xl font-black text-foreground">Welcome Back</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">Identity Endpoint</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@domain.com"
                  className="pl-10 h-14 glass border-white/20 focus-visible:ring-primary/20 rounded-xl font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Access Protocol</Label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline transition-all">Forgot Phase?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-14 glass border-white/20 focus-visible:ring-primary/20 rounded-xl font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1 ml-1">
              <Checkbox id="remember" className="rounded-md border-primary/20 data-[state=checked]:bg-primary" />
              <label htmlFor="remember" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">
                Maintain continuous session
              </label>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-bold leading-tight">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 premium-gradient text-white font-black text-lg rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95 group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Initiate Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground font-medium mb-4">New to the ecosystem?</p>
            <Link href="/register">
              <Button variant="outline" className="h-12 border-2 border-primary/20 text-primary font-bold px-8 rounded-xl hover:bg-primary/5 transition-all">
                Create Authorized Account
              </Button>
            </Link>
          </div>

          {/* Quick Demo Info */}
          <div className="mt-8 pt-8 border-t border-dashed border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-foreground uppercase tracking-widest">Internal Sandbox Access</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
              For rapid testing, use <span className="text-foreground font-bold italic">admin@eventman.com</span> with secret <span className="text-foreground font-bold italic">password</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
