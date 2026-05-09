/**
 * @kiris/learning-engine — codifies DESIGN §17 as prompts, validators, and
 * structural templates. Pure module — never calls the model directly. The
 * Anthropic two-key router lives in apps/api.
 */

export * from "./constants.js";
export * from "./template.js";
export * from "./prompts.js";
export * from "./validators.js";
