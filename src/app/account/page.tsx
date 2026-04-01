'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight,
  Clock,
  CreditCard,
  Bell,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { autoFailExpiredOrders } from '@/app/actions/admin';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Perform automated failure sweep before querying user data
      await autoFailExpiredOrders().catch(console.error);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profile);

        const { data: userOrders } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              unit_price,
              products (
                name,
                slug,
                product_images (url, is_primary)
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setOrders(userOrders || []);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Account</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            YOUR <span className="text-primary">PROFILE</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Dashboard Sidebar */}
          <aside className="lg:col-span-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px]",
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
                {activeTab === item.id && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-border/50">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start px-6 py-6 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-destructive hover:text-destructive hover:bg-destructive/5 gap-4"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </Button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <Card className="border-none bg-muted/30 rounded-[32px] overflow-hidden">
                  <CardContent className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative group">
                        <div className="h-32 w-32 rounded-full bg-primary/10 border-4 border-background overflow-hidden">
                          {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center">
                              <User className="h-12 w-12 text-primary/40" />
                            </div>
                          )}
                        </div>
                        <Button size="icon" className="absolute bottom-0 right-0 h-10 w-10 rounded-full border-4 border-background shadow-lg">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-black uppercase tracking-tight">{profile?.full_name || 'Anonymous Explorer'}</h2>
                        <p className="text-muted-foreground font-medium">
                          Explorer since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '...'}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                          <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-black uppercase tracking-widest text-[10px]">
                            {profile?.role === 'admin' ? 'Admin Access' : 'Standard Member'}
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-black uppercase tracking-widest text-[10px]">Active Rider</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="bg-border/50" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Full Name</p>
                        <p className="font-bold">{profile?.full_name || 'Not set'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Email Address</p>
                        <p className="font-bold">{profile?.email || 'Not set'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Phone Number</p>
                        <p className="font-bold">{profile?.phone_number || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Account Role</p>
                        <p className="font-bold uppercase tracking-widest text-xs">{profile?.role || 'user'}</p>
                      </div>
                    </div>

                    <Button className="font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl">Edit Profile Information</Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-none bg-muted/30 rounded-[32px] overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-xl font-black uppercase tracking-tight">Membership Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black uppercase tracking-widest">Progress to Platinum</span>
                        <span className="text-sm font-black">75%</span>
                      </div>
                      <div className="h-3 w-full bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4 rounded-full" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Spend $450 more to unlock free lifetime maintenance.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none bg-muted/30 rounded-[32px] overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-xl font-black uppercase tracking-tight">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto py-4 flex-col gap-2 rounded-2xl border-border/50 bg-background/50 hover:bg-background">
                         <Package className="h-5 w-5 text-primary" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Track Order</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 flex-col gap-2 rounded-2xl border-border/50 bg-background/50 hover:bg-background">
                         <Clock className="h-5 w-5 text-primary" />
                         <span className="text-[10px] font-black uppercase tracking-widest">History</span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <Card className="border-none bg-muted/30 rounded-[32px] overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-8 border-b border-border/50 flex justify-between items-center">
                       <h2 className="text-2xl font-black uppercase tracking-tight">Recent Orders</h2>
                       {orders.length > 0 && (
                         <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-black uppercase tracking-widest text-[10px]">Active History</Badge>
                       )}
                    </div>
                    <div className="p-8 space-y-8">
                      {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                          <Package className="h-16 w-16 text-muted-foreground opacity-20" />
                          <h3 className="text-xl font-black uppercase tracking-tight">No Orders Yet</h3>
                          <p className="text-muted-foreground font-medium text-sm">You haven't placed any orders. Start exploring our collection!</p>
                          <Link href="/">
                            <Button className="mt-4 font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl">Shop Now</Button>
                          </Link>
                        </div>
                      ) : (
                        orders.map((order: any) => {
                          const firstItem = order.order_items?.[0];
                          const product = firstItem?.products;
                          const productCount = order.order_items?.length || 0;
                          const displayTitle = productCount > 1 
                            ? `${product?.name || 'GLYDER Product'} + ${productCount - 1} more` 
                            : (product?.name || 'GLYDER Product');
                          const primaryImage = product?.product_images?.find((img: any) => img.is_primary)?.url 
                            || product?.product_images?.[0]?.url;

                          let statusBadgeClass = "bg-primary/5 text-primary border-primary/10";
                          if (order.status === 'delivered' || order.status === 'confirmed') statusBadgeClass = "bg-green-500/10 text-green-600 border-none";
                          else if (order.status === 'cancelled' || order.status === 'failed') statusBadgeClass = "bg-red-500/10 text-red-600 border-none";
                          else if (order.status === 'processing') statusBadgeClass = "bg-yellow-500/10 text-yellow-600 border-none";

                          return (
                          <div key={order.id} className="flex flex-col md:flex-row gap-6 md:items-center justify-between p-6 rounded-2xl bg-background border border-border/50 hover:shadow-lg transition-all">
                             <div className="flex gap-6 items-center">
                                <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden shrink-0 flex items-center justify-center text-muted-foreground">
                                  {primaryImage ? (
                                    <img src={primaryImage} alt={displayTitle} className="h-full w-full object-cover" />
                                  ) : (
                                    <Package className="h-6 w-6 opacity-30" />
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                  <h4 className="font-black text-lg uppercase tracking-tight">{displayTitle}</h4>
                                  <p className="text-xs font-medium text-muted-foreground">Purchased on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                             </div>
                             <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2">
                                <span className="font-black text-xl tracking-tighter">${order.total_amount?.toLocaleString() || '0.00'}</span>
                                <Badge className={`${statusBadgeClass} font-black uppercase tracking-widest text-[10px]`}>{order.status || 'Pending'}</Badge>
                             </div>
                             <Button variant="outline" size="sm" className="font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl">View Details</Button>
                          </div>
                        )})
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
