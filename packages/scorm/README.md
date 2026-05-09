# @kiris/scorm

Module packagers. SCORM 1.2 ships in Step 4; SCORM 2004 / xAPI / MP4 / HTML5
land in Phase 3 (DESIGN §11, §20.32).

## API

```ts
import { packageScorm12 } from "@kiris/scorm";

const zip = packageScorm12({
  id: "m_demo",
  title: "Hand hygiene refresher",
  authoringMode: "express",
  estimatedDurationSeconds: 420,
  learningObjectives: ["Identify the 5 moments", "Demonstrate proper technique"],
  audience: "Med-surg nurses",
  slides: [
    {
      id: "s1",
      position: 1,
      type: "title",
      title: "...",
      bodyMarkdown: "...",
      narrationScript: "...",
      altText: "",
      durationSeconds: 30,
    },
  ],
});
// zip is a Uint8Array — upload to S3 and emit a signed URL.
```

## ZIP layout

```
imsmanifest.xml          ← ADL SCORM 1.2 manifest
index.html               ← player shell
player.js                ← player + SCORM 1.2 API discovery
player.css               ← player styles
content.json             ← serialized slide tree consumed by the player
metadata.json            ← Kiris-specific metadata for re-import
slides/000.html, 001.html, ... ← static fallback per slide
audio/000.mp3, ...       ← Polly mp3 (when present)
```

## Testing

`pnpm --filter @kiris/scorm test` validates the ZIP structure and manifest
shape. **Before declaring a release done**, drop the ZIP into an actual
HealthStream sandbox and verify launch + completion + score reporting.
