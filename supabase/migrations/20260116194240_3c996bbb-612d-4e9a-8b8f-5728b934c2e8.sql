-- Create silent_hugs table for anonymous hug requests
CREATE TABLE public.silent_hugs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city TEXT,
  country TEXT DEFAULT 'Greece',
  hugs_received INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour')
);

-- Create silent_hug_responses table for anonymous responses
CREATE TABLE public.silent_hug_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hug_request_id UUID NOT NULL REFERENCES public.silent_hugs(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hug_request_id, responder_id)
);

-- Enable RLS
ALTER TABLE public.silent_hugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.silent_hug_responses ENABLE ROW LEVEL SECURITY;

-- Policies for silent_hugs
CREATE POLICY "Users can create their own hug requests"
  ON public.silent_hugs FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can view their own hug requests"
  ON public.silent_hugs FOR SELECT
  USING (auth.uid() = requester_id);

-- Policies for silent_hug_responses
CREATE POLICY "Users can send hug responses"
  ON public.silent_hug_responses FOR INSERT
  WITH CHECK (auth.uid() = responder_id);

CREATE POLICY "Users can view responses to their hug requests"
  ON public.silent_hug_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.silent_hugs 
      WHERE id = hug_request_id AND requester_id = auth.uid()
    )
    OR auth.uid() = responder_id
  );

-- Function to increment hug count
CREATE OR REPLACE FUNCTION public.increment_hug_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.silent_hugs
  SET hugs_received = hugs_received + 1
  WHERE id = NEW.hug_request_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-increment hugs
CREATE TRIGGER on_hug_response_increment
  AFTER INSERT ON public.silent_hug_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_hug_count();

-- Enable realtime for silent_hugs
ALTER PUBLICATION supabase_realtime ADD TABLE public.silent_hugs;