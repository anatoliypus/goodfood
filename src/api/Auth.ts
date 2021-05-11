import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import UserService from "../services/User";
import {SignUpUser} from "../types/signUpUser";
import SignUpUserSchema from "../schemas/signUpUser.json";
import SignInUserSchema from "../schemas/signInUser.json";
import {AuthResponse, AuthResponseData} from "../types/authResponse";
import {SignInUser} from "../types/signInUser";
import AuthService from "../services/Auth";
import Cookies from "universal-cookie";

export const cookieName = "token";
const notLoggedInResponse = {
  error: true,
  message: "User is not logged in",
  data: {},
};

export default async function getAuthApi(fastify: FastifyInstance): Promise<void> {
  const userService = new UserService();
  const authService = new AuthService();

  fastify.post<{Body: SignUpUser}>(
    "/signup",
    {
      schema: {
        body: SignUpUserSchema,
      },
    },
    async (request: FastifyRequest<{Body: SignUpUser}>, reply: FastifyReply) => {
      const data: SignUpUser = request.body;
      const exists = await userService.checkIfExists(data.email);

      if (exists) {
        const response: AuthResponse = {
          error: true,
          message: "User already existst",
          data: {},
        };
        await reply.status(409).send(response);
        return;
      } else {
        const signUpResult = await userService.create(data);
        if (signUpResult) {
          const authData: SignInUser = {
            email: data.email,
            password: data.password,
          };
          const token: AuthResponseData | void = await authService.createJWT(authData);
          if (!token) {
            const response: AuthResponse = {
              error: true,
              message: "Failed to generate the token",
              data: {},
            };
            await reply.status(500).send(response);
            return;
          }
          const response: AuthResponse = {
            error: false,
            message: "Successfully signed up",
            data: token,
          };
          await reply.status(201).send(response);
          return;
        } else {
          const response: AuthResponse = {
            error: true,
            message: "Failed to signup",
            data: {},
          };
          await reply.status(500).send(response);
          return;
        }
      }
    },
  );

  fastify.post<{Body: SignInUser}>(
    "/signin",
    {
      schema: {
        body: SignInUserSchema,
      },
    },
    async (request: FastifyRequest<{Body: SignInUser}>, reply: FastifyReply) => {
      const data = request.body;
      try {
        const signingUpResult = await authService.createJWT(data);
        if (!signingUpResult.token || !signingUpResult.expiresAt) {
          throw new Error("500");
        }
        await reply
          .header(
            "Set-Cookie",
            `${cookieName}=${signingUpResult.token};max-age=${signingUpResult.expiresAt};HttpOnly;Path=/;samesite=strict`,
          )
          .status(200)
          .send(signingUpResult);
      } catch (e) {
        const errCode = (e as Error).message;
        if (errCode === "404") {
          await reply.status(404).send();
        } else if (errCode === "403") {
          await reply.status(403).send();
        } else {
          await reply.status(500).send();
        }
      }
    },
  );

  fastify.put("/logout", {}, async (request: FastifyRequest, reply: FastifyReply) => {
    const cookies = new Cookies(request.headers.cookie);
    if (!cookies.get(cookieName)) {
      await reply.status(401).send(notLoggedInResponse);
    } else {
      const response: AuthResponse = {
        error: false,
        message: "Successfully logged out",
        data: {},
      };
      await reply
        .header("Set-Cookie", `${cookieName}= ;max-age=-1;HttpOnly;Path=/;samesite=strict`)
        .status(200)
        .send(response);
    }
  });

  fastify.get("/status", {}, async (request: FastifyRequest, reply: FastifyReply) => {
    const cookies = new Cookies(request.headers.cookie);
    const token = cookies.get<string>(cookieName);
    if (!token) {
      await reply.status(401).send(notLoggedInResponse);
    } else {
      const authService = new AuthService();
      const decoded = authService.decodeToken(token);
      if (decoded) {
        const tokenData: AuthResponse = {
          error: false,
          message: "Logged in",
          data: {
            token,
            expiresAt: decoded.exp,
          },
        };
        await reply.status(200).send(tokenData);
      } else {
        const res: AuthResponse = {
          error: true,
          message: "Failed to verify the token",
          data: {},
        };
        await reply.status(401).send(res);
      }
    }
  });
}
