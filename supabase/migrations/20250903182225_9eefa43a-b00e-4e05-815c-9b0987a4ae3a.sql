-- Ensure system_settings table has the required toggle settings
INSERT INTO public.system_settings (setting_key, setting_value)
VALUES 
  ('binance_enabled', true),
  ('nequi_25_enabled', true),
  ('nequi_150_enabled', true)
ON CONFLICT (setting_key) DO NOTHING;