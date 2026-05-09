/**
 * Module shape consumed by the SCORM packager. Mirrors the subset of the
 * @kiris/db `modules` + `slides` rows we need at export time. Audio bytes
 * are streamed into the ZIP — the packager does not own S3 access.
 */

export interface ScormSlide {
  id: string;
  position: number;
  type: string;
  title: string;
  bodyMarkdown: string;
  narrationScript: string;
  altText: string;
  durationSeconds: number;
  /** Optional pre-rendered MP3. If omitted, the player relies on browser TTS. */
  narrationAudio?: { bytes: Uint8Array; contentType: "audio/mpeg" };
}

export interface ScormModule {
  id: string;
  title: string;
  authoringMode: "express" | "guided";
  estimatedDurationSeconds: number;
  learningObjectives: string[];
  audience: string;
  slides: ScormSlide[];
  /** Optional metadata hint surfaced in the player. */
  tier?: "standard" | "hipaa";
}

export interface PackageOptions {
  /** SCORM 1.2 only in Step 4 — DESIGN §11 priority. */
  format: "scorm12";
  /** Identifier used for `imsmanifest.xml`. Defaults to module.id. */
  identifier?: string;
}
