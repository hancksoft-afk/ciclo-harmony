-- Add new system setting for controlling the "Registro Cerrado" message
INSERT INTO system_settings (setting_key, setting_value) 
VALUES ('register_closed_message', false)
ON CONFLICT (setting_key) DO NOTHING;