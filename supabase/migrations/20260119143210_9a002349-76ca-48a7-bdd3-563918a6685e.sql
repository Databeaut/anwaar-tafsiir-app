-- Create admins table for MVP authentication
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow public read for login validation
CREATE POLICY "Allow public read for login" 
ON public.admins 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Insert initial admin
INSERT INTO public.admins (username, password) 
VALUES ('Zaki', 'coder2389');