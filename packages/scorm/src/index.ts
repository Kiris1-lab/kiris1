/**
 * @kiris/scorm — module packagers. SCORM 1.2 ships in Step 4 (DESIGN §11
 * priority). SCORM 2004, xAPI, MP4, HTML5 land in Phase 3 (DESIGN §20.32).
 *
 * MUST: validate against an actual HealthStream sandbox before declaring
 * a release done.
 */

export { packageScorm12 } from "./package.js";
export { buildScorm12Manifest } from "./manifest.js";
export type { ScormModule, ScormSlide, PackageOptions } from "./types.js";
