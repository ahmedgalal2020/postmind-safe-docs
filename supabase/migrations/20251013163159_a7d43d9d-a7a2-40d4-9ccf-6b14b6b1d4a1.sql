-- Add new columns to letters table for AI extraction
ALTER TABLE public.letters ADD COLUMN raw_text_enc TEXT;
ALTER TABLE public.letters ADD COLUMN summary_enc TEXT;
ALTER TABLE public.letters ADD COLUMN sender_enc TEXT;
ALTER TABLE public.letters ADD COLUMN tags_enc TEXT;
ALTER TABLE public.letters ADD COLUMN letter_type TEXT;
ALTER TABLE public.letters ADD COLUMN risk_level TEXT;
ALTER TABLE public.letters ADD COLUMN due_date DATE;
ALTER TABLE public.letters ADD COLUMN priority_int INTEGER DEFAULT 0;
ALTER TABLE public.letters ADD COLUMN sender_name TEXT;
ALTER TABLE public.letters ADD COLUMN subject TEXT;

-- Create rules table for priority scoring
CREATE TABLE public.rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  weight_int INTEGER NOT NULL DEFAULT 0,
  severity_int INTEGER NOT NULL DEFAULT 0,
  tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rules
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rules
CREATE POLICY "Users can view their own rules"
  ON public.rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rules"
  ON public.rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rules"
  ON public.rules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rules"
  ON public.rules FOR DELETE
  USING (auth.uid() = user_id);

-- Add AI consent settings to users_app
ALTER TABLE public.users_app ADD COLUMN ai_consent BOOLEAN DEFAULT false;
ALTER TABLE public.users_app ADD COLUMN ai_mode TEXT DEFAULT 'local';

-- Seed default priority rules for existing users
INSERT INTO public.rules (user_id, keyword, weight_int, severity_int, tag)
SELECT 
  id,
  unnest(ARRAY['Frist', 'Mahnung', 'Gericht', 'Finanzamt', 'Krankenkasse', 'Zahlung', 'Termin', 'Eilig']),
  unnest(ARRAY[7, 8, 10, 6, 5, 5, 6, 8]),
  unnest(ARRAY[7, 8, 10, 6, 5, 5, 6, 8]),
  unnest(ARRAY['deadline', 'payment', 'legal', 'tax', 'health', 'payment', 'appointment', 'urgent'])
FROM auth.users;