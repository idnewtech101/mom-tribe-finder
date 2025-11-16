-- Add pseudonym field to questions table
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS pseudonym text;

-- Add pseudonym field to answers table
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS pseudonym text;