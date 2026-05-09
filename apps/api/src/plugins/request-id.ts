import { randomUUID } from "node:crypto";
import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

/**
 * Per-request UUID. Echoed back as `x-request-id` and stamped on every audit
 * log row + Anthropic request. Lets us correlate without ever logging PHI.
 */
const requestIdPlugin: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", async (req, reply) => {
    const incoming = req.headers["x-request-id"];
    const id = typeof incoming === "string" && incoming.length > 0 ? incoming : randomUUID();
    req.requestId = id;
    reply.header("x-request-id", id);
  });
};

export default fp(requestIdPlugin, { name: "request-id" });
