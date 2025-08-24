-- Create separate tables for register and register150
CREATE TABLE public.register (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  has_money BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  invitee TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  binance_id TEXT,
  binance_id_step2 TEXT,
  binance_id_step3 TEXT,
  order_id_1 TEXT,
  order_id_2 TEXT,
  ticket_id TEXT,
  codigo_full TEXT,
  codigo_masked TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE public.register150 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  has_money BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  invitee TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  binance_id TEXT,
  binance_id_step2 TEXT,
  binance_id_step3 TEXT,
  order_id_1 TEXT,
  order_id_2 TEXT,
  ticket_id TEXT,
  codigo_full TEXT,
  codigo_masked TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL
);

-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.register ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.register150 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to register tables
CREATE POLICY "Anyone can create register records" ON public.register FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view register records" ON public.register FOR SELECT USING (true);

CREATE POLICY "Anyone can create register150 records" ON public.register150 FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view register150 records" ON public.register150 FOR SELECT USING (true);

-- Create policies for admin_users (only admins can manage)
CREATE POLICY "Admins can view admin_users" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Anyone can create admin_users" ON public.admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update admin_users" ON public.admin_users FOR UPDATE USING (true);

-- Create update triggers for timestamps
CREATE TRIGGER update_register_updated_at
  BEFORE UPDATE ON public.register
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_register150_updated_at
  BEFORE UPDATE ON public.register150
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();