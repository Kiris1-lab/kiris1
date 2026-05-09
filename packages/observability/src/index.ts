/**
 * @kiris/observability — telemetry helpers shared across every Kiris app.
 *
 * Hard rule (DESIGN §6.6): no PHI in telemetry. The scrubber here is the
 * last line of defense before events leave the process.
 */

export { initSentry, type SentryInitOptions } from "./sentry-init.js";
export { scrubString, scrubValue } from "./scrub.js";
