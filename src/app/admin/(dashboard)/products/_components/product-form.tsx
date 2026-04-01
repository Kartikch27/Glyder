'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  productSchema, 
  ProductFormValues 
} from '@/lib/validations/admin';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { createProduct, updateProduct, uploadProductImageAction } from '@/app/actions/admin';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  categories: any[];
  initialData?: any;
  onSuccess?: () => void;
}

export function ProductForm({ categories, initialData, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.product_images?.map((img: any) => img.url) || []);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData ? {
      name: initialData.name,
      slug: initialData.slug,
      short_description: initialData.short_description || '',
      description: initialData.description,
      price: Number(initialData.price),
      stock_quantity: Number(initialData.stock_quantity),
      category_id: initialData.category_id,
      is_featured: !!initialData.is_featured,
      is_new: !!initialData.is_new,
      features: initialData.features || [],
      specs: initialData.specs || {},
    } : {
      name: '',
      slug: '',
      short_description: '',
      description: '',
      price: 0,
      stock_quantity: 0,
      category_id: '',
      is_featured: false,
      is_new: true,
      features: [],
      specs: {},
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);

      const response = await uploadProductImageAction(formData);

      if (response.error || !response.publicUrl) {
        toast.error(`Upload failed: ${response.error || 'Unknown error'}`);
        continue;
      }

      newImages.push(response.publicUrl);
    }

    setImages(newImages);
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);
    try {
      let result;
      if (initialData) {
        result = await updateProduct(initialData.id, data, images);
      } else {
        result = await createProduct(data, images);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(initialData ? 'Product updated' : 'Product created');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/admin/products');
          router.refresh();
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50 pb-2">Basic Details</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest">Product Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="GLYDER Pro Max" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-generate slug if not editing
                        if (!initialData) {
                          const slug = e.target.value
                            .toLowerCase()
                            .replace(/[^\w ]+/g, '')
                            .replace(/ +/g, '-');
                          form.setValue('slug', slug);
                        }
                      }}
                      className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest">Short Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Premium electric scooter for urban commuting." {...field} className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest">URL Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="glyder-pro-max" {...field} className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" />
                  </FormControl>
                  <FormDescription className="text-[10px]">Unique identifier for the product URL.</FormDescription>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest">Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest">Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest">Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border/50 p-2">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="rounded-lg font-bold text-xs uppercase tracking-widest py-3">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />
          </div>

          {/* Media & Content */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50 pb-2">Media & Status</h3>
            
            <div className="space-y-4">
              <FormLabel className="text-[10px] font-black uppercase tracking-widest">Product Images</FormLabel>
              <div className="grid grid-cols-3 gap-4">
                {images.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl bg-muted overflow-hidden group border border-border/50">
                    <img src={url} alt="Product" className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {idx === 0 && <Badge className="absolute bottom-2 left-2 bg-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-none">Primary</Badge>}
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground text-center px-2">Upload Images</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-muted/30 p-6 rounded-2xl border border-border/50">
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest">Featured</FormLabel>
                      <FormDescription className="text-[8px]">Show on homepage</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_new"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest">New Arrival</FormLabel>
                      <FormDescription className="text-[8px]">Show "New" badge</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase tracking-widest">Full Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell customers about the build quality, performance, and key highlights..." 
                  className="min-h-[150px] rounded-2xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary font-medium p-6" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-[10px] font-bold" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading || isUploading} 
            className="flex-1 h-16 text-lg font-black uppercase tracking-widest rounded-2xl gap-3 shadow-xl shadow-primary/20"
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>{initialData ? 'Update Product' : 'Launch Product'}</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}
