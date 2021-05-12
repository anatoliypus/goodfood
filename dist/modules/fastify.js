"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const getenv_1 = __importDefault(require("getenv"));
const Auth_1 = __importDefault(require("../api/Auth"));
const User_1 = __importDefault(require("../api/User"));
const fastify_static_1 = __importDefault(require("fastify-static"));
const path_1 = __importDefault(require("path"));
const Data_1 = __importDefault(require("../api/Data"));
async function createFastify() {
    const instance = fastify_1.fastify();
    const indexFile = "index.html";
    const staticsRoute = path_1.default.resolve(__dirname, "public");
    await instance.register(fastify_static_1.default, {
        root: staticsRoute,
        prefix: "/",
    });
    instance.get("/", async (request, response) => {
        await response.sendFile(indexFile);
    });
    await instance.register(User_1.default, { prefix: "/user" });
    await instance.register(Auth_1.default, { prefix: "/auth" });
    await instance.register(Data_1.default, { prefix: "/data" });
    const port = getenv_1.default.int("PORT");
    await instance.listen({ port });
    console.log(`Server listening on port ${port}`);
    return instance;
}
exports.default = createFastify;
