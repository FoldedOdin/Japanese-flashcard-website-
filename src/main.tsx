import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';
import App from './App.tsx';
import './index.css';

// Initialize PostHog for Product Analytics
const phKey = import.meta.env.VITE_POSTHOG_KEY;
if (phKey && phKey !== 'phc_placeholder') {
  posthog.init(phKey, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        posthog.opt_out_capturing(); // Don't track locally by default
      }
    }
  });
} else {
  // Completely mock PostHog if the placeholder key is used to prevent 401s and 404s
  posthog.init = () => undefined as any;
  posthog.capture = () => undefined as any;
  posthog.identify = () => undefined as any;
  posthog.opt_out_capturing = () => undefined as any;
  posthog.reset = () => undefined as any;
}

// Initialize Sentry for Deep Observability & Performance Tracing
if (import.meta.env.VITE_ENABLE_SENTRY === 'true' || import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || "https://placeholder@o0.ingest.sentry.io/0",
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions (reduce in scale)
    release: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA, // Track versions tied to source tags
    tracePropagationTargets: ["localhost", /^\/api/],
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div className="p-8 text-center text-xl text-red-500">Something went wrong. An error report has been sent to our team.</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
