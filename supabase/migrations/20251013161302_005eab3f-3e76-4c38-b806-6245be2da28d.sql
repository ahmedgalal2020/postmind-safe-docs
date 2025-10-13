-- Create batches table
CREATE TABLE public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zip_url TEXT,
  files_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create letters table
CREATE TABLE public.letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage_counters table
CREATE TABLE public.usage_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_month TEXT NOT NULL,
  uploaded_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, period_month)
);

-- Enable RLS
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for batches
CREATE POLICY "Users can view their own batches"
  ON public.batches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own batches"
  ON public.batches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own batches"
  ON public.batches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own batches"
  ON public.batches FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for letters
CREATE POLICY "Users can view their own letters"
  ON public.letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own letters"
  ON public.letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own letters"
  ON public.letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own letters"
  ON public.letters FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for usage_counters
CREATE POLICY "Users can view their own usage"
  ON public.usage_counters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own usage"
  ON public.usage_counters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON public.usage_counters FOR UPDATE
  USING (auth.uid() = user_id);

-- Create storage bucket for encrypted letters
INSERT INTO storage.buckets (id, name, public) 
VALUES ('letters', 'letters', false);

-- Storage RLS policies
CREATE POLICY "Users can view their own encrypted files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'letters' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own encrypted files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'letters' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own encrypted files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'letters' AND auth.uid()::text = (storage.foldername(name))[1]);