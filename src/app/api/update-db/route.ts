import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('categories').update({ image_url: '/images/gen/ac_v2.png' }).eq('name', 'Air Conditioners');
    await supabase.from('categories').update({ image_url: '/images/gen/cables_v2.png' }).eq('name', 'Cables');
    await supabase.from('categories').update({ image_url: '/images/gen/cameras_v2.png' }).eq('name', 'Cameras');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 200 });
  }
}
