-- Create user_actions_history table to track admin actions
CREATE TABLE public.user_actions_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_country TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'approved', 'disapproved'
  admin_action_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_actions_history ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage user actions history" 
ON public.user_actions_history 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE TRIGGER update_user_actions_history_updated_at
BEFORE UPDATE ON public.user_actions_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();