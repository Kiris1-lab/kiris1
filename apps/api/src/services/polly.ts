import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { loadEnv } from "../env.js";

/**
 * AWS Polly narration synthesis. Neural and Generative engines, both BAA-
 * eligible (DESIGN §6.7). Output is uploaded to S3 by the caller.
 */

let _client: PollyClient | undefined;
function getClient(): PollyClient {
  if (_client) return _client;
  const env = loadEnv();
  _client = new PollyClient({ region: env.AWS_REGION });
  return _client;
}

export interface NarrationInput {
  text: string;
  voice: string;          // e.g. "Joanna"
  engine: "neural" | "generative";
}

export interface NarrationOutput {
  audio: Uint8Array;
  contentType: string;
  charCount: number;
  pollyRequestId: string | null;
}

export async function synthesize(input: NarrationInput): Promise<NarrationOutput> {
  const out = await getClient().send(
    new SynthesizeSpeechCommand({
      Text: input.text,
      VoiceId: input.voice,
      Engine: input.engine,
      OutputFormat: "mp3",
    }),
  );
  if (!out.AudioStream) throw new Error("polly returned no audio stream");
  const chunks: Uint8Array[] = [];
  // @ts-expect-error AudioStream is a Node Readable in v3
  for await (const chunk of out.AudioStream) chunks.push(chunk);
  const audio = concat(chunks);
  return {
    audio,
    contentType: out.ContentType ?? "audio/mpeg",
    charCount: input.text.length,
    pollyRequestId: out.$metadata?.requestId ?? null,
  };
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((acc, c) => acc + c.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out;
}
