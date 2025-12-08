-- Add unique constraint on email in marketplace_notifications
ALTER TABLE public.marketplace_notifications 
ADD CONSTRAINT marketplace_notifications_email_unique UNIQUE (email);