import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ item_id: string }> }
) {
  try {
    const { item_id } = await params;
    const { quantity } = await request.json();
    const supabase = await createClient();

    if (quantity === undefined || quantity < 0) {
      return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 });
    }

    // Get current user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the cart item through the cart's user_id
    const { data: cartItem, error: fetchError } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        carts!inner(user_id)
      `)
      .eq('id', item_id)
      .eq('carts.user_id', user.id)
      .single();

    if (fetchError || !cartItem) {
      return NextResponse.json({ error: 'Cart item not found or unauthorized' }, { status: 404 });
    }

    if (quantity === 0) {
      // If quantity is 0, delete the item
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', item_id);

      if (deleteError) {
        console.error('Error deleting cart item:', deleteError);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
      }

      return NextResponse.json({ success: true, deleted: true });
    }

    // Update quantity
    const { data: updatedItem, error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', item_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating cart item:', updateError);
      return NextResponse.json({ error: 'Failed to update quantity' }, { status: 500 });
    }

    return NextResponse.json({ success: true, updatedItem });
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ item_id: string }> }
) {
  try {
    const { item_id } = await params;
    const supabase = await createClient();

    // Get current user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the cart item
    const { data: cartItem, error: fetchError } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        carts!inner(user_id)
      `)
      .eq('id', item_id)
      .eq('carts.user_id', user.id)
      .single();

    if (fetchError || !cartItem) {
      return NextResponse.json({ error: 'Cart item not found or unauthorized' }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', item_id);

    if (deleteError) {
      console.error('Error deleting cart item:', deleteError);
      return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
