# @kiris/observability

Shared telemetry helpers. PHI scrubber + Sentry init wrapper.

## Why a thin wrapper

Each Kiris app picks its own Sentry runtime (`@sentry/nextjs` for the web
apps, `@sentry/node` for the API). Rather than hard-pin Sentry as a
dependency of this package, apps pass their `Sentry.init` function in:

```ts
import * as Sentry from "@sentry/node";
import { initSentry } from "@kiris/observability";

initSentry({
  dsn: process.env.SENTRY_DSN,
  environment: "prod",
  release: process.env.GIT_SHA,
  init: Sentry.init,
});
```

That keeps the wiring uniform (PHI scrub, sample rate, default-PII off,
release tag) without forcing every app onto the same Sentry build.

## PHI scrubber for telemetry

`scrubValue` recursively walks any JSON-shaped object, scrubbing PHI-shaped
strings (MRN, SSN, DOB, phone, non-allowlisted email) and redacting
secret-looking keys (authorization, cookie, stripe-signature, etc).

This is a cheaper companion to `@kiris/scrubber` — the latter calls AWS
Comprehend Medical and is reserved for user-content endpoints. Telemetry
gets the regex pass; bodies large enough to need ML scrubbing don't belong
in telemetry anyway.
