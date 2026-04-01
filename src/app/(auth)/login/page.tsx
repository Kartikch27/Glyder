'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, LogIn, ArrowRight, Github, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  async function handleSocialLogin(provider: 'google' | 'github') {
    if (isLoading) return;
    
    console.log(`Login: Starting ${provider} login flow...`);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error(`Login: ${provider} error:`, err);
      toast.error(err.message);
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (isLoading) return;
    
    console.log('Login: Starting submission flow...');
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      console.log(`Login: Attempting to sign in user: ${email}`);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login: Supabase error:', error);
        
        if (error.status === 429) {
          toast.error('Too many login attempts. Please try again later.');
        } else {
          toast.error(error.message);
        }
        setIsLoading(false);
        return;
      }

      console.log('Login: Success! Redirecting to account...');
      toast.success('Successfully logged in!');
      router.push('/account');
      router.refresh();
    } catch (err: any) {
      console.error('Login: Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 relative overflow-hidden bg-background">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 w-full max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-background rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden border border-border/50 min-h-[700px]">
          {/* Left Side: Form */}
          <div className="p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Welcome <br />
              <span className="text-primary">Back</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Access your account to manage orders and settings.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    className="h-12 pl-12 rounded-2xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest">Password</Label>
                  <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    required
                    className="h-12 pl-12 rounded-2xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary font-medium" 
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg font-black uppercase tracking-widest rounded-2xl gap-2 shadow-xl shadow-primary/20">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign In <ArrowRight className="h-5 w-5" /></>}
            </Button>
          </form>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">
                <span className="bg-background px-4">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                disabled={isLoading}
                onClick={() => handleSocialLogin('google')}
                className="h-12 rounded-2xl font-bold gap-2 border-border/50 hover:bg-muted/50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg> Google
              </Button>
              <Button 
                variant="outline" 
                disabled={isLoading}
                onClick={() => handleSocialLogin('github')}
                className="h-12 rounded-2xl font-bold gap-2 border-border/50 hover:bg-muted/50"
              >
                <Github className="h-4 w-4" /> Github
              </Button>
            </div>
          </div>

          <p className="text-center text-sm font-medium text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-black hover:underline underline-offset-4">Sign Up</Link>
          </p>
        </div>

        {/* Right Side: Visual */}
        <div className="hidden lg:block relative bg-primary p-16 text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary to-black/50" />
          <div className="absolute top-0 right-0 w-full h-full bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-8">
               <span className="inline-block font-black text-3xl tracking-tighter italic">GLYDER</span>
               <div className="space-y-4">
                  <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                    JOIN THE <br />
                    MOVEMENT.
                  </h2>
                  <p className="text-primary-foreground/70 font-medium max-w-xs">
                    Get access to exclusive events, new collection drops, and our community of urban explorers.
                  </p>
               </div>
            </div>

            <div className="space-y-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-primary bg-muted animate-pulse" />
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-primary bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-black tracking-widest">
                  +2k
                </div>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
                Trusted by explorers worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
