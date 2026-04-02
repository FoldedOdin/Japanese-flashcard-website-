import posthog from 'posthog-js';
import { z } from 'zod';

// Governed Event Schemas
export const CardAnsweredSchema = z.object({
  characterId: z.string(),
  difficulty: z.enum(["easy", "good", "hard"]),
  grade: z.number().min(1).max(5),
  scriptType: z.enum(["hiragana", "katakana"]),
  response_time_ms: z.number().optional(), // if we had it
});
export type CardAnsweredEvent = z.infer<typeof CardAnsweredSchema>;

export const SessionStartedSchema = z.object({
  due_count: z.number(),
  new_count: z.number(),
});
export type SessionStartedEvent = z.infer<typeof SessionStartedSchema>;

export const SessionCompletedSchema = z.object({
  accuracy: z.number(),
  cards_reviewed: z.number(),
});
export type SessionCompletedEvent = z.infer<typeof SessionCompletedSchema>;

// Queue Metrics Schema
export const QueueMetricsSchema = z.object({
  queue_depth: z.number(),
  processing_time_ms: z.number().optional(),
});
export type QueueMetricsEvent = z.infer<typeof QueueMetricsSchema>;

export const Analytics = {
  trackCardAnswered: (props: CardAnsweredEvent) => {
    const validated = CardAnsweredSchema.parse(props);
    posthog.capture("card_answered", validated);
  },
  trackSessionStarted: (props: SessionStartedEvent) => {
    const validated = SessionStartedSchema.parse(props);
    posthog.capture("session_started", validated);
  },
  trackSessionCompleted: (props: SessionCompletedEvent) => {
    const validated = SessionCompletedSchema.parse(props);
    posthog.capture("session_completed", validated);
  },
  trackQueueMetrics: (props: QueueMetricsEvent) => {
    const validated = QueueMetricsSchema.parse(props);
    posthog.capture("queue_metrics", validated);
  }
};
