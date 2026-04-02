import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { Redis } from "https://deno.land/x/upstash_redis@v1.22.0/mod.ts";
import { Ratelimit } from "https://deno.land/x/upstash_ratelimit@v1.2.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as Sentry from "https://deno.land/x/sentry@8.47.0/index.ts";

Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN") || "",
  tracesSampleRate: 1.0,
});

// Global Cache connection to reduce cold starts
let redisClient: Redis | null = null;
const getRedis = () => {
  if (!redisClient) {
    redisClient = new Redis({
      url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
      token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
    });
  }
  return redisClient;
};

// Rate limiter lazily loaded
let ratelimitCache: Ratelimit | null = null;
const getRateLimiter = () => {
    if (!ratelimitCache) {
      ratelimitCache = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(50, "10 s"),
        analytics: true,
     });
    }
    return ratelimitCache;
};

let supabaseClient: any = null;
const getSupabase = () => {
    if (!supabaseClient) {
        supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            { auth: { persistSession: false } }
        );
    }
    return supabaseClient;
};

const EventSchema = z.object({
  version: z.number().default(1),
  id: z.string().uuid(),
  type: z.enum(["ANSWER_SUBMITTED", "SESSION_COMPLETED"]),
  payload: z.any(),
  createdAt: z.number(),
  retryCount: z.number(),
});

const RequestSchema = z.object({
  events: z.array(EventSchema),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const authHeader = req.headers.get('Authorization')!;
  const token = authHeader.replace('Bearer ', '');
  const supabase = getSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const userId = user.id;

  const ip = req.headers.get("x-forwarded-for") || "unknown";

  const redis = getRedis();
  const ratelimit = getRateLimiter();

  // Load Shedding: Backpressure
  const queueDepth = await redis.llen("event_queue");
  if (queueDepth > 10000) {
    return new Response(JSON.stringify({ status: "degraded", retryAfter: 5000 }), {
       status: 429,
       headers: { "Retry-After": "5" }
    });
  }

  // Payload Limits
  const rawBody = await req.text();
  if (rawBody.length > 20000) { // Limit entire request to 20kB to prevent memory pressure
    return new Response(JSON.stringify({ error: "Event payload too large" }), { status: 413 });
  }

  // Rate Limiting
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 });
  }

  try {
    const { events } = RequestSchema.parse(JSON.parse(rawBody));
    const validEvents = [];

    // Idempotency & Anti-Replay
    for (const event of events) {
      // Replay Attack Protection: Reject if older than 5 minutes (300,000ms)
      if (Date.now() - event.createdAt > 300000) {
        continue;
      }

      // Check Nonce + Idempotency logic via UUID presence scoped by User
      const isProcessed = await redis.get(`processed:${userId}:${event.id}`);
      if (isProcessed) {
        continue;
      }

      validEvents.push(event);
    }

    if (validEvents.length > 0) {
      // 1. Mark as processed in Redis (idempotency key / nonce) storing for just the replay threshold (300s) + safety
      const pipeline = redis.pipeline();
      for (const event of validEvents) {
        pipeline.setex(`processed:${userId}:${event.id}`, 600, "1"); // Keep cache for 10 min
        
        // 2. Queue event to PgMQ or Redis Queue for async worker (ensure user_id is injected safely)
        pipeline.lpush("event_queue", JSON.stringify({ ...event, userId }));
      }
      await pipeline.exec();
    }

    return new Response(JSON.stringify({ synced: validEvents.length, duplicate: events.length - validEvents.length }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 200,
    });

  } catch (error) {
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      status: 400,
    });
  }
});
