-- Add UPDATE permission for register150 table (needed for approval workflow)
CREATE POLICY "Admins can update register150 records" 
ON public.register150 
FOR UPDATE 
USING (true);