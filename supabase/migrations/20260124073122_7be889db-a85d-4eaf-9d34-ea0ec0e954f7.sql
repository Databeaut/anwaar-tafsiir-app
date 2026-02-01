-- Enable RLS on access_keys table
ALTER TABLE public.access_keys ENABLE ROW LEVEL SECURITY;

-- Drop the insecure public insert policy
DROP POLICY IF EXISTS "Allow public insert for MVP" ON public.access_keys;