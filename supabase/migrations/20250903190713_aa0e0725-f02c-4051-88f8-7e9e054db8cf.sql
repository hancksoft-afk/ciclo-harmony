-- Add new QR settings for Nequi payments (for both $25 and $150 USD)

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