import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Star, Play, Globe, Recycle } from 'lucide-react';
import { ProductCard } from '@/components/common/ProductCard';
import { createClient } from '@/lib/supabase/server';
import { type Product } from '@/app/shop/page';

export default async function HomePage() {
  const supabase = await createClient();
  
  // Fetch featured products
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      images:product_images(url, alt_text, is_primary)
    `)
    .eq('is_featured', true)
    .limit(4);

  const featuredProducts = products || [];

  // Fetch categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const categories = categoriesData || [
    { id: '1', slug: 'electric-scooters', name: 'Electric Scooters', description: 'Premium electric scooters' },
    { id: '2', slug: 'accessories', name: 'Accessories', description: 'Essential accessories for your ride' },
    { id: '3', slug: 'parts', name: 'Replacement Parts', description: 'Genuine replacement parts' },
  ];

  return (
    <div className="flex flex-col pb-24">
      {/* Modern Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-black text-white">
        {/* Animated Background Placeholder */}
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/30 via-black to-black animate-pulse" />
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left Column: Text Content */}
            <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-1000 text-center lg:text-left items-center lg:items-start">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/90">2026 Collection Live</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] sm:leading-[0.9] lg:leading-[0.85] uppercase">
                RIDE THE <br />
                <span className="text-primary italic">FUTURE</span> OF <br />
                MOBILITY
              </h1>
              
              <p className="max-w-[600px] text-base sm:text-lg md:text-xl text-white/70 leading-relaxed font-medium">
                Experience the next generation of electric transportation. 
                High-performance, sustainable, and engineered for the modern explorer.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 sm:h-16 px-10 text-lg font-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-primary/50 transition-all uppercase tracking-widest">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 sm:h-16 px-10 text-lg font-black rounded-full border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white gap-2 uppercase tracking-widest">
                  <Play className="h-5 w-5 fill-current" /> Watch Promo
                </Button>
              </div>

              <div className="flex items-center gap-6 sm:gap-8 pt-8 sm:pt-12 border-t border-white/10 w-fit">
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black">45mi+</span>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Max Range</span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-6 sm:pl-8">
                  <span className="text-xl sm:text-2xl font-black">28mph</span>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Top Speed</span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-6 sm:pl-8">
                  <span className="text-xl sm:text-2xl font-black">2.5h</span>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Fast Charge</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual/Image Placeholder */}
            <div className="hidden lg:flex relative items-center justify-center animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="relative w-full aspect-square max-w-[500px]">
                {/* Decorative Rings */}
                <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-16 rounded-full border border-white/5 animate-[spin_25s_linear_infinite]" />
                
                {/* Main Visual Placeholder */}
                <div className="absolute inset-24 rounded-[48px] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center group overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Zap className="w-32 h-32 text-primary drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-bounce" />
                  
                  {/* Floating Tech Labels */}
                  <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] font-black uppercase tracking-tighter">Carbon Fiber Frame</span>
                  </div>
                  <div className="absolute bottom-8 right-8 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg">
                    <span className="text-[10px] font-black uppercase tracking-tighter">ABS Braking System</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Glows */}
        <div className="absolute right-[-10%] top-[-10%] w-[50%] aspect-square rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute left-[-5%] bottom-[-5%] w-[40%] aspect-square rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      </section>

      {/* Hero Stats */}
      <section className="bg-black border-b border-white/10">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center gap-3 text-center group cursor-default">
            <div className="p-4 rounded-2xl bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
              <Globe className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-black uppercase tracking-tighter">Global Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-3 text-center group cursor-default">
            <div className="p-4 rounded-2xl bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
              <ShieldCheck className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-black uppercase tracking-tighter">2-Year Warranty</span>
          </div>
          <div className="flex flex-col items-center gap-3 text-center group cursor-default">
            <div className="p-4 rounded-2xl bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
              <Recycle className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-black uppercase tracking-tighter">Eco-Friendly Tech</span>
          </div>
          <div className="flex flex-col items-center gap-3 text-center group cursor-default">
            <div className="p-4 rounded-2xl bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
              <Star className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-black uppercase tracking-tighter">Premium Quality</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                OUR <span className="text-primary">FEATURED</span> <br />
                MACHINES
              </h2>
              <p className="max-w-[600px] text-muted-foreground font-medium">
                The most popular GLYDER models, tested and approved by our community of thousands of riders.
              </p>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="rounded-full font-black uppercase tracking-widest h-14 px-8 border-2">
                View All Products
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 border border-border/50 p-12 rounded-2xl text-center">
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link 
              key={cat.id} 
              href={`/shop?category=${cat.slug}`}
              className={`relative h-[400px] overflow-hidden rounded-[32px] group ${idx === 0 ? 'md:col-span-2' : ''}`}
            >
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-muted group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-10 left-10 space-y-2">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">{cat.name}</h3>
                <p className="text-white/60 text-sm font-medium max-w-xs">{cat.description}</p>
                <div className="pt-4">
                  <Button variant="outline" className="rounded-full border-white/20 bg-white/10 backdrop-blur-md text-white font-bold group-hover:bg-primary group-hover:border-primary transition-all">
                    Explore
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative bg-primary px-8 py-20 md:p-24 rounded-[48px] overflow-hidden">
          {/* Decorative SVG/Circle */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl space-y-6 text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-primary-foreground leading-[0.9] tracking-tighter uppercase">
                JOIN THE <br />
                REVOLUTION
              </h2>
              <p className="text-primary-foreground/80 text-lg font-medium">
                Subscribe to get early access to new launches, maintenance tips, and exclusive urban explorer rewards.
              </p>
            </div>
            
            <div className="w-full max-w-md bg-white p-2 rounded-3xl shadow-2xl flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 bg-transparent outline-none text-black font-bold placeholder:text-black/30"
              />
              <Button size="lg" className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
