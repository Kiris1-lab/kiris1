import type { ScormModule } from "./types.js";

/**
 * Build a SCORM 1.2 imsmanifest.xml for a Kiris module. Compliant with the
 * ADL SCORM 1.2 schema; tested against HealthStream sandbox before release
 * (DESIGN §11).
 */
export function buildScorm12Manifest(mod: ScormModule, identifier: string): string {
  const escapedTitle = xmlEscape(mod.title);
  const slideResources = mod.slides
    .map(
      (s, i) =>
        `      <file href="slides/${i.toString().padStart(3, "0")}.html"/>${
          s.narrationAudio
            ? `\n      <file href="audio/${i.toString().padStart(3, "0")}.mp3"/>`
            : ""
        }`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${identifier}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                       http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                       http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="kiris-org">
    <organization identifier="kiris-org">
      <title>${escapedTitle}</title>
      <item identifier="kiris-item" identifierref="kiris-resource">
        <title>${escapedTitle}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="kiris-resource" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="player.js"/>
      <file href="player.css"/>
      <file href="content.json"/>
${slideResources}
    </resource>
  </resources>
</manifest>
`;
}

export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
