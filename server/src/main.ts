import express from "express";
import { EnvConfig } from "./envConfig";
import { createLogger } from "bunyan";
import { Db } from "./data/sql";
import { DataContext } from "./data/context";
import { createBoardsRouter } from "./routes/boards";
import { createPostsRouter } from "./routes/posts";

const run = async () => {
  const envConfig = new EnvConfig();
  const logger = createLogger({ name: "pasteboard" });

  const db = new Db(envConfig.dbFilename);
  const data = new DataContext(db);
  await data.init();

  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("pasteboard");
  });

  app.use("/boards", createBoardsRouter(data));
  app.use("/posts", createPostsRouter(data));

  app.listen(envConfig.port, envConfig.host, () => {
    logger.info({ port: envConfig.port, host: envConfig.host }, "listening")
  });
}

void run();