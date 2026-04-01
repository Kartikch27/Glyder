'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  Share2,
  Info,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/common/ProductCard';
import { type Product } from '@/app/shop/page';

import { useCart } from '@/store/use-cart';
import { toast } from 'sonner';

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const { slug } = await params;
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        
        // Fetch related products from same category
        if (data.category_id) {
          const relatedRes = await fetch(`/api/products?category_id=${data.category_id}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            setRelatedProducts(relatedData.filter((p: Product) => p.id !== data.id).slice(0, 4));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error('Please log in to add items to cart');
          return;
        }
        throw new Error(errorData.error || 'Failed to add to cart');
      }

      // Also update local store for immediate UI feedback if needed
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) || null,
        quantity: quantity,
        slug: product.slug,
      });

      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">The product you are looking for doesn't exist or has been removed.</p>
        <Link href="/shop">
          <Button className="rounded-2xl font-bold uppercase tracking-widest px-8 h-12">
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const mainImage = typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url;

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-[32px] overflow-hidden bg-muted group">
              {mainImage ? (
                <img 
                  src={mainImage} 
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
              )}
              {product.is_new && (
                <Badge className="absolute top-6 left-6 z-10 bg-primary text-primary-foreground font-black px-4 py-1.5 rounded-full uppercase tracking-tighter text-xs">
                  New Arrival
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-muted overflow-hidden cursor-pointer hover:ring-2 ring-primary ring-offset-2 transition-all">
                   <img 
                    src={typeof img === 'string' ? img : img.url} 
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                   />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                  {product.name}
                </h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-border/50">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-border/50">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-black text-primary">{product.rating}</span>
                </div>
                <span className="text-sm font-bold text-muted-foreground underline underline-offset-4 cursor-pointer">
                  {product.review_count} Reviews
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm font-bold text-green-600 uppercase tracking-widest">In Stock</span>
              </div>

                <div className="text-4xl font-black tracking-tighter text-primary">
                  ${product.price.toLocaleString()}
                </div>

                <div className="space-y-4">
                  <p className="text-lg font-black uppercase tracking-widest border-l-4 border-primary pl-4 py-1">
                    {product.short_description}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

            <Separator className="bg-border/50" />

            {/* Selection Options */}
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Color Options</span>
                <div className="flex gap-3">
                  {['bg-black', 'bg-slate-300', 'bg-blue-600'].map((color) => (
                    <div 
                      key={color} 
                      className={`h-10 w-10 rounded-full ${color} border-2 border-transparent cursor-pointer hover:ring-2 ring-primary ring-offset-2 transition-all`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-4 bg-muted/30 w-fit p-1 rounded-2xl border border-border/50">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl hover:bg-background"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-black text-lg">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl hover:bg-background"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 h-16 text-lg font-black uppercase tracking-widest rounded-2xl gap-3 shadow-xl shadow-primary/20"
              >
                {addingToCart ? <Loader2 className="h-6 w-6 animate-spin" /> : <ShoppingCart className="h-6 w-6" />} 
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button variant="outline" className="h-16 px-10 text-lg font-black uppercase tracking-widest rounded-2xl border-2 hover:bg-muted/50">
                Buy Now
              </Button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Free Express Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">30-Day Free Return</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section: Description, Specs, Reviews */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="specs" className="w-full space-y-8">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-8 border-b border-border/50 rounded-none">
            <TabsTrigger value="specs" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:text-primary border-b-4 border-transparent rounded-none px-0 py-4 text-sm font-black uppercase tracking-widest text-muted-foreground transition-all">Technical Specs</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:text-primary border-b-4 border-transparent rounded-none px-0 py-4 text-sm font-black uppercase tracking-widest text-muted-foreground transition-all">Key Features</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:text-primary border-b-4 border-transparent rounded-none px-0 py-4 text-sm font-black uppercase tracking-widest text-muted-foreground transition-all">Customer Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specs" className="pt-4 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-4 border-b border-border/30">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{key}</span>
                  <span className="text-sm font-black">{value as React.ReactNode}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="pt-4 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-[24px] bg-muted/30 border border-border/50">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-widest mb-1">{feature}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Engineered for maximum efficiency and durability in real-world urban environments.</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-4 animate-in fade-in duration-500">
             <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/20 rounded-[32px] border border-dashed">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Loved by thousands</h3>
                <p className="text-muted-foreground max-w-sm">Join the community of urban explorers who trust GLYDER for their daily commute.</p>
                <Button className="font-bold">Write a Review</Button>
             </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Related Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary">
              You might also like
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none uppercase">
              RELATED PRODUCTS
            </h2>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 font-black text-sm uppercase tracking-widest hover:text-primary transition-colors">
            Explore All <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
