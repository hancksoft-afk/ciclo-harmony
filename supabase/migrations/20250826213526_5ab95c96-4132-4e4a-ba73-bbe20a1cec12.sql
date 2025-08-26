-- Create storage buckets for videos and images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('notification-videos', 'notification-videos', true),
  ('qr-codes', 'qr-codes', true);

-- Create RLS policies for notification videos
CREATE POLICY "Anyone can view notification videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'notification-videos');

CREATE POLICY "Admins can upload notification videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'notification-videos');

CREATE POLICY "Admins can update notification videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'notification-videos');

CREATE POLICY "Admins can delete notification videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'notification-videos');

-- Create RLS policies for QR codes
CREATE POLICY "Anyone can view QR codes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'qr-codes');

CREATE POLICY "Admins can upload QR codes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'qr-codes');

CREATE POLICY "Admins can update QR codes" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'qr-codes');

CREATE POLICY "Admins can delete QR codes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'qr-codes');

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Anyone can view published notifications" 
ON public.notifications 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage notifications" 
ON public.notifications 
FOR ALL 
USING (true);

-- Create QR settings table
CREATE TABLE public.qr_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('register', 'register150')),
  code_id TEXT NOT NULL,
  remaining_time INTEGER NOT NULL,
  qr_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on qr_settings
ALTER TABLE public.qr_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for qr_settings
CREATE POLICY "Anyone can view active QR settings" 
ON public.qr_settings 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage QR settings" 
ON public.qr_settings 
FOR ALL 
USING (true);

-- Create system settings table for dashboard toggles
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system_settings
CREATE POLICY "Anyone can view system settings" 
ON public.system_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (true);

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value) VALUES 
  ('register_25usd_enabled', true),
  ('register_150usd_enabled', true),
  ('eduplatform_enabled', true);

-- Add triggers for updated_at
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qr_settings_updated_at
BEFORE UPDATE ON public.qr_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();