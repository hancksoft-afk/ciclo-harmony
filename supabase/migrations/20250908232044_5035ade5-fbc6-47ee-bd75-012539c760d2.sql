-- Add columns for Nequi reference IDs in register table
ALTER TABLE public.register 
ADD COLUMN nequi_id_step2 TEXT NULL,
ADD COLUMN nequi_id_step3 TEXT NULL;