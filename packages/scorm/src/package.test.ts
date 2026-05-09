import { test } from "node:test";
import assert from "node:assert/strict";
import { unzipSync, strFromU8 } from "fflate";
import { packageScorm12 } from "./package.js";

const SAMPLE = {
  id: "m_demo",
  title: "Hand hygiene refresher",
  authoringMode: "express" as const,
  estimatedDurationSeconds: 420,
  learningObjectives: ["Identify the 5 moments", "Demonstrate proper technique"],
  audience: "Med-surg nurses",
  slides: [
    {
      id: "s1",
      position: 1,
      type: "title",
      title: "Hand hygiene",
      bodyMarkdown: "A 7-minute refresher.",
      narrationScript: "Welcome.",
      altText: "",
      durationSeconds: 30,
    },
    {
      id: "s2",
      position: 2,
      type: "knowledge_check",
      title: "Quick check",
      bodyMarkdown: "Which moment applies?",
      narrationScript: "",
      altText: "",
      durationSeconds: 30,
    },
  ],
};

test("packageScorm12 emits a valid SCORM 1.2 ZIP", () => {
  const zip = packageScorm12(SAMPLE);
  const entries = unzipSync(zip);

  assert.ok(entries["imsmanifest.xml"], "manifest present");
  assert.ok(entries["index.html"], "index.html present");
  assert.ok(entries["player.js"], "player.js present");
  assert.ok(entries["player.css"], "player.css present");
  assert.ok(entries["content.json"], "content.json present");
  assert.ok(entries["metadata.json"], "metadata.json present");
  assert.ok(entries["slides/000.html"], "slide 0 present");
  assert.ok(entries["slides/001.html"], "slide 1 present");

  const manifest = strFromU8(entries["imsmanifest.xml"]!);
  assert.match(manifest, /<schemaversion>1\.2<\/schemaversion>/);
  assert.match(manifest, /Hand hygiene refresher/);
  assert.match(manifest, /adlcp:scormtype="sco"/);

  const content = JSON.parse(strFromU8(entries["content.json"]!));
  assert.equal(content.slides.length, 2);
  assert.equal(content.slides[0].title, "Hand hygiene");
});

test("packageScorm12 includes audio when narrationAudio is provided", () => {
  const mp3 = new Uint8Array([0xff, 0xfb, 0x10, 0xc4, 0x00, 0x00]);
  const zip = packageScorm12({
    ...SAMPLE,
    slides: [
      {
        ...SAMPLE.slides[0]!,
        narrationAudio: { bytes: mp3, contentType: "audio/mpeg" },
      },
    ],
  });
  const entries = unzipSync(zip);
  assert.ok(entries["audio/000.mp3"], "audio file present");
  assert.deepEqual(Array.from(entries["audio/000.mp3"]!), Array.from(mp3));
});
