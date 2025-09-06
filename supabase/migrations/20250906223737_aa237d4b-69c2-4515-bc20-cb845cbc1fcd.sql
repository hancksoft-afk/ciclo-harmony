-- Allow DELETE operations for register table
CREATE POLICY "Admins can delete register records" 
ON public.register 
FOR DELETE 
USING (true);

-- Allow DELETE operations for register150 table  
CREATE POLICY "Admins can delete register150 records" 
ON public.register150 
FOR DELETE 
USING (true);