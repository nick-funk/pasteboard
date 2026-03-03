import pino from "pino";
import express from "express";

import { Config } from "./config";
import { SqlContext } from "./data/sql";
import { DataContext } from "./data/context";
import { createBoardsRoute } from "./api/boards";

const run = async () => {
  const logger = pino().child({ name: "pb-serve" });
  const config = new Config();

  const sql = new SqlContext(config.dbFile);
  const data = new DataContext(sql);

  const app = express();
  app.use(express.json({ limit: "5mb" }));

  app.use("/boards", createBoardsRoute(data));

  app.get("/", (req, res) => {
    return res.status(200).send("pasteboard");
  });

  app.listen(config.port, config.host, () => {
    logger.info(
      {
        port: config.port,
        host: config.host,
        url: `http://${config.host}:${config.port}`,
      },
      "server is listening",
    );
  });
};

run();
