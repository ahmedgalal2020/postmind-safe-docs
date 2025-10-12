-- Fix function search path security issue
-- Drop trigger first
DROP TRIGGER IF EXISTS update_users_app_updated_at ON public.users_app;

-- Drop and recreate function with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_users_app_updated_at
  BEFORE UPDATE ON public.users_app
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();