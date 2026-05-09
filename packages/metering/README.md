# @kiris/metering

Usage events + daily rollups. See DESIGN §8.6. Implemented in Step 4.

**Hard rule:** never reports PHI, module names, or user content to Stripe — only
counts.
