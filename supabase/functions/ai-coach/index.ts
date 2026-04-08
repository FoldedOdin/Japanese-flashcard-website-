import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY not set' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { action, character, weakCharacters } = await req.json()
    
    let prompt = '';

    if (action === 'mnemonic') {
      prompt = `You are a creative Japanese language teacher. 
Create a short, memorable, and vivid mnemonic story to help a student remember the Japanese Hiragana/Katakana character "${character}". 
Focus on the visual shape of the character and its pronunciation. Keep it under 3 sentences. Do not use pleasantries.`;
    } else if (action === 'weakness') {
      prompt = `You are an analytical Japanese language coach.
Your student is struggling the most with these characters: ${weakCharacters}.
Look at this list and identify any patterns (e.g., they struggle with 'S' row, or vowels, or similar-looking characters like 'ne' and 'wa').
Give them a 2-sentence encouraging summary of their struggle pattern and one tip on how to improve.`;
    } else {
      throw new Error('Invalid action');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Groq API Error:', data);
      throw new Error('Failed to generate AI response');
    }

    const result = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ result }), {
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
