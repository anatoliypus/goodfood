"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Data_1 = __importDefault(require("../services/Data"));
const getDataQuery_json_1 = __importDefault(require("../schemas/getDataQuery.json"));
async function getDataAPI(fastify) {
    const dataService = new Data_1.default();
    fastify.get("/parse", async (request, reply) => {
        await reply.status(200).send();
        await dataService.parseEda();
    });
    fastify.get("/get", { schema: { querystring: getDataQuery_json_1.default } }, async (request, reply) => {
        const { key, amount, offset, category } = request.query;
        const data = await dataService.getData(amount, offset, key, category);
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
    });
    fastify.get("/count", async (request, reply) => {
        const data = await dataService.getRecipesAmount();
        if (data) {
            await reply.status(200).send(data);
            return;
        }
        await reply.status(500).send();
    });
    fastify.get("/getCategories", async (request, reply) => {
        const data = await dataService.getCategories();
        if (data) {
            await reply.status(200).send(data);
            return;
        }
        await reply.status(500).send();
    });
}
exports.default = getDataAPI;
