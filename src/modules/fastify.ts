import {fastify, FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import getenv from "getenv";
import getAuthApi from "../api/Auth";
import getUserAPI from "../api/User";
import fastifyStatic from "fastify-static";
import path from "path";
import getDataAPI from "../api/Data";

export default async function createFastify(): Promise<FastifyInstance> {
  const instance: FastifyInstance = fastify();
  const indexFile = "index.html";
  const staticsRoute = path.resolve(__dirname, "public");
  await instance.register(fastifyStatic, {
    root: staticsRoute,
    prefix: "/",
  });

  instance.get("/", async (request: FastifyRequest, response: FastifyReply) => {
    await response.sendFile(indexFile);
  });

  instance.get("/api", async (request: FastifyRequest, reply: FastifyReply) => {
    await reply.redirect("https://documenter.getpostman.com/view/15042692/TzRVe5pz");
  });

  await instance.register(getUserAPI, {prefix: "/user"});
  await instance.register(getAuthApi, {prefix: "/auth"});
  await instance.register(getDataAPI, {prefix: "/data"});

  const port = getenv.int("PORT");

  await instance.listen({port});

  console.log(`Server listening on port ${port}`);

  return instance;
}
