import { Redis } from "@upstash/redis";

// Script to replay Dead Letter Queue events
// Run with: npx tsx scripts/replay-dlq.ts

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

async function main() {
  console.log("Fetching DLQ events...");
  
  // Get all events from the DLQ
  const dlqEvents = await redis.lrange("event_queue_dlq", 0, -1);
  
  if (!dlqEvents || dlqEvents.length === 0) {
    console.log("DLQ is empty. Nothing to replay.");
    return;
  }

  console.log(`Found ${dlqEvents.length} events in DLQ. Replaying...`);
  
  const pipeline = redis.pipeline();
  
  for (const rawEvent of dlqEvents) {
    let eventObj;
    try {
      eventObj = typeof rawEvent === 'string' ? JSON.parse(rawEvent) : rawEvent;
      
      // Reset retry count
      eventObj.retryCount = 0;
      // Optionally strip DLQ specific reasons so it's clean for the worker
      delete eventObj.dlq_reason;
      delete eventObj.failed_at;
      
      pipeline.lpush("event_queue", JSON.stringify(eventObj));
    } catch (e) {
      console.error("Failed to parse DLQ event:", rawEvent, e);
    }
  }

  // Execute the requeue
  await pipeline.exec();
  
  // Clear the DLQ after successful requeue
  await redis.del("event_queue_dlq");
  
  console.log(`Successfully replayed ${dlqEvents.length} events back into the main queue.`);
}

main().catch(console.error);
