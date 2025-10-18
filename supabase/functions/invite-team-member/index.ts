import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { team_id, email, role } = await req.json();

    // Check if user is team admin
    const { data: membership } = await supabaseClient
      .from("team_members")
      .select("role")
      .eq("team_id", team_id)
      .eq("user_id", user.id)
      .single();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      throw new Error("Only team admins can invite members");
    }

    // Check if user is on Business plan
    const { data: userApp } = await supabaseClient
      .from("users_app")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (userApp?.plan !== "business" && userApp?.plan !== "enterprise") {
      throw new Error("Team features require Business plan");
    }

    // Generate invitation token
    const token_value = crypto.randomUUID();

    // Create invitation
    const { data: invitation, error: inviteError } = await supabaseClient
      .from("team_invitations")
      .insert({
        team_id,
        email,
        role: role || "member",
        invited_by: user.id,
        token: token_value,
      })
      .select()
      .single();

    if (inviteError) throw inviteError;

    // TODO: Send invitation email via Resend
    console.log(`Invitation created for ${email} with token ${token_value}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        invitation,
        invite_url: `${req.headers.get("origin")}/team/accept-invite?token=${token_value}`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error inviting team member:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});