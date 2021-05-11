import "reflect-metadata";
import "dotenv/config";

import createFastify from "./modules/fastify";
import initializeDBConnection from "./modules/typeorm";

async function bootstrap(): Promise<void> {
  try {
    await initializeDBConnection();
    await createFastify();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

bootstrap().catch((e) => console.error(e));
