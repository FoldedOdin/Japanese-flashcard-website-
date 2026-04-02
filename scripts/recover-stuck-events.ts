import { Redis } from "@upstash/redis";
import "dotenv/config";

// Script to recover stuck events in processing queue
// Run with: npx tsx scripts/recover-stuck-events.ts

const PROCESSING_TIMEOUT_MS = 60_000;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

async function main() {
  console.log("Analyzing processing queue for stuck events...");
  
  const items = await redis.lrange("event_queue_processing", 0, -1);
  if (!items || items.length === 0) {
    console.log("Processing queue is empty. No stuck events.");
    return;
  }

  let recoveredCount = 0;
  const pipeline = redis.pipeline();

  for (const raw of items) {
    let event;
    try {
      event = typeof raw === 'string' ? JSON.parse(raw) : raw;
      
      // If event doesn't have a started_at or it's older than timeout
      const startedAt = event.processing_started_at || 0;
      if (Date.now() - startedAt > PROCESSING_TIMEOUT_MS) {
         // Move back to main queue
         pipeline.lrem("event_queue_processing", 1, typeof raw === 'string' ? raw : JSON.stringify(raw));
         
         // Remove processing start time for clean requeue
         delete event.processing_started_at;
         pipeline.lpush("event_queue", JSON.stringify(event));
         recoveredCount++;
      }
    } catch (_error) {
      console.error("Failed to parse event in processing queue:", raw);
    }
  }

  if (recoveredCount > 0) {
    await pipeline.exec();
    console.log(`Successfully recovered ${recoveredCount} stuck events.`);
  } else {
    console.log("No events exceeded the processing timeout.");
  }
}

main().catch(console.error);
