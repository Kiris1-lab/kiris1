# @kiris/scrubber

PHI scrubber — DESIGN §6.9. Placeholder; full implementation in Step 3.

**Threshold:** 0.85 confidence hard-blocks on Standard tier. Low-confidence
returns `decision: "confirm"` so the app surfaces a modal before proceeding.

**Failure mode:** fail-closed for HIPAA-likely content; fail-open with flag for
benign content. Cost target ~$0.0001/character.
