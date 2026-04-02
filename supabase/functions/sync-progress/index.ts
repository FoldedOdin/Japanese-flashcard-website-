import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { Redis } from "https://deno.land/x/upstash_redis@v1.22.0/mod.ts";
import { Ratelimit } from "https://deno.land/x/upstash_ratelimit@v1.2.1/mod.ts";
import * as Sentry from "https://deno.land/x/sentry@8.47.0/index.ts";

Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN") || "",
  tracesSampleRate: 1.0,
});

const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "10 s"),
  analytics: true,
});

const EventSchema = z.object({
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
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // Rate Limiting
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 });
  }

  try {
    const { events } = RequestSchema.parse(await req.json());
    const validEvents = [];

    // Idempotency & Anti-Replay
    for (const event of events) {
      // Reject if too old (e.g., > 24 hours)
      if (Date.now() - event.createdAt > 86400000) {
        continue;
      }

      // Check if already processed
      const isProcessed = await redis.get(`processed:${event.id}`);
      if (isProcessed) {
        continue;
      }

      validEvents.push(event);
    }

    if (validEvents.length > 0) {
      // 1. Mark as processed in Redis (idempotency key)
      const pipeline = redis.pipeline();
      for (const event of validEvents) {
        pipeline.setex(`processed:${event.id}`, 86400, "1"); // Keep cache for 24h
        
        // 2. Queue event to PgMQ or Redis Queue for async worker
        pipeline.lpush("event_queue", JSON.stringify({ ...event, authHeader }));
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
