'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  LayoutGrid, 
  List,
  X,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ProductCard } from '@/components/common/ProductCard';

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  is_featured: boolean;
  is_new: boolean;
  rating: number;
  review_count: number;
  specs: any;
  features: string[];
  category: {
    name: string;
    slug: string;
  };
  images: Array<{
    url: string;
    alt_text: string;
    is_primary: boolean;
  }>;
  created_at?: string;
}

export interface FilterState {
  categories: string[];
  priceRange: number[];
  ratings: number[];
  search: string;
  sort: string;
}

function FilterSidebar({ 
  filters, 
  setFilters,
  resetFilters,
  availableCategories
}: { 
  filters: FilterState, 
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>,
  resetFilters: () => void,
  availableCategories: string[]
}) {
  const toggleCategory = (name: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(name) 
        ? prev.categories.filter(c => c !== name)
        : [...prev.categories, name]
    }));
  };

  const toggleRating = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      ratings: prev.ratings.includes(rating) 
        ? prev.ratings.filter(r => r !== rating)
        : [...prev.ratings, rating]
    }));
  };

  const [localPrice, setLocalPrice] = React.useState(filters.priceRange);
  const [showAllCategories, setShowAllCategories] = React.useState(false);
  
  const CATEGORY_LIMIT = 5;
  const displayedCategories = showAllCategories ? availableCategories : availableCategories.slice(0, CATEGORY_LIMIT);
  const hasMoreCategories = availableCategories.length > CATEGORY_LIMIT;
  
  React.useEffect(() => {
    setLocalPrice(filters.priceRange);
  }, [filters.priceRange]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest mb-4">Categories</h3>
        <div className="space-y-3">
          {availableCategories.length > 0 ? (
            <>
              {displayedCategories.map((name) => (
                <div key={name} className="flex items-center gap-2 group">
                  <Checkbox 
                    id={`cat-${name}`} 
                    checked={filters.categories.includes(name)}
                    onCheckedChange={() => toggleCategory(name)}
                    className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
                  />
                  <label htmlFor={`cat-${name}`} className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors flex-1 py-1">
                    {name}
                  </label>
                </div>
              ))}
              {hasMoreCategories && (
                <button 
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors mt-2"
                >
                  {showAllCategories ? '- Show Less' : `+ Show ${availableCategories.length - CATEGORY_LIMIT} More`}
                </button>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground italic">No categories available.</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black uppercase tracking-widest">Price Range</h3>
          <span className="text-xs font-bold text-primary">${localPrice[0]} - ${localPrice[1]}</span>
        </div>
        <Slider
          defaultValue={[0, 2500]}
          max={2500}
          step={50}
          value={localPrice}
          onValueChange={(val) => setLocalPrice(val as number[])}
          onValueCommitted={(val: number | readonly number[]) => setFilters(prev => ({ ...prev, priceRange: val as number[] }))}
          className="py-4 cursor-grab active:cursor-grabbing"
        />
      </div>

      <div>
        <h3 className="text-sm font-black uppercase tracking-widest mb-4">Rating</h3>
        <div className="space-y-3">
          {[4, 3, 2].map((rating) => (
            <div key={rating} className="flex items-center gap-2 group">
              <Checkbox 
                id={`r-${rating}`} 
                checked={filters.ratings.includes(rating)}
                onCheckedChange={() => toggleRating(rating)}
                className="rounded-md border-muted-foreground/30" 
              />
              <label htmlFor={`r-${rating}`} className="text-sm font-medium flex items-center gap-1 cursor-pointer group-hover:text-primary transition-colors flex-1 py-1">
                {rating}+ Stars
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={resetFilters} variant="outline" className="w-full font-bold uppercase tracking-widest text-xs h-12 rounded-xl">
        Reset Filters
      </Button>
    </div>
  );
}

export default function ShopPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 2500],
    ratings: [],
    search: '',
    sort: 'newest'
  });

  const resetFilters = () => setFilters({
    categories: [],
    priceRange: [0, 2500],
    ratings: [],
    search: '',
    sort: 'newest'
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      const supabase = createClient();
      const { data } = await supabase.from('categories').select('name');
      if (data) {
        setAllCategories(data.map(c => c.name).sort());
      }
    }

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.categories.length > 0 && !filters.categories.includes(product.category?.name)) return false;
      
      const rawPrice = product.price != null ? Number(product.price) : 0;
      if (rawPrice < filters.priceRange[0] || rawPrice > filters.priceRange[1]) return false;
      
      if (filters.ratings.length > 0 && !filters.ratings.some(r => (product.rating || 0) >= r)) return false;
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        if (!product.name.toLowerCase().includes(query) && !product.description?.toLowerCase().includes(query)) return false;
      }
      
      return true;
    }).sort((a, b) => {
      if (filters.sort === 'price-low') return Number(a.price) - Number(b.price);
      if (filters.sort === 'price-high') return Number(b.price) - Number(a.price);
      if (filters.sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  }, [products, filters]);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Shop</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none whitespace-nowrap overflow-hidden text-ellipsis">
            EXPLORE THE <span className="text-primary">COLLECTION</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} resetFilters={resetFilters} availableCategories={allCategories} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/30 p-4 rounded-2xl border border-border/50">
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search products..."
                  className="pl-10 h-10 bg-background border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Sheet>
                  <SheetTrigger
                    className="lg:hidden flex-1"
                    render={
                      <Button variant="outline" className="w-full gap-2 font-bold h-10 rounded-xl">
                        <Filter className="h-4 w-4" /> Filters
                      </Button>
                    }
                  />
                  <SheetContent side="left" className="w-[300px]">
                    <SheetHeader className="mb-8">
                      <SheetTitle className="text-left font-black uppercase tracking-widest">Filters</SheetTitle>
                    </SheetHeader>
                    <FilterSidebar filters={filters} setFilters={setFilters} resetFilters={resetFilters} availableCategories={allCategories} />
                  </SheetContent>
                </Sheet>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline" className="flex-1 sm:flex-none gap-2 font-bold h-10 rounded-xl min-w-[140px]">
                        {filters.sort === 'newest' ? 'Newest First' : 
                         filters.sort === 'price-low' ? 'Price: Low to High' :
                         filters.sort === 'price-high' ? 'Price: High to Low' : 
                         'Best Rating'} <ChevronDown className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 cursor-pointer">
                    <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, sort: 'newest' }))} className="rounded-lg font-medium cursor-pointer hover:bg-muted/50">Newest First</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, sort: 'price-low' }))} className="rounded-lg font-medium cursor-pointer hover:bg-muted/50">Price: Low to High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, sort: 'price-high' }))} className="rounded-lg font-medium cursor-pointer hover:bg-muted/50">Price: High to Low</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, sort: 'rating' }))} className="rounded-lg font-medium cursor-pointer hover:bg-muted/50">Best Rating</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="hidden sm:flex items-center gap-1 bg-background p-1 rounded-xl border border-border/50">
                  <Button 
                    variant={view === 'grid' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setView('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={view === 'list' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setView('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {(filters.categories.length > 0 || filters.ratings.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 2500 || filters.search) && (
              <div className="flex flex-wrap items-center gap-2">
                {filters.categories.map(cat => (
                  <Badge key={cat} variant="secondary" className="gap-1 px-3 py-1 rounded-full bg-primary/5 text-primary border-primary/10 font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:bg-primary/10 transition-colors"
                         onClick={() => setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))}>
                    {cat} <X className="h-3 w-3" />
                  </Badge>
                ))}
                
                {filters.ratings.map(rating => (
                  <Badge key={rating} variant="secondary" className="gap-1 px-3 py-1 rounded-full bg-primary/5 text-primary border-primary/10 font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:bg-primary/10 transition-colors"
                         onClick={() => setFilters(prev => ({ ...prev, ratings: prev.ratings.filter(r => r !== rating) }))}>
                    {rating}+ Stars <X className="h-3 w-3" />
                  </Badge>
                ))}
                
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 2500) && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1 rounded-full bg-primary/5 text-primary border-primary/10 font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:bg-primary/10 transition-colors"
                         onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 2500] }))}>
                    ${filters.priceRange[0]} - ${filters.priceRange[1]} <X className="h-3 w-3" />
                  </Badge>
                )}
                
                <button onClick={resetFilters} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary underline underline-offset-4 ml-2">
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Loading products...</p>
              </div>
            ) : error ? (
              <div className="bg-destructive/10 border border-destructive/20 p-8 rounded-2xl text-center">
                <p className="text-destructive font-bold mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-xs">
                  Try Again
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-muted/30 border border-border/50 p-12 rounded-2xl text-center">
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No products matched your filters</p>
                <Button onClick={resetFilters} variant="outline" className="mt-4 rounded-xl font-bold uppercase tracking-widest text-xs">Clear Filters</Button>
              </div>
            ) : (
              <div className={`grid gap-8 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center pt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-10 w-10 p-0 rounded-xl" disabled>
                  <span className="sr-only">Previous Page</span>
                  &larr;
                </Button>
                <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl font-bold">1</Button>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl font-bold">2</Button>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl font-bold">3</Button>
                <Button variant="outline" className="h-10 w-10 p-0 rounded-xl">
                  <span className="sr-only">Next Page</span>
                  &rarr;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
