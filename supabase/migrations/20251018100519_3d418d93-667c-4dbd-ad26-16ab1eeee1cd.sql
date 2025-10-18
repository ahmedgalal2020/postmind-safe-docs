-- Create enum for team member roles
CREATE TYPE public.team_role AS ENUM ('owner', 'admin', 'member');

-- Create enum for invitation status
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.team_role NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create team_invitations table
CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.team_role NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token TEXT NOT NULL UNIQUE,
  status public.invitation_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

-- Add assigned_to column to letters table for team member assignment
ALTER TABLE public.letters ADD COLUMN assigned_to UUID REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is team owner or admin
CREATE OR REPLACE FUNCTION public.is_team_admin(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members
    WHERE team_id = _team_id
      AND user_id = _user_id
      AND role IN ('owner', 'admin')
  )
$$;

-- Helper function to check if user is team member
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members
    WHERE team_id = _team_id
      AND user_id = _user_id
  )
$$;

-- RLS Policies for teams
CREATE POLICY "Users can view teams they are members of"
  ON public.teams FOR SELECT
  USING (public.is_team_member(auth.uid(), id));

CREATE POLICY "Users can create their own teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Team admins can update teams"
  ON public.teams FOR UPDATE
  USING (public.is_team_admin(auth.uid(), id));

CREATE POLICY "Team owners can delete teams"
  ON public.teams FOR DELETE
  USING (auth.uid() = owner_user_id);

-- RLS Policies for team_members
CREATE POLICY "Team members can view other members"
  ON public.team_members FOR SELECT
  USING (public.is_team_member(auth.uid(), team_id));

CREATE POLICY "Team admins can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (public.is_team_admin(auth.uid(), team_id));

CREATE POLICY "Team admins can update member roles"
  ON public.team_members FOR UPDATE
  USING (public.is_team_admin(auth.uid(), team_id));

CREATE POLICY "Team admins can remove members"
  ON public.team_members FOR DELETE
  USING (public.is_team_admin(auth.uid(), team_id));

-- RLS Policies for team_invitations
CREATE POLICY "Team members can view invitations"
  ON public.team_invitations FOR SELECT
  USING (public.is_team_member(auth.uid(), team_id) OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Team admins can create invitations"
  ON public.team_invitations FOR INSERT
  WITH CHECK (public.is_team_admin(auth.uid(), team_id));

CREATE POLICY "Team admins can update invitations"
  ON public.team_invitations FOR UPDATE
  USING (public.is_team_admin(auth.uid(), team_id));

CREATE POLICY "Team admins can delete invitations"
  ON public.team_invitations FOR DELETE
  USING (public.is_team_admin(auth.uid(), team_id));

-- Update letters RLS to support team access
DROP POLICY IF EXISTS "Users can view their own letters" ON public.letters;
CREATE POLICY "Users can view their own letters or team letters"
  ON public.letters FOR SELECT
  USING (
    auth.uid() = user_id 
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.team_members tm
      JOIN public.users_app ua ON ua.id = letters.user_id
      WHERE tm.user_id = auth.uid()
        AND tm.team_id IN (
          SELECT team_id FROM public.team_members WHERE user_id = letters.user_id
        )
        AND tm.role IN ('owner', 'admin')
    )
  );

-- Trigger for teams updated_at
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_invitations_team_id ON public.team_invitations(team_id);
CREATE INDEX idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX idx_team_invitations_token ON public.team_invitations(token);
CREATE INDEX idx_letters_assigned_to ON public.letters(assigned_to);