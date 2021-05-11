import getenv from "getenv";
import {Connection, createConnection} from "typeorm";
import {User} from "../models/User";
import {Recipes} from "../models/Recipes";

export default async function initializeDBConnection(): Promise<Connection> {
  const connection = await createConnection({
    type: "mysql",
    url: getenv.string("DB_CON_STRING"),
    logging: getenv.string("NODE_ENV", "development") === "production" ? ["error"] : true,
    synchronize: getenv.string("NODE_ENV", "development") !== "production",
    entities: [User, Recipes],
    charset: "UTF8_GENERAL_CI",
  });

  console.log("Database connection established");

  return connection;
}
