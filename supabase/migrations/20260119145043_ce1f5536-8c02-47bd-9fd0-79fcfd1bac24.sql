-- Add permissive INSERT policy for anon users (MVP: frontend is password-protected)
CREATE POLICY "Allow public insert for MVP" 
ON public.access_keys 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);