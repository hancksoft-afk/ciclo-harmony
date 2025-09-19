-- Add separate Binance enable settings for each registration tier
INSERT INTO system_settings (setting_key, setting_value, created_at, updated_at)
VALUES 
    ('binance_25_enabled', false, NOW(), NOW()),
    ('binance_150_enabled', true, NOW(), NOW())
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    updated_at = NOW();

-- Remove the old global binance_enabled setting since we now have tier-specific ones
DELETE FROM system_settings WHERE setting_key = 'binance_enabled';