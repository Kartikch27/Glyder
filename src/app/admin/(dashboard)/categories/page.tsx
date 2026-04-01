'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Layers,
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
import { createClient } from '@/lib/supabase/client';
import { deleteCategory, createCategory, updateCategory } from '@/app/actions/admin';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, CategoryFormValues } from '@/lib/validations/admin';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const supabase = createClient();

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      toast.error(error.message);
    } else {
      setCategories(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This might affect products in this category.')) {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error(result.error);
      }
    }
  };

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image_url: '',
    },
  });

  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || '',
        image_url: editingCategory.image_url || '',
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        image_url: '',
      });
    }
  }, [editingCategory, form]);

  async function onSubmit(values: CategoryFormValues) {
    let result;
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, values);
    } else {
      result = await createCategory(values);
    }

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingCategory ? 'Category updated' : 'Category created');
      setIsFormOpen(false);
      fetchCategories();
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Category <span className="text-primary">Management</span></h1>
          <p className="text-muted-foreground font-medium italic">Organize your products into logical groups.</p>
        </div>
        <Button 
          onClick={() => { setEditingCategory(null); setIsFormOpen(true); }}
          className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> New Category
        </Button>
      </div>

      <div className="rounded-[32px] border border-border/50 bg-background overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4 px-6">Category Name</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest">Loading Categories...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Layers className="h-12 w-12 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest">No categories found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="border-border/50 hover:bg-muted/5 group">
                  <TableCell className="py-5 px-6">
                    <p className="font-black text-sm uppercase tracking-tight">{category.name}</p>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-muted px-2 py-1 rounded-md font-bold">{category.slug}</code>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {category.description || 'No description provided.'}
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
                        <DropdownMenuItem 
                          onClick={() => { setEditingCategory(category); setIsFormOpen(true); }}
                          className="rounded-xl cursor-pointer py-3 gap-3 font-bold text-xs uppercase tracking-widest"
                        >
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(category.id)}
                          className="rounded-xl cursor-pointer py-3 gap-3 font-bold text-xs uppercase tracking-widest text-destructive focus:text-destructive focus:bg-destructive/5"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md rounded-[40px] border-none shadow-2xl p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              {editingCategory ? 'Edit' : 'Create'} <span className="text-primary">Category</span>
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Electric Scooters" {...field} className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" />
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
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest">Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="electric-scooters" {...field} className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest">Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional description..." {...field} className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border/50 focus-visible:ring-2 focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-14 text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
