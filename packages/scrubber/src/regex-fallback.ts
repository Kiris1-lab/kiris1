/**
 * Best-effort regex pre-filter. Cheap, runs locally, never the source of
 * truth. Used to:
 *   1. Catch trivial PHI without paying Comprehend Medical for every input.
 *   2. Bound the failure mode if Comprehend Medical is unreachable AND the
 *      caller has explicitly opted into fail-open (internal tooling only).
 *
 * Comprehend Medical's classifier remains the production decision-maker.
 */

const MRN = /\bMRN[:#]?\s*\d{4,}\b/i;
const SSN = /\b\d{3}-\d{2}-\d{4}\b/;
const DOB = /\b(?:DOB|date\s*of\s*birth)[:.]?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/i;
const PHONE = /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
const EMAIL = /\b[A-Za-z0-9._%+-]+@(?!example\.|kiris\.ai)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
const ADDRESS_HINT = /\b\d{2,5}\s+[A-Z][a-z]+\s+(St|Ave|Blvd|Rd|Drive|Ln|Way|Ct)\b/;
const EHR_BANNERS =
  /\b(Epic|Cerner|Meditech|Allscripts|Athena|eClinicalWorks|NextGen)\b/;

const RULES: { pattern: RegExp; type: string; confidence: number }[] = [
  { pattern: MRN, type: "MEDICAL_RECORD_NUMBER", confidence: 0.95 },
  { pattern: SSN, type: "SSN", confidence: 0.95 },
  { pattern: DOB, type: "DATE_OF_BIRTH", confidence: 0.9 },
  { pattern: PHONE, type: "PHONE", confidence: 0.6 },
  { pattern: EMAIL, type: "EMAIL", confidence: 0.55 },
  { pattern: ADDRESS_HINT, type: "ADDRESS", confidence: 0.6 },
  { pattern: EHR_BANNERS, type: "EHR_CHROME", confidence: 0.7 },
];

export interface RegexFinding {
  type: string;
  confidence: number;
}

export function regexScan(text: string): RegexFinding[] {
  const out: RegexFinding[] = [];
  for (const rule of RULES) {
    if (rule.pattern.test(text)) {
      out.push({ type: rule.type, confidence: rule.confidence });
    }
  }
  return out;
}
