'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Package,
  Image as ImageIcon,
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
import { deleteProduct } from '@/app/actions/admin';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name),
        product_images (url, is_primary)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error(result.error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Inventory <span className="text-primary">Management</span></h1>
          <p className="text-muted-foreground font-medium italic">Manage your product catalog and stock levels.</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/products/new')}
          className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-muted/30 p-4 rounded-2xl border border-border/50">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name or slug..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-11 rounded-xl bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary font-medium" 
          />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <Package className="h-4 w-4" />
          {filteredProducts.length} Products Found
        </div>
      </div>

      <div className="rounded-[32px] border border-border/50 bg-background overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4 px-6">Product</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Stock</TableHead>
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
                    <p className="text-xs font-black uppercase tracking-widest">Loading Catalog...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Package className="h-12 w-12 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest">No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-border/50 hover:bg-muted/5 group">
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                        {product.product_images?.[0] ? (
                          <img src={product.product_images[0].url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="font-black text-sm uppercase tracking-tight truncate">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium italic truncate max-w-[200px] sm:max-w-[300px]">/{product.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-black uppercase tracking-widest text-[10px] px-3 py-1">
                      {product.categories?.name || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-sm tracking-tighter">
                    ${product.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={`text-sm font-bold ${product.stock_quantity <= 5 ? 'text-red-500' : 'text-foreground'}`}>
                      {product.stock_quantity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {product.is_featured && <Badge className="bg-yellow-500/10 text-yellow-600 border-none font-black text-[8px] uppercase tracking-widest px-2">Featured</Badge>}
                      {product.is_new && <Badge className="bg-blue-500/10 text-blue-600 border-none font-black text-[8px] uppercase tracking-widest px-2">New</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg hover:bg-primary/10 text-primary transition-all"
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted group-hover:text-primary transition-all">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                          <DropdownMenuItem className="rounded-xl cursor-pointer py-3 gap-3 font-bold text-xs uppercase tracking-widest">
                            <ExternalLink className="h-4 w-4" /> View in Shop
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product.id)}
                            className="rounded-xl cursor-pointer py-3 gap-3 font-bold text-xs uppercase tracking-widest text-destructive focus:text-destructive focus:bg-destructive/5"
                          >
                            <Trash2 className="h-4 w-4" /> Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
