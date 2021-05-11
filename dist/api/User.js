"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../services/User"));
const getUser_json_1 = __importDefault(require("../schemas/getUser.json"));
const changeUserDataRequest_json_1 = __importDefault(require("../schemas/changeUserDataRequest.json"));
const universal_cookie_1 = __importDefault(require("universal-cookie"));
const Auth_1 = require("./Auth");
const Auth_2 = __importDefault(require("../services/Auth"));
const validateId = async (request, reply, done) => {
    const { id } = request.params;
    if (!id) {
        await reply.status(400).send({ error: true, message: "Id was not specified", data: {} });
    }
    if (id === 0) {
        await reply.status(400).send({ error: true, message: "Id must be greater than 0", data: {} });
    }
    done();
};
async function getUserAPI(fastify) {
    const userService = new User_1.default();
    const authService = new Auth_2.default();
    fastify.get("/:id", {
        schema: {
            params: getUser_json_1.default,
        },
        preValidation: validateId,
    }, async (request, reply) => {
        const { id } = request.params;
        const user = await userService.find(id);
        if (!user) {
            await reply.status(404).send({ error: true, message: "User with specified id is not found", data: {} });
        }
        await reply.send({ error: false, message: "", data: user });
    });
    fastify.put("/:id", {
        schema: {
            params: getUser_json_1.default,
            body: changeUserDataRequest_json_1.default,
        },
        preValidation: validateId,
    }, async (request, reply) => {
        const cookies = new universal_cookie_1.default(request.headers.cookie);
        const token = cookies.get(Auth_1.cookieName);
        if (!token) {
            await reply.status(401).send();
        }
        const decoded = authService.decodeToken(token);
        const { id } = request.params;
        if (!decoded || decoded.userId !== id) {
            await reply.status(401).send();
        }
        const result = await userService.update(id, request.body);
        if (result) {
            await reply.status(200).send();
        }
        else {
            await reply.status(500).send();
        }
    });
}
exports.default = getUserAPI;
