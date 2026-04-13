import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
  // Check CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // We evaluate the API key from the request body first

  try {
    const { weakCharacters, apiKey } = await req.json()
    
    const resolvedApiKey = apiKey || GROQ_API_KEY;
    if (!resolvedApiKey) {
      return new Response(JSON.stringify({ error: 'No API Key provided. Please add your Groq API key in Settings.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    
    const prompt = `You are a wise and slightly eccentric local resident of Kana City, a spatial memory palace for learning Japanese Hiragana. 
The traveler standing before you is currently struggling with these characters: ${weakCharacters}. 
Speak to them for 2-3 sentences. Give them a cryptic, stylized mini-story or piece of advice that heavily features or relates to the shape/sound of these characters to help them remember.
Do not break character. Do not say "Here is a memory story". Just speak directly to the traveler.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resolvedApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // or any Groq supported model like mixtral-8x7b-32768
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Groq API Error:', data);
      throw new Error('Failed to generate dialogue');
    }

    const dialogue = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ dialogue }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
