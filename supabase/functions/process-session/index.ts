import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const { session, characterUpdates } = await req.json();

    if (!session || !session.id) {
       return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: corsHeaders });
    }

    // Anti-bot check: Cannot answer faster than 0.5s per question
    if (session.totalQuestions > 0 && session.durationSec > 0) {
      if (session.durationSec / session.totalQuestions < 0.5) {
        return new Response(JSON.stringify({ error: "Suspicious activity detected" }), { status: 403, headers: corsHeaders });
      }
    }

    // Initialize Supabase clients
    const supabaseClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });
    
    // Service role for privileged updates (User shouldn't write their own XP/Streaks directly)
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const userId = user.id;

    // 1. Process character updates safely
    if (characterUpdates && characterUpdates.length > 0) {
      const charRows = characterUpdates.map((c: any) => ({ ...c, user_id: userId }));
      await supabaseClient.from('character_progress')
        .upsert(charRows, { onConflict: 'user_id,character_id' });
    }

    // 2. Insert Study Session securely
    await supabaseClient.from('study_sessions').insert({
      id: session.id,
      user_id: userId,
      mode: session.mode,
      started_at: session.startedAt,
      ended_at: session.endedAt,
      total_questions: session.totalQuestions,
      correct: session.correctAnswers,
      accuracy: session.accuracy,
      duration_sec: session.durationSec
    });

    // 3. Server-side Streak Calculation
    const { data: progress } = await supabaseAdmin.from('user_progress')
      .select('*').eq('user_id', userId).maybeSingle();

    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = progress?.last_study_date;

    let currentStreak = progress?.current_streak || 0;
    
    if (!lastDate) {
      currentStreak = 1;
    } else if (lastDate !== todayStr) {
      const last = new Date(lastDate);
      const current = new Date(todayStr);
      const diff = current.getTime() - last.getTime();
      const isYesterday = diff >= 24 * 60 * 60 * 1000 && diff < 2 * 24 * 60 * 60 * 1000;
      
      if (isYesterday) {
        currentStreak += 1;
      } else {
        currentStreak = 1; // Streak broken
      }
    }
    
    const bestStreak = Math.max(progress?.best_streak || 0, currentStreak);
    const newTotalSeen = (progress?.total_seen || 0) + session.totalQuestions;
    const newTotalCorrect = (progress?.total_correct || 0) + session.correctAnswers;
    const newScore = newTotalCorrect * 10;

    await supabaseAdmin.from('user_progress').upsert({
      user_id: userId,
      total_seen: newTotalSeen,
      total_correct: newTotalCorrect,
      score: newScore,
      current_streak: currentStreak,
      best_streak: bestStreak,
      last_study_date: todayStr,
      updated_at: new Date().toISOString()
    });

    // 4. Calculate XP and Level
    const xpGained = session.correctAnswers * 5 + Math.floor(session.durationSec / 10);
    const { data: gameProfile } = await supabaseAdmin.from('gamification_profiles')
      .select('*').eq('user_id', userId).maybeSingle();
      
    const currentXp = (gameProfile?.xp || 0) + xpGained;
    const newLevel = Math.floor(Math.sqrt(currentXp / 100)) + 1; // Simple progression curve
    
    await supabaseAdmin.from('gamification_profiles').upsert({
      user_id: userId,
      xp: currentXp,
      level: newLevel,
      updated_at: new Date().toISOString()
    });

    return new Response(JSON.stringify({ success: true, xpGained, currentStreak, bestStreak, newLevel }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
