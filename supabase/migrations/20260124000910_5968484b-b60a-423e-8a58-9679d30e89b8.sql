-- Fix remaining "USING (true)" INSERT policies for user_activity and notifications
-- These are intentional for system inserts but should require auth

-- user_activity: Tighten to require authenticated user matches user_id
DROP POLICY IF EXISTS "System can insert user activity" ON public.user_activity;
CREATE POLICY "Authenticated users can insert their own activity"
ON public.user_activity
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- notifications: Keep system insert but restrict to authenticated
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- poll_votes: Restrict SELECT to authenticated users only (hide from public)
DROP POLICY IF EXISTS "Users can view all poll votes" ON public.poll_votes;
CREATE POLICY "Authenticated users can view poll votes"
ON public.poll_votes
FOR SELECT
TO authenticated
USING (true);

-- question_reactions: Restrict SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can view reactions" ON public.question_reactions;
CREATE POLICY "Authenticated users can view reactions"
ON public.question_reactions
FOR SELECT
TO authenticated
USING (true);

-- recipe_reviews: Restrict SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.recipe_reviews;
CREATE POLICY "Authenticated users can view reviews"
ON public.recipe_reviews
FOR SELECT
TO authenticated
USING (true);