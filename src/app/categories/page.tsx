import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 'scooters',
    name: 'Electric Scooters',
    description: 'High-performance urban mobility engineered for the modern explorer.',
    image: '/images/categories/scooters.png',
    href: '/shop?category=scooters',
    count: '12 Models'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Premium gear designed to enhance your riding experience and safety.',
    image: '/images/categories/accessories.png',
    href: '/shop?category=accessories',
    count: '24 Items'
  },
  {
    id: 'parts',
    name: 'Replacement Parts',
    description: 'Genuine components to keep your GLYDER performing at its peak.',
    image: '/images/categories/parts.png',
    href: '/shop?category=parts',
    count: '45 Parts'
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    description: 'The latest innovations in personal electric transportation.',
    image: '/images/categories/new-arrivals.png',
    href: '/shop?filter=new',
    count: 'Fresh Drops'
  },
  {
    id: 'best-sellers',
    name: 'Best Sellers',
    description: 'Our most trusted and top-rated mobility solutions.',
    image: '/images/categories/best-sellers.png',
    href: '/shop?filter=popular',
    count: 'Top Rated'
  }
];

export default function CategoriesPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge text="Collections" />
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Explore Our <br />
              <span className="text-primary">Lineup</span>
            </h1>
            <p className="max-w-xl text-muted-foreground font-medium text-lg md:text-xl">
              From high-performance commuters to essential safety gear, find the perfect addition to your urban journey.
            </p>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-32 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <Link 
                key={category.id} 
                href={category.href}
                className={`group relative overflow-hidden rounded-[48px] bg-muted/30 border border-border/50 aspect-[4/5] flex flex-col transition-all duration-700 hover:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.2)] ${idx === 0 || idx === 3 ? 'lg:col-span-2' : ''}`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-110">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 mt-auto p-10 md:p-12 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">{category.count}</span>
                      <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                      {category.name}
                    </h2>
                    <p className="text-white/60 font-medium max-w-xs transition-opacity duration-500 group-hover:text-white/80">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-widest px-8">
                      View Collection
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:40px_40px]" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary-foreground leading-none">
              Need Help <br />Choosing?
            </h2>
            <p className="text-primary-foreground/70 font-medium">
              Our experts are here to guide you through our lineup and find the perfect GLYDER for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[12px] shadow-2xl">
                  Contact Support
               </Button>
               <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[12px]">
                  Take the Quiz
               </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
      {text}
    </span>
  );
}
