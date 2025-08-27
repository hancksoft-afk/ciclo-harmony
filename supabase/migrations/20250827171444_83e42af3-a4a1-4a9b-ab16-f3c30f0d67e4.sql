-- Insert or update system settings for ritual card visibility
INSERT INTO system_settings (setting_key, setting_value, description) VALUES 
  ('register_25_visible', true, 'Controls visibility of 25 USD registration card'),
  ('register_150_visible', true, 'Controls visibility of 150 USD registration card'),
  ('eduplatform_visible', true, 'Controls visibility of Eduplatform card')
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;