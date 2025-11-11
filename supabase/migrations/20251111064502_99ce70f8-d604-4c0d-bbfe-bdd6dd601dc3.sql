-- Create security definer functions to get user's city and area without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_city(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT city FROM public.profiles WHERE id = _user_id;
$$;

CREATE OR REPLACE FUNCTION public.get_user_area(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT area FROM public.profiles WHERE id = _user_id;
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view verified profiles based on match preference" ON public.profiles;

-- Recreate it using the security definer functions
CREATE POLICY "Users can view verified profiles based on match preference"
ON public.profiles
FOR SELECT
USING (
  verified_status = true 
  AND (
    (
      match_preference = 'Μόνο κοντινές μαμάδες'
      AND city = public.get_user_city(auth.uid())
      AND area = public.get_user_area(auth.uid())
    )
    OR match_preference = 'Από όλη την Ελλάδα'
  )
);