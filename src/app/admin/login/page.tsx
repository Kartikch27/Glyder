'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, LogIn, ArrowRight, Loader2, ShieldCheck, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!user) throw new Error('Authentication failed');

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role !== 'admin') {
        // Sign out if not admin
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      toast.success('Admin access granted');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Admin Login Error:', err);
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-background rounded-[32px] border border-border/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] p-8 md:p-10 space-y-8">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-xl shadow-primary/20">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">GLYDER <span className="text-primary/50">ADMIN</span></h1>
            <p className="text-muted-foreground font-medium text-sm">
              Secure access for system administrators.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Admin Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="admin@glyder.com" 
                    required
                    className="h-12 pl-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    required
                    className="h-12 pl-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary font-medium" 
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-14 text-sm font-black uppercase tracking-widest rounded-xl gap-2 shadow-lg shadow-primary/10">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Enter Dashboard <ArrowRight className="h-5 w-5" /></>}
            </Button>
          </form>

          <div className="pt-4 border-t border-border/50">
            <p className="text-center text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">
              System Protected by Enterprise Security
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="link" onClick={() => router.push('/')} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
            Back to Website
          </Button>
        </div>
      </div>
    </div>
  );
}
