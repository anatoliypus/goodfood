import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import DataService from "../services/Data";
import GetDataQuerySchema from "../schemas/getDataQuery.json";
import {GetDataQuery} from "../types/getDataQuery";

export default async function getDataAPI(fastify: FastifyInstance): Promise<void> {
  const dataService = new DataService();
  fastify.get("/parse", async (request: FastifyRequest, reply: FastifyReply) => {
    await reply.status(200).send();
    await dataService.parseEda();
  });
  fastify.get<{Querystring: GetDataQuery}>(
    "/get",
    {schema: {querystring: GetDataQuerySchema}},
    async (request: FastifyRequest<{Querystring: GetDataQuery}>, reply: FastifyReply) => {
      const search = request.query.key;
      const data = await dataService.getData(search);
      if (data) {
        await reply
          .status(200)
          .headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          })
          .send(data);
        return;
      }
      await reply.status(500).send();
    },
  );
  fastify.get("/count", async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await dataService.getRecipesAmount();
    if (data) {
      await reply.status(200).send(data);
      return;
    }
    await reply.status(500).send();
  });
}
