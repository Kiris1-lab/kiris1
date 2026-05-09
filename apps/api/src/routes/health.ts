import type { FastifyPluginAsync } from "fastify";

const healthRoute: FastifyPluginAsync = async (app) => {
  app.get(
    "/healthz",
    {
      config: { public: true, audit: false },
      schema: {
        response: {
          200: { type: "object", properties: { status: { type: "string" } } },
        },
      },
    },
    async () => ({ status: "ok" }),
  );
};

export default healthRoute;
