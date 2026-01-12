-- Create question_reactions table for the AskMoms reactions system
CREATE TABLE public.question_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('thanks', 'same', 'hug')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(question_id, user_id, reaction_type)
);

-- Enable RLS
ALTER TABLE public.question_reactions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view reactions"
  ON public.question_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add reactions"
  ON public.question_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions"
  ON public.question_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast queries
CREATE INDEX idx_question_reactions_question_id ON public.question_reactions(question_id);
CREATE INDEX idx_question_reactions_user_id ON public.question_reactions(user_id);