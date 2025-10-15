-- Add subscription fields to users_app table
ALTER TABLE public.users_app
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS files_uploaded_this_month INT DEFAULT 0;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_users_app_stripe_customer_id ON public.users_app(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_app_subscription_status ON public.users_app(subscription_status);