-- Create table for payment method preferences
CREATE TABLE public.payment_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country text NOT NULL,
  payment_method text NOT NULL,
  is_preferred boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(country, payment_method)
);

-- Enable RLS
ALTER TABLE public.payment_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active payment preferences" 
ON public.payment_preferences 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage payment preferences" 
ON public.payment_preferences 
FOR ALL 
USING (true);

-- Insert default preferences for existing countries
INSERT INTO public.payment_preferences (country, payment_method, is_preferred) VALUES
('México', 'binance_pay', true),
('México', 'nequi', false),
('España', 'binance_pay', true),
('España', 'nequi', false),
('Colombia', 'nequi', true),
('Colombia', 'binance_pay', false),
('Argentina', 'binance_pay', true),
('Argentina', 'nequi', false),
('Perú', 'binance_pay', true),
('Perú', 'nequi', false),
('Chile', 'binance_pay', true),
('Chile', 'nequi', false);