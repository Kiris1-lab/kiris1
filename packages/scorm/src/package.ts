import { zipSync, strToU8 } from "fflate";
import { buildScorm12Manifest, xmlEscape } from "./manifest.js";
import { PLAYER_CSS, PLAYER_HTML, PLAYER_JS } from "./player.js";
import type { PackageOptions, ScormModule, ScormSlide } from "./types.js";

/**
 * Build a SCORM 1.2 ZIP. Returns a Uint8Array; the caller (apps/api) is
 * responsible for uploading to S3 and emitting a signed URL.
 *
 * Layout inside the ZIP:
 *   imsmanifest.xml
 *   index.html              ← player shell
 *   player.js               ← player + SCORM API discovery
 *   player.css
 *   content.json            ← serialized slides for the player to consume
 *   slides/000.html, …      ← per-slide HTML for static fallback
 *   audio/000.mp3, …        ← Polly mp3, when present
 *   metadata.json           ← Kiris-specific metadata for re-import
 */
export function packageScorm12(mod: ScormModule, opts?: PackageOptions): Uint8Array {
  const identifier = opts?.identifier ?? `kiris-${mod.id}`;
  const files: Record<string, Uint8Array> = {};

  files["imsmanifest.xml"] = strToU8(buildScorm12Manifest(mod, identifier));
  files["index.html"] = strToU8(PLAYER_HTML);
  files["player.js"] = strToU8(PLAYER_JS);
  files["player.css"] = strToU8(PLAYER_CSS);
  files["content.json"] = strToU8(buildContentJson(mod));
  files["metadata.json"] = strToU8(buildMetadata(mod));

  mod.slides.forEach((s, i) => {
    const padded = i.toString().padStart(3, "0");
    files[`slides/${padded}.html`] = strToU8(buildSlideHtml(s));
    if (s.narrationAudio) {
      files[`audio/${padded}.mp3`] = s.narrationAudio.bytes;
    }
  });

  return zipSync(files);
}

function buildContentJson(mod: ScormModule): string {
  return JSON.stringify({
    title: mod.title,
    audience: mod.audience,
    learningObjectives: mod.learningObjectives,
    slides: mod.slides.map((s, i) => ({
      id: s.id,
      type: s.type,
      title: s.title,
      bodyMarkdown: s.bodyMarkdown,
      durationSeconds: s.durationSeconds,
      altText: s.altText,
      audioPath: s.narrationAudio ? `audio/${i.toString().padStart(3, "0")}.mp3` : null,
    })),
  });
}

function buildMetadata(mod: ScormModule): string {
  return JSON.stringify(
    {
      generator: "kiris",
      schemaVersion: "1.0",
      module: {
        id: mod.id,
        title: mod.title,
        authoringMode: mod.authoringMode,
        estimatedDurationSeconds: mod.estimatedDurationSeconds,
        learningObjectives: mod.learningObjectives,
        tier: mod.tier ?? "standard",
      },
    },
    null,
    2,
  );
}

function buildSlideHtml(s: ScormSlide): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${xmlEscape(s.title)}</title>
<link rel="stylesheet" href="../player.css" />
</head>
<body>
<main class="canvas">
  <article class="slide" aria-label="${xmlEscape(s.title)}">
    <div class="slide-eyebrow">${xmlEscape(s.type.replace("_", " "))}</div>
    <h1 class="slide-title">${xmlEscape(s.title)}</h1>
    <div class="slide-body">${xmlEscape(s.bodyMarkdown)}</div>
  </article>
</main>
</body>
</html>
`;
}
