-- Create marketplace_notifications table for email collection
CREATE TABLE IF NOT EXISTS public.marketplace_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to insert their own notification
CREATE POLICY "Users can insert their own notification request"
ON public.marketplace_notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for viewing own notifications
CREATE POLICY "Users can view their own notification requests"
ON public.marketplace_notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_marketplace_notifications_user_id ON public.marketplace_notifications(user_id);
CREATE INDEX idx_marketplace_notifications_created_at ON public.marketplace_notifications(created_at);