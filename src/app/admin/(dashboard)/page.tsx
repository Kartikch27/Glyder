'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  PackagePlus,
  Search,
  MoreVertical,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    stats: any[];
    recentOrders: any[];
    orderStats: { pending: number; confirmed: number; processing: number; shipped: number; delivered: number; failed: number; cancelled: number; total: number };
  }>({
    stats: [],
    recentOrders: [],
    orderStats: { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, failed: 0, cancelled: 0, total: 0 }
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Auto-fail sweep to keep data fresh before aggregating
      if (typeof window !== 'undefined') {
        const { autoFailExpiredOrders } = await import('@/app/actions/admin');
        await autoFailExpiredOrders().catch(console.error);
      }

      await supabase.auth.getUser();
      
      const { data: orders } = await supabase
        .from('orders')
        .select(`*, profiles(full_name, email), order_items(quantity, unit_price, products(name))`)
        .order('created_at', { ascending: false });

      if (orders) {
        let totalRevenue = 0;
        let activeOrders = 0;
        let validOrdersCount = 0;
        const uniqueCustomers = new Set();
        
        const countStats = { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, failed: 0, cancelled: 0, total: orders.length };

        orders.forEach(order => {
          if (order.status in countStats) {
            countStats[order.status as keyof typeof countStats]++;
          }

          if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
            totalRevenue += Number(order.total_amount || 0);
            validOrdersCount++;
          }
          
          if (['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)) {
            activeOrders++;
          }

          if (order.user_id) uniqueCustomers.add(order.user_id);
        });

        const avgOrderValue = validOrdersCount > 0 ? (totalRevenue / validOrdersCount) : 0;

        setDashboardData({
          stats: [
             { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: 'Live DB', trending: 'up', icon: DollarSign },
             { label: 'Active Orders', value: activeOrders.toString(), change: 'Live DB', trending: 'up', icon: ShoppingBag },
             { label: 'New Customers', value: uniqueCustomers.size.toString(), change: 'Unique users', trending: 'up', icon: Users },
             { label: 'Avg. Order Value', value: `$${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: 'Live DB', trending: 'up', icon: TrendingUp },
          ],
          recentOrders: orders.slice(0, 5),
          orderStats: countStats
        });
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Admin <span className="text-primary">Console</span></h1>
          <p className="text-muted-foreground font-medium italic">Monday, March 23, 2026</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] border-border/50">
             Export Data
          </Button>
          <Link href="/admin/products">
            <Button className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20">
               <PackagePlus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, idx) => (
          <Card key={idx} className="border-none bg-muted/30 rounded-[32px] overflow-hidden group hover:bg-muted/50 transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-background group-hover:scale-110 transition-transform duration-500">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className={cn(
                  "font-bold text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 border-none",
                  stat.trending === 'up' ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                )}>
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-black uppercase tracking-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none bg-muted/30 rounded-[40px] overflow-hidden">
           <CardHeader className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Recent Orders</CardTitle>
                <CardDescription className="font-medium">Latest customer transactions</CardDescription>
              </div>
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search order ID..." 
                  className="h-10 pl-11 rounded-xl bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary font-medium" 
                />
              </div>
           </CardHeader>
           <CardContent className="px-8 pb-8">
              <div className="rounded-[24px] border border-border/50 bg-background overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4">Order ID</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-medium text-xs">No recent orders found</TableCell>
                      </TableRow>
                    ) : dashboardData.recentOrders.map((order) => {
                      const productCount = order.order_items?.length || 0;
                      const displayProduct = productCount > 1 
                        ? `${order.order_items?.[0]?.products?.name || 'Item'} +${productCount - 1} more`
                        : (order.order_items?.[0]?.products?.name || 'Multiple Items');
                      
                      let statusBadgeClass = "bg-primary/5 text-primary border-primary/10";
                      if (order.status === 'delivered' || order.status === 'confirmed') statusBadgeClass = "bg-green-500/10 text-green-600 border-none";
                      else if (order.status === 'processing' || order.status === 'shipped') statusBadgeClass = "bg-blue-500/10 text-blue-600 border-none";
                      else if (order.status === 'failed' || order.status === 'cancelled') statusBadgeClass = "bg-red-500/10 text-red-600 border-none";

                      return (
                      <TableRow key={order.id} className="border-border/50 hover:bg-muted/5">
                        <TableCell className="font-bold text-xs py-5">#{order.id.slice(0, 8).toUpperCase()}</TableCell>
                        <TableCell className="font-medium text-xs">{order.profiles?.full_name || 'Guest'}</TableCell>
                        <TableCell className="font-medium text-xs">{displayProduct}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn(
                            "font-bold text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 border-none",
                            statusBadgeClass
                          )}>
                            {order.status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-black text-xs">${Number(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell>
                           <Link href="/admin/orders">
                             <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 text-primary hover:bg-primary/10">
                                <ChevronRight className="h-4 w-4" />
                             </Button>
                           </Link>
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-center pt-8">
                 <Button variant="ghost" className="gap-2 font-black uppercase tracking-widest text-[10px] text-primary hover:text-primary hover:bg-primary/5">
                    View All Orders <ChevronRight className="h-4 w-4" />
                 </Button>
              </div>
           </CardContent>
        </Card>

        <Card className="border-none bg-muted/30 rounded-[40px] overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Orders by Status</CardTitle>
            <CardDescription className="font-medium">Current distribution of all orders</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span>Completed / Delivered</span>
                <span className="text-green-600">{dashboardData.orderStats.total > 0 ? Math.round((dashboardData.orderStats.delivered / dashboardData.orderStats.total) * 100) : 0}%</span>
              </div>
              <Progress value={dashboardData.orderStats.total > 0 ? (dashboardData.orderStats.delivered / dashboardData.orderStats.total) * 100 : 0} className="h-3 rounded-full bg-background [&>div]:bg-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span>Active Pipeline (Pending/Confirmed/Shipped)</span>
                <span className="text-primary">{dashboardData.orderStats.total > 0 ? Math.round(((dashboardData.orderStats.pending + dashboardData.orderStats.confirmed + dashboardData.orderStats.processing + dashboardData.orderStats.shipped) / dashboardData.orderStats.total) * 100) : 0}%</span>
              </div>
              <Progress value={dashboardData.orderStats.total > 0 ? ((dashboardData.orderStats.pending + dashboardData.orderStats.confirmed + dashboardData.orderStats.processing + dashboardData.orderStats.shipped) / dashboardData.orderStats.total) * 100 : 0} className="h-3 rounded-full bg-background" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span>Failed / Cancelled</span>
                <span className="text-red-500">{dashboardData.orderStats.total > 0 ? Math.round(((dashboardData.orderStats.failed + dashboardData.orderStats.cancelled) / dashboardData.orderStats.total) * 100) : 0}%</span>
              </div>
              <Progress value={dashboardData.orderStats.total > 0 ? ((dashboardData.orderStats.failed + dashboardData.orderStats.cancelled) / dashboardData.orderStats.total) * 100 : 0} className="h-3 rounded-full bg-background [&>div]:bg-red-500" />
            </div>
            
            <div className="pt-8 border-t border-border/50">
              <div className="flex items-center gap-4 p-6 bg-background rounded-3xl">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Database Volume</p>
                  <p className="text-lg font-black uppercase tracking-tighter">{dashboardData.orderStats.total} Orders Placed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
