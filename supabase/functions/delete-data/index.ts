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

    console.log("Deleting all data for user:", user.id);

    // Delete from storage bucket (all files)
    const { data: files } = await supabaseClient.storage
      .from("letters")
      .list(user.id);

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${user.id}/${file.name}`);
      await supabaseClient.storage
        .from("letters")
        .remove(filePaths);
      console.log(`Deleted ${filePaths.length} files from storage`);
    }

    // Delete letters (cascades will handle related data)
    const { error: lettersError } = await supabaseClient
      .from("letters")
      .delete()
      .eq("user_id", user.id);
    
    if (lettersError) console.error("Error deleting letters:", lettersError);

    // Delete batches
    const { error: batchesError } = await supabaseClient
      .from("batches")
      .delete()
      .eq("user_id", user.id);
    
    if (batchesError) console.error("Error deleting batches:", batchesError);

    // Delete rules
    const { error: rulesError } = await supabaseClient
      .from("rules")
      .delete()
      .eq("user_id", user.id);
    
    if (rulesError) console.error("Error deleting rules:", rulesError);

    // Delete events
    const { error: eventsError } = await supabaseClient
      .from("events")
      .delete()
      .eq("user_id", user.id);
    
    if (eventsError) console.error("Error deleting events:", eventsError);

    // Delete usage counters
    const { error: usageError } = await supabaseClient
      .from("usage_counters")
      .delete()
      .eq("user_id", user.id);
    
    if (usageError) console.error("Error deleting usage counters:", usageError);

    // Delete user profile (but not auth.users - that requires admin API)
    const { error: profileError } = await supabaseClient
      .from("users_app")
      .delete()
      .eq("id", user.id);
    
    if (profileError) console.error("Error deleting profile:", profileError);

    console.log("Data deletion complete for user:", user.id);

    return new Response(JSON.stringify({
      success: true,
      message: "All company data has been securely deleted"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("ERROR in delete-data:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
