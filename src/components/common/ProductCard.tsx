'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/store/use-cart';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { type Product } from '@/app/shop/page';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const supabase = createClient();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCart(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const response = await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
        
        if (!response.ok) throw new Error('Failed to add to cart on server');
      }

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) || null,
        quantity: 1,
        slug: product.slug,
      });
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
       toast.error('Could not add item to cart');
    } finally {
       setAddingToCart(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden border-none bg-card shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted flex items-center justify-center">
          {/* Product Image */}
          {product.images && product.images.length > 0 && !imageError ? (
            <img 
              src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url} 
              alt={product.name}
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
              <ImageIcon className="h-12 w-12" />
              <span className="text-[10px] font-bold uppercase tracking-widest">No Image Available</span>
            </div>
          )}
          
          {/* Skeleton Overlay when loading (simplified) */}
          {!imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 opacity-0 group-hover:opacity-10 transition-opacity" />
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.is_new && (
              <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full uppercase tracking-tighter text-[10px]">
                New
              </Badge>
            )}
            {product.is_featured && (
              <Badge variant="secondary" className="font-bold px-3 py-1 rounded-full uppercase tracking-tighter text-[10px]">
                Featured
              </Badge>
            )}
          </div>

          <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
            <Button onClick={handleAddToCart} disabled={addingToCart} className="w-full font-bold shadow-lg gap-2 h-11 rounded-xl">
              <ShoppingCart className="h-4 w-4" /> {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-5 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
            <h3 className="font-bold text-lg leading-tight tracking-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 shrink-0 bg-primary/5 px-2 py-0.5 rounded-full">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-[10px] font-bold text-primary">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
          {product.description}
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-2xl font-black tracking-tighter">
            ${product.price.toLocaleString()}
          </span>
          {/* Mobile Add to Cart Button */}
          <Button 
            size="icon" 
            variant="outline" 
            disabled={addingToCart}
            onClick={handleAddToCart}
            className="md:hidden rounded-full h-10 w-10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
