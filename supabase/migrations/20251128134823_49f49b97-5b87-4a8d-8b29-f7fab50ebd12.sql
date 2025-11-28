-- Drop the existing update policy
DROP POLICY IF EXISTS "Only admins can update certificates" ON public.certificates;

-- Recreate with both USING and WITH CHECK clauses
CREATE POLICY "Only admins can update certificates" 
ON public.certificates 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));