-- Add ENUM values for order status if they don't exist
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'confirmed';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'failed';

-- Add timestamp columns
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
