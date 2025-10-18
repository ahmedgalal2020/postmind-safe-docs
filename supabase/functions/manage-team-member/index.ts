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

    const { action, team_id, member_id, new_role } = await req.json();

    // Check if user is team admin
    const { data: membership } = await supabaseClient
      .from("team_members")
      .select("role")
      .eq("team_id", team_id)
      .eq("user_id", user.id)
      .single();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      throw new Error("Only team admins can manage members");
    }

    if (action === "remove") {
      // Cannot remove owner
      const { data: targetMember } = await supabaseClient
        .from("team_members")
        .select("role, user_id")
        .eq("id", member_id)
        .single();

      if (targetMember?.role === "owner") {
        throw new Error("Cannot remove team owner");
      }

      const { error: removeError } = await supabaseClient
        .from("team_members")
        .delete()
        .eq("id", member_id)
        .eq("team_id", team_id);

      if (removeError) throw removeError;

      return new Response(
        JSON.stringify({ success: true, message: "Member removed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "update_role") {
      // Cannot change owner role
      const { data: targetMember } = await supabaseClient
        .from("team_members")
        .select("role")
        .eq("id", member_id)
        .single();

      if (targetMember?.role === "owner") {
        throw new Error("Cannot change owner role");
      }

      const { error: updateError } = await supabaseClient
        .from("team_members")
        .update({ role: new_role })
        .eq("id", member_id)
        .eq("team_id", team_id);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({ success: true, message: "Role updated" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action");
  } catch (error) {
    console.error("Error managing team member:", error);
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