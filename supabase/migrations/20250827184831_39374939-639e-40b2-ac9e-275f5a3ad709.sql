-- Create RLS policies for system_settings table
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to system_settings
CREATE POLICY "Allow public read access to system_settings" 
ON public.system_settings 
FOR SELECT 
USING (true);

-- Allow admin update access to system_settings (you can adjust this based on your auth setup)
CREATE POLICY "Allow admin update access to system_settings" 
ON public.system_settings 
FOR UPDATE 
USING (true);

-- Allow admin insert access to system_settings
CREATE POLICY "Allow admin insert access to system_settings" 
ON public.system_settings 
FOR INSERT 
WITH CHECK (true);