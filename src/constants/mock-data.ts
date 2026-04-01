export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category?: {
    name: string;
    slug: string;
  } | string;
  images: Array<{
    url: string;
    alt_text?: string;
    is_primary?: boolean;
  }> | string[];
  features: string[];
  specs: Record<string, any>;
  is_new?: boolean;
  is_featured?: boolean;
  rating: number;
  review_count: number;
  // Legacy fields for backward compatibility if needed
  isNew?: boolean;
  isFeatured?: boolean;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat1',
    name: 'Electric Scooters',
    description: 'High-performance scooters for urban mobility.',
    image: 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=800',
    slug: 'scooters',
  },
  {
    id: 'cat2',
    name: 'Accessories',
    description: 'Essential gear for your GLYDER ride.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
    slug: 'accessories',
  },
  {
    id: 'cat3',
    name: 'Parts',
    description: 'Replacement parts to keep you moving.',
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=800',
    slug: 'parts',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'GLYDER Pro X',
    slug: 'glyder-pro-x',
    description: 'The ultimate urban explorer. Features a massive range and peak performance motor.',
    price: 1299,
    category: 'scooters',
    images: ['https://images.unsplash.com/photo-1605334960333-30514a600259?auto=format&fit=crop&q=80&w=800'],
    features: ['750W Peak Power', '45-mile Range', 'Dual Suspension', 'Hydraulic Brakes'],
    specs: {
      'Top Speed': '28 mph',
      'Range': '45 miles',
      'Motor': '500W (750W Peak)',
      'Weight': '42 lbs',
      'Max Load': '265 lbs',
      'Charge Time': '6-7 hours',
    },
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 124,
    review_count: 124,
  },
  {
    id: 'p2',
    name: 'GLYDER Air',
    slug: 'glyder-air',
    description: 'Ultra-lightweight design for the daily commuter who needs portability.',
    price: 799,
    category: 'scooters',
    images: ['https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=800'],
    features: ['Aerospace Aluminum', 'One-click Folding', '25-mile Range', 'IP54 Waterproof'],
    specs: {
      'Top Speed': '18 mph',
      'Range': '25 miles',
      'Motor': '350W',
      'Weight': '28 lbs',
      'Max Load': '220 lbs',
      'Charge Time': '4-5 hours',
    },
    isFeatured: true,
    rating: 4.7,
    reviewCount: 89,
    review_count: 89,
  },
  {
    id: 'p3',
    name: 'GLYDER Sport S',
    slug: 'glyder-sport-s',
    description: 'Sporty performance with enhanced stability and larger 10-inch tires.',
    price: 999,
    category: 'scooters',
    images: ['https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&q=80&w=800'],
    features: ['10-inch Air Tires', 'E-ABS Braking', '35-mile Range', 'Digital Display'],
    specs: {
      'Top Speed': '22 mph',
      'Range': '35 miles',
      'Motor': '500W',
      'Weight': '35 lbs',
      'Max Load': '240 lbs',
      'Charge Time': '5-6 hours',
    },
    isNew: false,
    rating: 4.8,
    reviewCount: 56,
    review_count: 56,
  },
  {
    id: 'p4',
    name: 'Pro Safety Helmet',
    slug: 'pro-safety-helmet',
    description: 'Impact-resistant smart helmet with integrated LED lighting.',
    price: 149,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1557160854-e1e89fdd3286?auto=format&fit=crop&q=80&w=800'],
    features: ['LED Turn Signals', 'Breathable Design', 'Lightweight', 'MIPS Technology'],
    specs: {
      'Battery Life': '10 hours',
      'Weight': '0.8 lbs',
      'Certification': 'CPSC & CE',
    },
    isNew: true,
    rating: 4.6,
    reviewCount: 32,
    review_count: 32,
  },
  {
    id: 'p5',
    name: 'Heavy Duty Lock',
    slug: 'heavy-duty-lock',
    description: 'Maximum security U-lock with 14mm hardened steel shackle.',
    price: 89,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=800'],
    features: ['Hardened Steel', 'Double Deadbolt', 'Dust Cover', 'Includes 3 Keys'],
    specs: {
      'Shackle Size': '14mm',
      'Security Level': '9/10',
    },
    rating: 4.5,
    reviewCount: 41,
    review_count: 41,
  },
  {
    id: 'p6',
    name: 'GLYDER Fast Charger',
    slug: 'glyder-fast-charger',
    description: 'Reduce charging time by up to 50% with our smart fast charger.',
    price: 129,
    category: 'parts',
    images: ['https://images.unsplash.com/photo-1558389186-438424b00a32?auto=format&fit=crop&q=80&w=800'],
    features: ['Overcharge Protection', 'Active Cooling', 'LED Indicator', 'Universal Plug'],
    specs: {
      'Output': '42V 4A',
      'Compatibility': 'All GLYDER Models',
    },
    rating: 4.9,
    reviewCount: 28,
    review_count: 28,
  },
];
