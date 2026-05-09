/**
 * Centralized Sentry init. Each app calls this once at boot.
 *
 * The Sentry SDK is intentionally NOT a hard dependency of this package —
 * it's optional, and apps that don't ship Sentry can call the init function
 * harmlessly (it no-ops if SENTRY_DSN is unset). Each app declares its own
 * @sentry/* dep so we can pin per-runtime (Next.js Edge / Node / browser)
 * without bloating the shared package.
 *
 * Hard rules (DESIGN §6.6, §12):
 *   - PHI scrubbed before send (beforeSend hook).
 *   - tracing PII off (sendDefaultPii: false).
 *   - environment / release tags so on-call can filter quickly.
 */

import { scrubValue } from "./scrub.js";

export interface SentryInitOptions {
  dsn?: string;
  environment?: string;
  release?: string;
  /**
   * The actual Sentry init function from the host's chosen package
   * (@sentry/nextjs, @sentry/node, @sentry/browser, etc). Pass it in so
   * this package doesn't need to take a dep on every Sentry runtime.
   */
  init: (opts: Record<string, unknown>) => void;
}

export function initSentry(opts: SentryInitOptions): void {
  if (!opts.dsn) return; // dev / preview environments may opt out
  opts.init({
    dsn: opts.dsn,
    environment: opts.environment ?? process.env.NODE_ENV ?? "development",
    release: opts.release ?? process.env.GIT_SHA,
    sendDefaultPii: false,
    tracesSampleRate: 0.05,
    beforeSend(event: Record<string, unknown>) {
      return scrubValue(event) as Record<string, unknown>;
    },
    beforeBreadcrumb(crumb: Record<string, unknown>) {
      return scrubValue(crumb) as Record<string, unknown>;
    },
  });
}
