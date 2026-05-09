/**
 * PHI scrubber for telemetry. Sentry has a BAA but DESIGN §6.6 / §6.9 still
 * require us to strip PHI-shaped values before send. Cheap regex pass; the
 * Comprehend-based scrubber lives in @kiris/scrubber and is too expensive
 * for every error event.
 */

const REPLACEMENTS: { pattern: RegExp; replacement: string }[] = [
  { pattern: /\bMRN[:#]?\s*\d{4,}\b/gi, replacement: "[redacted-mrn]" },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: "[redacted-ssn]" },
  {
    pattern: /\b(?:DOB|date\s*of\s*birth)[:.]?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
    replacement: "[redacted-dob]",
  },
  { pattern: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: "[redacted-phone]" },
  {
    // Skip example.com and kiris.ai — those are operational.
    pattern: /\b[A-Za-z0-9._%+-]+@(?!example\.|kiris\.ai)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replacement: "[redacted-email]",
  },
];

const SECRET_KEYS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "stripe-signature",
  "anthropic_api_key_standard",
  "anthropic_api_key_hipaa",
  "stripe_secret_key",
  "stripe_webhook_secret",
  "internal_signing_key",
  "password",
  "secret",
]);

/** Replace PHI-looking spans inside a free-form string. */
export function scrubString(s: string): string {
  if (!s) return s;
  let out = s;
  for (const { pattern, replacement } of REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/** Recursively scrub strings + redact secret keys in arbitrary JSON. */
export function scrubValue(value: unknown, depth = 0): unknown {
  if (depth > 8) return "[truncated-depth]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return scrubString(value);
  if (Array.isArray(value)) return value.map((v) => scrubValue(v, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SECRET_KEYS.has(k.toLowerCase()) ? "[redacted-secret]" : scrubValue(v, depth + 1);
    }
    return out;
  }
  return value;
}
