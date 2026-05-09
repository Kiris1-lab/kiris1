# @kiris/scrubber

PHI scrubber for Standard tier. See DESIGN §6.9.

## API

```ts
import { scrubText, scrubImage } from "@kiris/scrubber";

const result = await scrubText("Patient MRN 12345 admitted Tuesday.");
// → { decision: "block", confidence: 0.95, detectedEntityTypes: ["MEDICAL_RECORD_NUMBER"], ... }
```

## Pipeline (text)

1. **Hash + cache key** — caller can dedupe with `result.inputSha256`.
2. **Regex pre-filter** (`regex-fallback.ts`) — catches MRN, SSN, DOB, EHR
   chrome cheaply. If high-confidence, skips the AWS call entirely.
3. **AWS Comprehend Medical `DetectPHI`** — production decision-maker.
4. **Decision** — block ≥ 0.85, confirm 0.5–0.85, allow < 0.5.

## Failure mode

**Fail-closed by default** (DESIGN §6.9). AWS error → decision = "block" with
synthetic type `_SCRUBBER_ERROR`. Internal tooling can opt-in to fail-open
with `failClosed: false`. **Never** use fail-open on a customer user-input
endpoint.

## Audit

The Fastify middleware in `apps/api` writes one `phi_scrubber_events` row per
call. The row holds `inputSha256` and `detectedEntityTypes` only — **never**
the input value itself.
