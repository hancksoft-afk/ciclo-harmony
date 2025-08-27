-- Update qr_settings table to allow admin types
ALTER TABLE qr_settings DROP CONSTRAINT IF EXISTS qr_settings_type_check;

-- Add new constraint that includes admin types
ALTER TABLE qr_settings ADD CONSTRAINT qr_settings_type_check 
CHECK (type IN ('register', 'register150', 'register_admin', 'register150_admin'));