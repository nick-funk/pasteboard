import express from "express";
import { EnvConfig } from "./envConfig";
import { createLogger } from "bunyan";

const run = async () => {
  const envConfig = new EnvConfig();
  const logger = createLogger({ name: "pasteboard" });

  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("pasteboard");
  });

  app.listen(envConfig.port, envConfig.host, () => {
    logger.info({ port: envConfig.port, host: envConfig.host }, "listening")
  });
}

void run();