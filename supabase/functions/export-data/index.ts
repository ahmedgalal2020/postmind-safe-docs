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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    console.log("Exporting data for user:", user.id);

    // Fetch user profile
    const { data: profile } = await supabaseClient
      .from("users_app")
      .select("*")
      .eq("id", user.id)
      .single();

    // Fetch letters metadata (not encrypted content)
    const { data: letters } = await supabaseClient
      .from("letters")
      .select("id, filename, file_size, created_at, due_date, priority_int, sender_name, risk_level, letter_type, status")
      .eq("user_id", user.id);

    // Fetch batches
    const { data: batches } = await supabaseClient
      .from("batches")
      .select("*")
      .eq("user_id", user.id);

    // Fetch rules
    const { data: rules } = await supabaseClient
      .from("rules")
      .select("*")
      .eq("user_id", user.id);

    // Fetch events
    const { data: events } = await supabaseClient
      .from("events")
      .select("*")
      .eq("user_id", user.id);

    const exportData = {
      export_date: new Date().toISOString(),
      user_id: user.id,
      email: user.email,
      profile,
      letters: letters || [],
      batches: batches || [],
      rules: rules || [],
      events: events || [],
      note: "Encrypted file content is not included for security reasons. Download files individually from the dashboard."
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="postmind-data-export-${user.id}-${Date.now()}.json"`
      },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("ERROR in export-data:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
