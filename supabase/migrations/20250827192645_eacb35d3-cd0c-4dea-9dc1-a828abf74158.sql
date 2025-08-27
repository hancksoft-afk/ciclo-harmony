-- Insert the missing system settings for registration pages
INSERT INTO public.system_settings (setting_key, setting_value) 
VALUES 
  ('registro_25', false),
  ('registro_150', false),
  ('eduplatform', false)
ON CONFLICT (setting_key) DO NOTHING;