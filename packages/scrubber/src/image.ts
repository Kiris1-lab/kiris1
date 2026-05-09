import { createHash } from "node:crypto";
import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract";
import { scrubText } from "./text.js";
import type { ScrubberOptions, ScrubberResult } from "./types.js";

/**
 * PHI scrubber for images — DESIGN.md §6.9. Pipeline:
 *   1. Textract DetectDocumentText to extract OCR text from the image bytes.
 *   2. Run scrubText on the extracted text.
 *   3. Visual EHR-chrome detection (Epic, Cerner, Meditech) is a v2 ML model;
 *      v1 relies on the EHR_BANNERS regex inside scrubText catching the EHR
 *      window chrome that Textract returns as text.
 */
export async function scrubImage(
  bytes: Uint8Array,
  opts: ScrubberOptions = {},
): Promise<ScrubberResult> {
  const start = process.hrtime.bigint();
  const failClosed = opts.failClosed ?? true;
  const inputSha256 = createHash("sha256").update(bytes).digest("hex");

  let extractedText = "";
  try {
    const client = getClient();
    const out = await client.send(new DetectDocumentTextCommand({ Document: { Bytes: bytes } }));
    extractedText = (out.Blocks ?? [])
      .filter((b) => b.BlockType === "LINE" && typeof b.Text === "string")
      .map((b) => b.Text!)
      .join("\n");
  } catch (err) {
    if (failClosed) {
      return {
        decision: "block",
        confidence: 1,
        detectedEntityTypes: ["_OCR_ERROR"],
        inputSha256,
        durationUs: elapsedUs(start),
      };
    }
  }

  const result = await scrubText(extractedText, opts);
  return { ...result, inputSha256, durationUs: elapsedUs(start) };
}

function elapsedUs(start: bigint): number {
  return Number((process.hrtime.bigint() - start) / 1000n);
}

let _client: TextractClient | undefined;
function getClient(): TextractClient {
  if (_client) return _client;
  _client = new TextractClient({ region: process.env.AWS_REGION ?? "us-east-1" });
  return _client;
}
