-- Remove the public read policy that exposes admin passwords
DROP POLICY IF EXISTS "Allow public read for login" ON public.admins;

-- Create a secure policy that only allows service role access (for edge functions)
-- No public access at all - all authentication happens server-side