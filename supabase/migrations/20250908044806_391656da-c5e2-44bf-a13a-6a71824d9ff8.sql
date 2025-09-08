-- Add email column to register table for $25 USD registration
ALTER TABLE public.register 
ADD COLUMN IF NOT EXISTS email text;