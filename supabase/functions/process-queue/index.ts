import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Redis } from "https://deno.land/x/upstash_redis@v1.22.0/mod.ts";
import * as Sentry from "https://deno.land/x/sentry@8.47.0/index.ts";

Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN") || "",
  tracesSampleRate: 1.0,
});

// Cache connections globally to reduce cold start latency
let redisClient: Redis | null = null;
let supabaseClient: any = null;

const getRedis = () => {
    if (!redisClient) {
        redisClient = new Redis({
            url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
            token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
        });
    }
    return redisClient;
};

const getSupabase = () => {
    if (!supabaseClient) {
        supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
            { auth: { persistSession: false } }
        );
    }
    return supabaseClient;
};

const MAX_RETRIES = 3;
const BATCH_SIZE = 50;

serve(async (_req) => {
    const redis = getRedis();
    const supabase = getSupabase();

    try {
        let processedCount = 0;
        let dlqCount = 0;

        const startMark = Date.now();

        for (let i = 0; i < BATCH_SIZE; i++) {
            // Atomic pop to processing queue
            const rawEvent = await redis.rpoplpush("event_queue", "event_queue_processing");
            if (!rawEvent) break; // Queue empty

            const event = typeof rawEvent === 'string' ? JSON.parse(rawEvent) : rawEvent;

            try {
                // Idempotency: Enforce DB constraints (ON CONFLICT DO NOTHING equivalent logic)
                const { error } = await supabase.from('progress_events').insert({
                    idempotency_key: event.id,
                    user_id: event.userId, // Requires extracting userId from JWT or Auth headers if available
                    event_type: event.type,
                    payload: event.payload
                });

                if (error && error.code !== '23505') { // 23505 is Unique Violation (already processed)
                    throw error;
                }

                // If no error or unique violation, it's successfully "processed"
                processedCount++;
                // Clean up from processing queue
                await redis.lrem("event_queue_processing", 1, rawEvent);
            } catch (err) {
                Sentry.captureException(err);
                const retries = (event.retryCount || 0) + 1;
                
                if (retries > MAX_RETRIES) {
                    // Dead Letter Queue
                    const dlqReason = err instanceof Error ? err.message : String(err);
                    await redis.lpush("event_queue_dlq", JSON.stringify({ 
                        ...event, 
                        error: dlqReason,
                        failed_at: new Date().toISOString(),
                        dlq_reason: "Max retries exceeded" 
                    }));
                    dlqCount++;
                    // Remove from processing
                    await redis.lrem("event_queue_processing", 1, rawEvent);
                } else {
                    // Requeue
                    await redis.lpush("event_queue", JSON.stringify({ ...event, retryCount: retries }));
                    // Remove from processing
                    await redis.lrem("event_queue_processing", 1, rawEvent);
                }
            }
        }

        const queueLength = await redis.llen("event_queue");
        const processingTime = Date.now() - startMark;
        
        // Push Metrics to PostHog manually or just a simple POST call, or log here 
        // to be captured by Log drains in Sentry/PostHog.
        try {
            await fetch(Deno.env.get("VITE_POSTHOG_HOST") + "/capture/", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                  api_key: Deno.env.get("VITE_POSTHOG_KEY"),
                  event: "worker_metrics",
                  properties: {
                    processing_time_ms: processingTime,
                    queue_depth: queueLength,
                    processed_count: processedCount,
                    dead_lettered: dlqCount
                  }
               })
            });
        } catch(_e) {
            // ignore telemetry failure
        }

        return new Response(JSON.stringify({ 
            processed: processedCount, 
            deadLettered: dlqCount, 
            queueDepthRemaining: queueLength 
        }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error: any) {
        Sentry.captureException(error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
});
