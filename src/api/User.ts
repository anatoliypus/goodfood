import {FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction} from "fastify";
import {User} from "../models/User";
import UserService from "../services/User";

import GetUserSchema from "../schemas/getUser.json";
import ChangeUserDataSchema from "../schemas/changeUserDataRequest.json";
import {ChangeUserDataRequest} from "../types/changeUserDataRequest.d";
import {GetUser as GetUserSchemaInterface} from "../types/getUser";
import Cookies from "universal-cookie";
import {cookieName} from "./Auth";
import AuthService from "../services/Auth";

const validateId = async (
  request: FastifyRequest<{Params: GetUserSchemaInterface}>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) => {
  const {id} = request.params;
  if (!id) {
    await reply.status(400).send({error: true, message: "Id was not specified", data: {}});
  }

  if (id === 0) {
    await reply.status(400).send({error: true, message: "Id must be greater than 0", data: {}});
  }

  done();
};

export default async function getUserAPI(fastify: FastifyInstance): Promise<void> {
  const userService: UserService = new UserService();
  const authService: AuthService = new AuthService();

  fastify.get<{Params: GetUserSchemaInterface}>(
    "/:id",
    {
      schema: {
        params: GetUserSchema,
      },
      preValidation: validateId,
    },
    async (request: FastifyRequest<{Params: GetUserSchemaInterface}>, reply: FastifyReply) => {
      const {id} = request.params;
      const user: User | void = await userService.find(id);

      if (!user) {
        await reply.status(404).send({error: true, message: "User with specified id is not found", data: {}});
      }

      await reply.send({error: false, message: "", data: user});
    },
  );

  fastify.put<{Body: ChangeUserDataRequest; Params: GetUserSchemaInterface}>(
    "/:id",
    {
      schema: {
        params: GetUserSchema,
        body: ChangeUserDataSchema,
      },
      preValidation: validateId,
    },
    async (
      request: FastifyRequest<{Body: ChangeUserDataRequest; Params: GetUserSchemaInterface}>,
      reply: FastifyReply,
    ) => {
      const cookies = new Cookies(request.headers.cookie);
      const token = cookies.get<string>(cookieName);
      if (!token) {
        await reply.status(401).send();
      }
      const decoded = authService.decodeToken(token);
      const {id} = request.params;
      if (!decoded || decoded.userId !== id) {
        await reply.status(401).send();
      }
      const result = await userService.update(id, request.body);
      if (result) {
        await reply.status(200).send();
      } else {
        await reply.status(500).send();
      }
    },
  );
}
