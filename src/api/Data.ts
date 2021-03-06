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
      const {key, amount, offset, categories, ingredients} = request.query;
      const data = await dataService.getData(amount, offset, key, categories, ingredients);
      if (data) {
        await reply.status(200).header("Access-Control-Allow-Origin", "*").send(data);
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
  fastify.get("/getCategories", async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await dataService.getCategories();
    if (data) {
      await reply.status(200).header("Access-Control-Allow-Origin", "*").send(data);
      return;
    }
    await reply.status(500).send();
  });
}
