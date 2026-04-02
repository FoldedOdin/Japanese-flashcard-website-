# NihonGO Service Level Objectives (SLOs)

As the application moves to a production-ready enterprise-grade architecture, the following Service Level Objectives (SLOs) define our operational reliability and guide when incident response teams must be paged.

| Component                   | Service Level Indicator (SLI)                                                                       | Service Level Objective (SLO)                      | Consequence of Breach (Error Budget Burn)                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Edge API Layer / Sync**   | Total p95 Latency of `sync-progress` edge function (inclusive of Redis queueing and rate limits).   | **< 200 ms** per batch                             | Auto-scaling worker limits evaluated, fallback to pure offline caching heavily prioritized. |
| **Worker Queue Processing** | Queue Processing Latency: Time difference between `event.createdAt` and successful Postgres commit. | **< 2 seconds** for 99% of events                  | Triggers alert to scale `process-queue` worker batch-sizes and instance counts.             |
| **Event Reliability**       | Success Rate: Percentage of events successfully processed vs. pushed to Dead Letter Queue (DLQ).    | **99.9%** (1 in 1000 failures allowed)             | Immediate PagerDuty escalation; implies a schema mutation or Postgres rejection bug.        |
| **DLQ Volume**              | Total events accumulating in `event_queue_dlq`.                                                     | **< 0.1%** of daily volume, hard cap at 100 items. | Webhook triggered to Slack for manual run of `scripts/replay-dlq.ts` and investigation.     |
| **Client Core Metrics**     | Application Load Time (LCP - Largest Contentful Paint).                                             | **< 1.5 seconds**                                  | Next.js/Vite bundle analysis required; stop new feature merge until resolved.               |

## Incident Response Guide

1. **If Queue Depth > 10,000**:
   - The system is experiencing a Thundering Herd (likely coming from offline clients successfully connecting simultaneously).
   - Our **Load Shedding** logic will return a `429: Retry-After`. Clients will respect the retry header and apply Jitter. _Monitor only._

2. **If DLQ starts filling up rapidly**:
   - Events are failing consistently inside Postgres (`ON CONFLICT` is catching duplicates safely, so this indicates malformed data constraints).
   - **Action**: Pause worker processing temporarily if possible. Inspect DLQ payloads in Upstash Redis, deploy patch, run `npx tsx scripts/replay-dlq.ts`.

3. **If Redis spikes in Memory**:
   - Too many replay nonces (`processed:${userId}:${key}`) or an unbounded queue limit on the clients.
   - **Action**: Check if the client unbounded 1000 item slice limit is functioning. Ensure the Edge functionality is shedding loads larger than 20KB.
