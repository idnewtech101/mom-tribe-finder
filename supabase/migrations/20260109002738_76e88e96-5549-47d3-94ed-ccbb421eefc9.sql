-- Add prioritize_lifestyle column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS prioritize_lifestyle BOOLEAN DEFAULT false;