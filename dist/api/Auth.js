"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieName = void 0;
const User_1 = __importDefault(require("../services/User"));
const signUpUser_json_1 = __importDefault(require("../schemas/signUpUser.json"));
const signInUser_json_1 = __importDefault(require("../schemas/signInUser.json"));
const Auth_1 = __importDefault(require("../services/Auth"));
const universal_cookie_1 = __importDefault(require("universal-cookie"));
exports.cookieName = "token";
const notLoggedInResponse = {
    error: true,
    message: "User is not logged in",
    data: {},
};
async function getAuthApi(fastify) {
    const userService = new User_1.default();
    const authService = new Auth_1.default();
    fastify.post("/signup", {
        schema: {
            body: signUpUser_json_1.default,
        },
    }, async (request, reply) => {
        const data = request.body;
        const exists = await userService.checkIfExists(data.email);
        if (exists) {
            const response = {
                error: true,
                message: "User already existst",
                data: {},
            };
            await reply.status(409).send(response);
            return;
        }
        else {
            const signUpResult = await userService.create(data);
            if (signUpResult) {
                const authData = {
                    email: data.email,
                    password: data.password,
                };
                const token = await authService.createJWT(authData);
                if (!token) {
                    const response = {
                        error: true,
                        message: "Failed to generate the token",
                        data: {},
                    };
                    await reply.status(500).send(response);
                    return;
                }
                const response = {
                    error: false,
                    message: "Successfully signed up",
                    data: token,
                };
                await reply.status(201).send(response);
                return;
            }
            else {
                const response = {
                    error: true,
                    message: "Failed to signup",
                    data: {},
                };
                await reply.status(500).send(response);
                return;
            }
        }
    });
    fastify.post("/signin", {
        schema: {
            body: signInUser_json_1.default,
        },
    }, async (request, reply) => {
        const data = request.body;
        try {
            const signingUpResult = await authService.createJWT(data);
            if (!signingUpResult.token || !signingUpResult.expiresAt) {
                throw new Error("500");
            }
            await reply
                .header("Set-Cookie", `${exports.cookieName}=${signingUpResult.token};max-age=${signingUpResult.expiresAt};HttpOnly;Path=/;samesite=strict`)
                .status(200)
                .send(signingUpResult);
        }
        catch (e) {
            const errCode = e.message;
            if (errCode === "404") {
                await reply.status(404).send();
            }
            else if (errCode === "403") {
                await reply.status(403).send();
            }
            else {
                await reply.status(500).send();
            }
        }
    });
    fastify.put("/logout", {}, async (request, reply) => {
        const cookies = new universal_cookie_1.default(request.headers.cookie);
        if (!cookies.get(exports.cookieName)) {
            await reply.status(401).send(notLoggedInResponse);
        }
        else {
            const response = {
                error: false,
                message: "Successfully logged out",
                data: {},
            };
            await reply
                .header("Set-Cookie", `${exports.cookieName}= ;max-age=-1;HttpOnly;Path=/;samesite=strict`)
                .status(200)
                .send(response);
        }
    });
    fastify.get("/status", {}, async (request, reply) => {
        const cookies = new universal_cookie_1.default(request.headers.cookie);
        const token = cookies.get(exports.cookieName);
        if (!token) {
            await reply.status(401).send(notLoggedInResponse);
        }
        else {
            const authService = new Auth_1.default();
            const decoded = authService.decodeToken(token);
            if (decoded) {
                const tokenData = {
                    error: false,
                    message: "Logged in",
                    data: {
                        token,
                        expiresAt: decoded.exp,
                    },
                };
                await reply.status(200).send(tokenData);
            }
            else {
                const res = {
                    error: true,
                    message: "Failed to verify the token",
                    data: {},
                };
                await reply.status(401).send(res);
            }
        }
    });
}
exports.default = getAuthApi;
