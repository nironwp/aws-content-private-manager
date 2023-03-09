import app from "./app";
import "dotenv/config";
const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006
app.listen({ port: FASTIFY_PORT, host: '0.0.0.0' });

console.log(`🚀  Fastify server running on port ${FASTIFY_PORT}`);
