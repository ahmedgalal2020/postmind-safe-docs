import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Starting AI extraction (EU mode)');

    // Call Lovable AI with EU-compatible Gemini model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that extracts structured data from German business letters. Extract the following fields: sender name and type (government/company/private), letter type (Invoice/Mahnung/Gericht/Termin/Werbung/Contract/Info), subject, summary, key points, dates in YYYY-MM-DD format, due date, actions needed, risk level (high/medium/low), and relevant tags. Respond only with valid JSON.',
          },
          {
            role: 'user',
            content: `Extract structured data from this letter text:\n\n${text}`,
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_letter_data',
              description: 'Extract structured data from a business letter',
              parameters: {
                type: 'object',
                properties: {
                  sender: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      type: { type: 'string', enum: ['government', 'company', 'private'] },
                    },
                    required: ['name', 'type'],
                  },
                  letter_type: {
                    type: 'string',
                    enum: ['Invoice', 'Mahnung', 'Gericht', 'Termin', 'Werbung', 'Contract', 'Info'],
                  },
                  subject: { type: 'string' },
                  summary: { type: 'string' },
                  key_points: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  detected_dates: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  due_date: { type: 'string', nullable: true },
                  actions: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  risk_level: {
                    type: 'string',
                    enum: ['high', 'medium', 'low'],
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                required: ['sender', 'letter_type', 'subject', 'summary', 'risk_level'],
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'extract_letter_data' } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const extraction = JSON.parse(toolCall.function.arguments);

    console.log('Extraction complete');

    return new Response(
      JSON.stringify({ extraction }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Extract letter error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
