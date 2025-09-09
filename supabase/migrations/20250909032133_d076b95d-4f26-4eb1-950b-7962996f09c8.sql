-- Insert initial system settings for card visibility control
INSERT INTO system_settings (setting_key, setting_value) VALUES 
('register_25_visible', true),
('register_150_visible', true), 
('eduplatform_visible', true)
ON CONFLICT (setting_key) DO NOTHING;