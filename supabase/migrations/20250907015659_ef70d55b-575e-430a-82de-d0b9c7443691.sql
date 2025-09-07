-- Add price fields for different currencies to qr_settings table
ALTER TABLE public.qr_settings 
ADD COLUMN price_usd DECIMAL(10,2) DEFAULT 25.00,
ADD COLUMN price_cop DECIMAL(15,2) DEFAULT 100000.00;