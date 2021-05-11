"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
function createFastify() {
    const instance = fastify_1.fastify();
    instance.get("/ping", async () => {
        return Promise.resolve("pong\n");
    });
    return instance;
}
exports.default = createFastify;
