-- Insert or update system settings for ritual card visibility
INSERT INTO system_settings (setting_key, setting_value) VALUES 
  ('register_25_visible', true),
  ('register_150_visible', true),
  ('eduplatform_visible', true)
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value;