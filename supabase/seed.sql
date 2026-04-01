-- REFINED SEED DATA FOR GLYDER
-- ============================

-- 1. Ensure Categories
INSERT INTO categories (name, slug, description, image_url)
VALUES 
    ('Electric Scooters', 'scooters', 'High-performance urban mobility engineered for the modern explorer.', '/images/categories/scooters.png'),
    ('Accessories', 'accessories', 'Premium gear designed to enhance your riding experience and safety.', '/images/categories/accessories.png'),
    ('Parts', 'parts', 'Replacement parts to keep you moving at peak performance.', '/images/categories/parts.png')
ON CONFLICT (slug) DO UPDATE SET 
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- 2. Insert Products
DO $$
DECLARE
    scooter_id UUID;
    acc_id UUID;
    parts_id UUID;
BEGIN
    SELECT id INTO scooter_id FROM categories WHERE slug = 'scooters';
    SELECT id INTO acc_id FROM categories WHERE slug = 'accessories';
    SELECT id INTO parts_id FROM categories WHERE slug = 'parts';

    -- [SCOOTERS] -----------------------------------------------------------
    
    -- 1. GLYDER Pro X
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'GLYDER Pro X', 'glyder-pro-x',
        'The ultimate long-range urban explorer.',
        'Experience unprecedented freedom with the Pro X. Engineered with a dual-motor system and aerospace-grade suspension, it redefines what an electric scooter can do in the urban landscape.',
        1299.00, 45, scooter_id, true, true, 4.9, 124, 
        ARRAY['1200W Dual Motor', '55-mile Max Range', 'Triple Suspension System', 'Hydraulic Disc Brakes'],
        '{"Top Speed": "35 mph", "Range": "55 miles", "Battery": "60V 21Ah", "Weight": "58 lbs", "Climbing": "30%"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 2. GLYDER Air
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'GLYDER Air', 'glyder-air',
        'Ultra-lightweight portable commuter.',
        'Designed for the multi-modal commuter. The Air is the lightest performance scooter in its class, featuring a one-click folding mechanism that fits anywhere.',
        799.00, 82, scooter_id, true, false, 4.7, 89, 
        ARRAY['Magnesium Alloy Frame', 'One-Click Folding', '22-mile Range', 'Solid Honeycomb Tires'],
        '{"Top Speed": "18 mph", "Range": "22 miles", "Battery": "36V 10Ah", "Weight": "28 lbs", "Folding Time": "3 sec"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 3. GLYDER Urban S
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'GLYDER Urban S', 'glyder-urban-s',
        'The perfect balance of power and price.',
        'The Urban S is our most versatile model, offering enough power for hills while remaining compact enough for the elevator. Now featuring upgraded lighting.',
        999.00, 110, scooter_id, false, true, 4.8, 56, 
        ARRAY['750W Peak Hub Motor', '35-mile Range', 'Rear Drum Brake', 'Ambient Underglow'],
        '{"Top Speed": "25 mph", "Range": "35 miles", "Battery": "48V 13Ah", "Weight": "38 lbs", "Tires": "10-inch Tubeless"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 4. GLYDER Stealth
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'GLYDER Stealth', 'glyder-stealth',
        'Minimum design, maximum impact.',
        'A design masterpiece. The Stealth features no visible cables, a built-in LED matrix display, and a matte carbon finish. For those who value aesthetics as much as performance.',
        1499.00, 15, scooter_id, true, true, 5.0, 12, 
        ARRAY['Hidden Cable Routing', 'Integrated Matrix OLED', 'Carbon Fiber Steering Column', 'NFC Keyless Entry'],
        '{"Top Speed": "30 mph", "Range": "40 miles", "Material": "T700 Carbon", "App": "GLYDER Connect+", "Brakes": "Electronic EABS"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 5. GLYDER Terrain
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'GLYDER Terrain', 'glyder-terrain',
        'Conquer every surface with ease.',
        'Equipped with 11-inch off-road tires and dual swing-arm suspension, the Terrain doesn''t care where the pavement ends. Built for adventure beyond the city limits.',
        1699.00, 24, scooter_id, false, false, 4.6, 45, 
        ARRAY['Off-road Knobby Tires', 'Dual 1000W Motors', 'Long-Travel Suspension', 'Heavy-Duty Kickstand'],
        '{"Top Speed": "40 mph", "Range": "50 miles", "Motor": "Dual 1000W Hub", "Weight": "72 lbs", "Lighting": "Dual Projectors"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 6. GLYDER Pulse
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'GLYDER Pulse', 'glyder-pulse',
        'Dynamic urban agility.',
        'The Pulse is designed for aggressive city riding. Its quick-response throttle and tight turning radius make it the master of the urban jungle.',
        1149.00, 38, scooter_id, false, true, 4.7, 28, 
        ARRAY['Responsive Throttle', 'Tight Turning Radius', 'LED Side Strips', 'Fast-Charge Ready'],
        '{"Top Speed": "28 mph", "Range": "30 miles", "Climbing": "25%", "Colors": "Gunmetal, Onyx"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- [ACCESSORIES] --------------------------------------------------------

    -- 7. Pro Safety Helmet
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'Pro Safety Helmet', 'pro-safety-helmet',
        'High-impact protection with smart tech.',
        'Safety meets style. Features integrated LED blinkers, a detachable magnetic visor, and MIPS protection system for maximum safety.',
        149.00, 200, acc_id, false, true, 4.9, 156, 
        ARRAY['MIPS Protection', 'LED Turn Signals', 'Magnetic Visor', 'Bluetooth Intercom Ready'],
        '{"Weight": "0.9 lbs", "Battery": "12 hours", "Cert": "CE EN1078"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 8. Smart Armor Helmet
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'Smart Armor Helmet', 'smart-armor-helmet',
        'Full-face protection for high speeds.',
        'The ultimate full-face helmet for high-speed GLYDER riders. Features a carbon composite shell and ventilated cooling channels.',
        299.00, 45, acc_id, true, true, 5.0, 8, 
        ARRAY['Carbon Composite', 'Anti-Fog Visor', 'Emergency Release', 'EPE Liner'],
        '{"Safety": "DOT & ECE", "Weight": "1.4 kg", "Sizes": "S, M, L, XL"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 9. Quick-Charge Station
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'Quick-Charge Station', 'quick-charge-station',
        'Cut your charging time by 40%.',
        'The GLYDER official charging dock. Safely manages battery heat and delivers maximum current to get you back on the road faster.',
        199.00, 60, acc_id, false, false, 4.8, 34, 
        ARRAY['Multi-stage Safety', 'LED Status Bar', 'Wall Mountable', 'Auto Shut-off'],
        '{"Output": "5A", "Voltage": "Multi-volt", "Compatibility": "All GLYDERs"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 10. Titan U-Lock
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'Titan U-Lock', 'titan-u-lock',
        'Military grade scooter security.',
        '18mm hardened steel shackle with a dual-locking mechanism. The highest security rating in its class. Keep your GLYDER right where you left it.',
        129.00, 150, acc_id, false, false, 4.9, 87, 
        ARRAY['18mm Hardened Steel', 'Anti-Drill Plate', 'Rubberized Coating', '3 Keys Included'],
        '{"Security": "Gold Rated", "Weight": "2.1 lbs", "Size": "Compact"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 11. Nano-Shield Bag
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'Nano-Shield Bag', 'nano-shield-bag',
        'Waterproof storage for your essentials.',
        'A compact, semi-rigid handlebar bag designed to protect your phone, wallet, and keys from the elements during your ride.',
        59.00, 300, acc_id, false, false, 4.5, 42, 
        ARRAY['Hardshell EVA', 'Waterproof Zipper', 'Multi-pocket Internal', 'Easy-on Straps'],
        '{"Volume": "2.5L", "Material": "TPU/EVA", "Weight": "250g"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 12. Lumen Safety Vest
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'Lumen Safety Vest', 'lumen-vest',
        'Maximum visibility in all conditions.',
        'A high-visibility safety vest with integrated fiber-optic lighting. Enhances your visibility to drivers by over 400% at night.',
        89.00, 120, acc_id, false, true, 4.7, 19, 
        ARRAY['360 Visibility', 'Fiber-Optic Lighting', 'Rechargeable Battery', 'Lightweight Mesh'],
        '{"Battery": "20 hours", "Charging": "USB-C", "Visibility": "1000ft"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- [PARTS] --------------------------------------------------------------

    -- 13. PowerPack 500
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'PowerPack 500', 'powerpack-500',
        'Upgrade or replace your battery.',
        'Genuine GLYDER replacement battery using LG Chem cells. Guaranteed performance and lifespan for your GLYDER Air or Pro models.',
        399.00, 30, parts_id, false, false, 4.8, 15, 
        ARRAY['LG Chem Cells', 'BMS Protection', 'Plug-and-Play', 'OEM Warranty'],
        '{"Capacity": "10.4Ah", "Voltage": "36V", "Weight": "4.2 lbs"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 14. All-Terrain Tire Kit
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'All-Terrain Tire Kit', 'terrain-tire-kit',
        'Grip for every surface.',
        'A pair of puncture-resistant specialized tires with deep tread for superior grip on gravel, grass, and wet pavement.',
        79.00, 80, parts_id, false, false, 4.4, 23, 
        ARRAY['Puncture Resistant', 'Heavy Tread', 'Dual Pack', 'Tubeless Ready'],
        '{"Size": "10-inch", "Material": "Reinforced Rubber", "Grip": "+30%"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

    -- 15. Precision Grip Set
    INSERT INTO products (name, slug, short_description, description, price, stock_quantity, category_id, is_featured, is_new, rating, review_count, features, specs)
    VALUES (
        'Precision Grip Set', 'precision-grips',
        'Enhanced comfort and control.',
        'Ergonomically designed handlebar grips that reduce hand fatigue on long rides. Features a non-slip diamond texture.',
        35.00, 200, parts_id, false, false, 4.9, 67, 
        ARRAY['Ergonomic Shape', 'Anti-Slip Pattern', 'Lock-on Design', 'UV Resistant'],
        '{"Material": "Soft-touch Rubber", "Core": "Nylon", "Length": "130mm"}'::jsonb
    ) ON CONFLICT (slug) DO NOTHING;

