import pino from "pino";
import express from "express";
import cors from "cors";

import { Config } from "./config";
import { SqlContext } from "./data/sql";
import { DataContext } from "./data/context";
import { createBoardsRoute } from "./api/boards";
import { createBoardItemsRoute } from "./api/boardItems";
import { createApiRoute } from "./api/api";

const run = async () => {
  const logger = pino().child({ name: "pb-serve" });
  const config = new Config();

  const sql = new SqlContext(config.dbFile);
  const data = new DataContext(sql);

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "5mb" }));

  app.use("/api", createApiRoute(data));

  app.use("/", express.static("client/"));
  app.use("/boards", express.static("client/"));
  app.use("/board", express.static("client/"));
  app.use("/board/:id", express.static("client/"));
  app.use("/board/:id/edit", express.static("client/"));
  app.use("/board/create", express.static("client/"));

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
