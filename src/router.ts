import { FastifyInstance } from "fastify";
import muxController from "./controller/muxController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(muxController, { prefix: "/api/v1/mux" });
}
