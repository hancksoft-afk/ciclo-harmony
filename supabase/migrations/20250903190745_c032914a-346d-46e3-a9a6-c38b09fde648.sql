-- Update the check constraint to include new Nequi payment types
ALTER TABLE qr_settings DROP CONSTRAINT qr_settings_type_check;

-- Add updated constraint with Nequi types
ALTER TABLE qr_settings ADD CONSTRAINT qr_settings_type_check 
CHECK (type = ANY (ARRAY[
  'register'::text, 
  'register150'::text, 
  'register_admin'::text, 
  'register150_admin'::text,
  'register_nequi'::text,
  'register_admin_nequi'::text,
  'register150_nequi'::text,
  'register150_admin_nequi'::text
]));

-- Insert Nequi QR settings for $25 USD (register)
INSERT INTO qr_settings (type, code_id, remaining_time)
VALUES 
  ('register_nequi', 'NEQUI25-DEFAULT', 1800),
  ('register_admin_nequi', 'NEQUI25-ADM-DEFAULT', 1800);

-- Insert Nequi QR settings for $150 USD (register150)
INSERT INTO qr_settings (type, code_id, remaining_time)
VALUES 
  ('register150_nequi', 'NEQUI150-DEFAULT', 1800),
  ('register150_admin_nequi', 'NEQUI150-ADM-DEFAULT', 1800);