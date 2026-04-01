-- Create the store_settings singleton table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL DEFAULT 'GLYDER',
  support_email TEXT NOT NULL DEFAULT 'support@glyder.com',
  contact_number TEXT NOT NULL DEFAULT '+1 (800) 123-4567',
  store_address TEXT NOT NULL DEFAULT '123 Glide Street, CA 90210',
  order_auto_fail_minutes INT NOT NULL DEFAULT 60,
  cod_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bind the updated_at tracking trigger
CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public read access (useful for storefront footers/emails)
CREATE POLICY "Store settings viewable by everyone" ON store_settings FOR SELECT USING (true);

-- Admin modification access
CREATE POLICY "Store settings modifiable by admins only" ON store_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
