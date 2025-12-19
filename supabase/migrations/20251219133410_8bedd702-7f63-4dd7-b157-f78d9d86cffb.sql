-- Add first_login_date field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_login_date timestamp with time zone DEFAULT NULL;

-- Add flags to track if welcome and location popups have been shown (tied to user account, not device)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS welcome_popup_shown boolean DEFAULT false;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location_popup_shown boolean DEFAULT false;