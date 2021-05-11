"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const fastify_1 = __importDefault(require("./modules/fastify"));
const typeorm_1 = __importDefault(require("./modules/typeorm"));
async function bootstrap() {
    try {
        await typeorm_1.default();
        await fastify_1.default();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
bootstrap().catch((e) => console.error(e));
