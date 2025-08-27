-- Create user_actions_history2 table for register150 users
CREATE TABLE public.user_actions_history2 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_country TEXT NOT NULL,
  action_type TEXT NOT NULL,
  admin_action_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_actions_history2 ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage user actions history2
CREATE POLICY "Admins can manage user actions history2" 
ON public.user_actions_history2 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_actions_history2_updated_at
BEFORE UPDATE ON public.user_actions_history2
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();