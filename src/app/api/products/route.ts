import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const isFeatured = searchParams.get('is_featured');
    
    const supabase = await createClient();
    
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        images:product_images(url, alt_text, is_primary)
      `);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (isFeatured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
