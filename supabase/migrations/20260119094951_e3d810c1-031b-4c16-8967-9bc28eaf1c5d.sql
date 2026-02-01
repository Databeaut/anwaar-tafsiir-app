-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can read access_keys for login" ON public.access_keys;

-- No new SELECT policy is needed since validation is now done via edge functions 
-- using the service role key, which bypasses RLS