END $$;

-- 3. Insert Images Mapping
-- Mapping realistic Unsplash IDs to the products

WITH product_list AS (SELECT id, slug FROM products)
INSERT INTO product_images (product_id, url, alt_text, is_primary, display_order)
VALUES
    ((SELECT id FROM product_list WHERE slug = 'glyder-pro-x'), 'https://images.unsplash.com/photo-1605334960333-30514a600259?auto=format&fit=crop&q=80&w=800', 'Pro X Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'glyder-air'), 'https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=800', 'Air Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'glyder-urban-s'), 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&q=80&w=800', 'Urban S Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'glyder-stealth'), 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', 'Stealth Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'glyder-terrain'), 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800', 'Terrain Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'glyder-pulse'), 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=800', 'Pulse Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'pro-safety-helmet'), 'https://images.unsplash.com/photo-1557160854-e1e89fdd3286?auto=format&fit=crop&q=80&w=800', 'Safety Helmet Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'smart-armor-helmet'), 'https://images.unsplash.com/photo-1575844062827-31a1522a03f4?auto=format&fit=crop&q=80&w=800', 'Smart Armor Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'quick-charge-station'), 'https://images.unsplash.com/photo-1585332961053-bc29a2442233?auto=format&fit=crop&q=80&w=800', 'Charge Station Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'titan-u-lock'), 'https://images.unsplash.com/photo-1622340333271-e97034b76a08?auto=format&fit=crop&q=80&w=800', 'U-Lock Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'nano-shield-bag'), 'https://images.unsplash.com/photo-1523170335258-f5d3f57e3247?auto=format&fit=crop&q=80&w=800', 'Shield Bag Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'lumen-vest'), 'https://images.unsplash.com/photo-1517649763962-0c9f13110250?auto=format&fit=crop&q=80&w=800', 'Safety Vest Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'powerpack-500'), 'https://images.unsplash.com/photo-1581092160699-ce12efd89886?auto=format&fit=crop&q=80&w=800', 'PowerPack Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'terrain-tire-kit'), 'https://images.unsplash.com/photo-1580273916328-4bc469618990?auto=format&fit=crop&q=80&w=800', 'Tire Kit Main', true, 0),
    ((SELECT id FROM product_list WHERE slug = 'precision-grips'), 'https://images.unsplash.com/photo-1485962307415-f6a6211111bd?auto=format&fit=crop&q=80&w=800', 'Grips Main', true, 0)
ON CONFLICT DO NOTHING;
