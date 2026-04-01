'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  ShoppingBag,
  Eye,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { updateOrderStatus, autoFailExpiredOrders } from '@/app/actions/admin';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();

  const fetchOrders = async () => {
    setIsLoading(true);
    
    // Auto-fail sweep before checking
    await autoFailExpiredOrders().catch(console.error);

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (full_name, email),
        order_items (
          quantity,
          unit_price,
          products (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } else {
      toast.error(result.error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-500/10 text-green-600 border-none font-black text-[8px] uppercase tracking-widest px-2 gap-1"><CheckCircle2 className="h-2 w-2" /> Delivered</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500/10 text-green-600 border-none font-black text-[8px] uppercase tracking-widest px-2 gap-1"><CheckCircle2 className="h-2 w-2" /> Confirmed</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500/10 text-blue-600 border-none font-black text-[8px] uppercase tracking-widest px-2 gap-1"><Truck className="h-2 w-2" /> Shipped</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-none font-black text-[8px] uppercase tracking-widest px-2 gap-1"><Clock className="h-2 w-2" /> Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-600 border-none font-black text-[8px] uppercase tracking-widest px-2 gap-1"><XCircle className="h-2 w-2" /> Failed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-600 border-none font-black text-[8px] uppercase tracking-widest px-2 gap-1"><XCircle className="h-2 w-2" /> Cancelled</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-none font-black text-[8px] uppercase tracking-widest px-2 gap-1"><Clock className="h-2 w-2" /> Pending</Badge>;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Order <span className="text-primary">Fulfillment</span></h1>
          <p className="text-muted-foreground font-medium italic">Monitor and manage customer orders and shipping status.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-muted/30 p-4 rounded-2xl border border-border/50">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by Order ID or Customer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-11 rounded-xl bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary font-medium" 
          />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <ShoppingBag className="h-4 w-4" />
          {filteredOrders.length} Orders Total
        </div>
      </div>

      <div className="rounded-[32px] border border-border/50 bg-background overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4 px-6">Order ID</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest">Retrieving Orders...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <ShoppingBag className="h-12 w-12 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest">No orders found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-border/50 hover:bg-muted/5 group">
                  <TableCell className="py-5 px-6 font-bold text-xs">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-black text-xs uppercase tracking-tight">{order.profiles?.full_name || 'Guest'}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{order.profiles?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-black text-sm tracking-tighter">
                    ${Number(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                        <DropdownMenuItem className="rounded-xl cursor-pointer py-3 gap-3 font-bold text-xs uppercase tracking-widest text-primary focus:text-primary focus:bg-primary/5">
                          <Truck className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <div className="h-px bg-border/50 my-1" />
                        <p className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground">Update Status</p>
                        
                        {order.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'confirmed')} className="rounded-xl cursor-pointer py-2 gap-3 font-bold text-[10px] uppercase tracking-widest text-green-600 focus:text-green-600 focus:bg-green-500/10">
                            Confirm Order
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'processing')} className="rounded-xl cursor-pointer py-2 gap-3 font-bold text-[10px] uppercase tracking-widest">
                          Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')} className="rounded-xl cursor-pointer py-2 gap-3 font-bold text-[10px] uppercase tracking-widest">
                          Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'delivered')} className="rounded-xl cursor-pointer py-2 gap-3 font-bold text-[10px] uppercase tracking-widest">
                          Delivered
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'failed')} className="rounded-xl cursor-pointer py-2 gap-3 font-bold text-[10px] uppercase tracking-widest text-red-500">
                          Mark as Failed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="rounded-xl cursor-pointer py-2 gap-3 font-bold text-[10px] uppercase tracking-widest text-red-500">
                          Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </div>
  );
}
