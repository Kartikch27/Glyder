'use client';

import { useState, useEffect } from 'react';
import { 
  Settings2, 
  Store, 
  CreditCard, 
  BellRing, 
  ShieldCheck, 
  Save, 
  Loader2,
  Clock,
  TerminalSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { getStoreSettings, updateStoreSettings, StoreSettings } from '@/app/actions/settings';
import { createClient } from '@/lib/supabase/client';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{ email: string; full_name: string } | null>(null);
  
  const [settings, setSettings] = useState<StoreSettings>({
    id: '',
    store_name: 'GLYDER',
    support_email: 'support@glyder.com',
    contact_number: '+1 (800) 123-4567',
    store_address: '123 Glide Street, CA 90210',
    order_auto_fail_minutes: 60,
    cod_enabled: true,
  });

  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    emailAlerts: true,
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchAllSettings() {
      try {
        // Fetch Admin Profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('id', user.id).single();
          if (profile) setAdminProfile(profile);
        }

        // Fetch DB Settings
        const dbSettings = await getStoreSettings();
        if (dbSettings) {
          setSettings(dbSettings);
        }
      } catch (error) {
        console.error('Failure fetching configurations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'order_auto_fail_minutes' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStoreSettings(settings);
      toast.success('Settings updated successfully', {
        description: 'All system configurations have been locked.',
      });
    } catch (error: any) {
      toast.error('Failed to update Settings', {
        description: error.message || 'An explicit database restriction blocked the save.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1 block">
            <h1 className="text-4xl font-black uppercase tracking-tighter">System <span className="text-primary">Settings</span></h1>
            <p className="text-muted-foreground font-medium italic">Configure store parameters and fulfillment loops.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
               Save Configuration
            </Button>
          </div>
        </div>

        {/* Modular Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Store Profile Settings */}
            <Card className="border-none bg-muted/30 rounded-[40px] overflow-hidden">
              <CardHeader className="p-8 border-b border-border/50 bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Store Profile</CardTitle>
                    <CardDescription className="font-medium">Public facing branding and communication channels.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Store Name</label>
                    <Input 
                      name="store_name"
                      value={settings.store_name || ''}
                      onChange={handleChange}
                      className="h-12 bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary rounded-xl font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Support Email</label>
                    <Input 
                      name="support_email"
                      value={settings.support_email || ''}
                      onChange={handleChange}
                      className="h-12 bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary rounded-xl font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Number</label>
                    <Input 
                      name="contact_number"
                      value={settings.contact_number || ''}
                      onChange={handleChange}
                      className="h-12 bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary rounded-xl font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Store Address</label>
                    <Input 
                      name="store_address"
                      value={settings.store_address || ''}
                      onChange={handleChange}
                      className="h-12 bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary rounded-xl font-medium" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order & Payment Settings */}
            <Card className="border-none bg-muted/30 rounded-[40px] overflow-hidden">
              <CardHeader className="p-8 border-b border-border/50 bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Order Lifecycle</CardTitle>
                    <CardDescription className="font-medium">Processing limits and automated payment fallbacks.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between border-border/50 pb-6 border-b">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Cash On Delivery (COD)</p>
                    <p className="text-xs text-muted-foreground font-medium">Allow customers to pay via physical terminal upon package arrival.</p>
                  </div>
                  <Switch 
                    checked={settings.cod_enabled} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, cod_enabled: checked }))} 
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <p className="font-bold text-sm text-orange-600">Pending Order Expiration Timeout</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Orders sitting purely unconfirmed will automatically sweep failed after this minute threshold.</p>
                  </div>
                  <div className="w-32">
                     <Input 
                      name="order_auto_fail_minutes"
                      type="number"
                      value={settings.order_auto_fail_minutes || 0}
                      onChange={handleChange}
                      className="h-12 bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl font-extrabold text-orange-600 tracking-tighter text-lg text-center" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-8">

            {/* Admin Profile */}
            <Card className="border-none bg-muted/30 rounded-[40px] overflow-hidden">
               <CardHeader className="p-8 pb-4">
                 <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
                    <ShieldCheck className="h-6 w-6" />
                 </div>
                 <CardTitle className="text-xl font-black uppercase tracking-tight">Access Control</CardTitle>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-6">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Identity</p>
                    <p className="font-bold text-sm tracking-tight">{adminProfile?.full_name || 'Loading...'}</p>
                    <p className="font-medium text-xs text-muted-foreground">{adminProfile?.email || 'Loading...'}</p>
                 </div>
                 <div className="space-y-1 pt-4 border-t border-border/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Role Security</p>
                    <p className="font-bold text-sm tracking-tight text-primary">Super Administrator Level</p>
                 </div>
               </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-none bg-muted/30 rounded-[40px] overflow-hidden">
               <CardHeader className="p-8 pb-4">
                 <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                    <BellRing className="h-6 w-6" />
                 </div>
                 <CardTitle className="text-xl font-black uppercase tracking-tight">Notifications</CardTitle>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-6">
                 <div className="flex items-center justify-between">
                    <p className="font-bold text-xs">New Order Alerts</p>
                    <Switch checked={notifications.orderAlerts} onCheckedChange={(val) => setNotifications(prev => ({ ...prev, orderAlerts: val }))} />
                 </div>
                 <div className="flex items-center justify-between">
                    <p className="font-bold text-xs">Critical System Emails</p>
                    <Switch checked={notifications.emailAlerts} onCheckedChange={(val) => setNotifications(prev => ({ ...prev, emailAlerts: val }))} />
                 </div>
               </CardContent>
            </Card>

            {/* System Info */}
            <Card className="border-none bg-muted/30 rounded-[40px] overflow-hidden bg-primary/5 border-primary/10 border">
              <CardContent className="p-8 flex items-start gap-4">
                 <TerminalSquare className="w-6 h-6 text-primary shrink-0" />
                 <div className="space-y-1">
                   <p className="font-bold text-xs uppercase tracking-widest text-primary">Enterprise Instance</p>
                   <p className="text-xs text-muted-foreground font-medium">Production Database Environment</p>
                   <p className="text-[10px] font-black tracking-widest text-muted-foreground opacity-50 block pt-2">v.2.0.4-STABLE</p>
                 </div>
              </CardContent>
            </Card>
            
          </div>

        </div>
      </div>
    </div>
  );
}
