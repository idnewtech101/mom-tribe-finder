-- Add age_migration_done column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age_migration_done BOOLEAN DEFAULT false;

-- Comment explaining the column
COMMENT ON COLUMN public.profiles.age_migration_done IS 'Tracks whether the user has completed the child age format migration';