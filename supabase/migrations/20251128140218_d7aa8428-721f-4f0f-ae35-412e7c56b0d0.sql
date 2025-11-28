-- Add policy allowing admins to view ALL certificates (including inactive)
CREATE POLICY "Admins can view all certificates"
ON public.certificates
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));