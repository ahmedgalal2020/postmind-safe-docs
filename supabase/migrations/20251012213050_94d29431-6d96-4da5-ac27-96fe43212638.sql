-- Create users_app table for company information
CREATE TABLE public.users_app (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  vat_id TEXT,
  address_street TEXT NOT NULL,
  address_zip TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  business_email TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'de',
  plan TEXT NOT NULL DEFAULT 'trial',
  trial_started_at TIMESTAMPTZ,
  trial_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users_app ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users_app
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.users_app
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users_app
  FOR UPDATE
  USING (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_app_updated_at
  BEFORE UPDATE ON public.users_app
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();