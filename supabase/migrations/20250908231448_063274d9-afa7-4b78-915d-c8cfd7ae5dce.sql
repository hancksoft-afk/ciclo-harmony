-- Add columns for Nequi reference IDs in register150 table
ALTER TABLE public.register150 
ADD COLUMN nequi_id_step2 TEXT NULL,
ADD COLUMN nequi_id_step3 TEXT NULL;