import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/app/admin/(dashboard)/products/_components/product-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*');
  
  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(url, is_primary)')
    .eq('id', id)
    .single();

  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Edit <span className="text-primary">Product</span></h1>
            <p className="text-muted-foreground font-medium italic">Update {product.name} details.</p>
          </div>
        </div>
        <div className="bg-background rounded-[40px] border border-border/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-8 md:p-12">
          <ProductForm categories={categories || []} initialData={product} />
        </div>
      </div>
    </div>
  );
}
