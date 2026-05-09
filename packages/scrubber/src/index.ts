/**
 * @kiris/scrubber — placeholder.
 *
 * Hard rule (DESIGN §6.1, §6.9): every user-input endpoint on Standard tier
 * pre-flights through this package. High-confidence detections (≥ 0.85)
 * hard-block. Low-confidence shows a confirmation modal.
 *
 * Implemented in Step 3:
 *   - Text → AWS Comprehend Medical DetectPHIV2
 *   - Images → Textract OCR → Comprehend Medical
 *   - Audio/video → Transcribe → Comprehend Medical
 *   - Result cache keyed on input sha256
 *   - Fail-closed for HIPAA-likely content
 */

export type ScrubberDecision = "allow" | "confirm" | "block";

export interface ScrubberResult {
  decision: ScrubberDecision;
  confidence: number;
  detectedEntityTypes: string[];
}

export async function scrubText(_text: string): Promise<ScrubberResult> {
  throw new Error("scrubText not implemented yet — Step 3");
}
