import express from "express";
import Logger from "bunyan";
import nunjucks from "nunjucks";
import { WebSocketServer } from "ws";

import { EnvConfig } from "./envConfig";
import { MongoContext } from "./mongoContext";
import { createAPI } from "./api/create";
import { findBoard } from "./models/board";

const createLogger = () => {
  return Logger.createLogger({
    name: "coral-playback:server",
    src: true,
    level: "debug",
    color: true,
  });
};

const run = async () => {
  const logger = createLogger();
  const envConfig = new EnvConfig();

  const mongo = new MongoContext(envConfig.mongoURL, envConfig.mongoDb);

  nunjucks.configure("src/server/views", { autoescape: true });

  const socketServer = new WebSocketServer({
    noServer: true,
    path: "/subscription"
  });

  const app = express();
  app.use(express.json());

  app.use("/scripts", express.static("output/client/"));
  app.use("/static", express.static("static/"));

  app.get("/", (req, res) => {
    const view = nunjucks.render("index.html", {});
    res.send(view);
  });

  app.get("/board/:boardID", async (req, res) => {
    const boardID = req.params.boardID;
    if (!boardID) {
      res.sendStatus(404);
      return;
    }

    const board = await findBoard(mongo, boardID);
    if (!board) {
      res.sendStatus(404);
      return;
    }

    const config = {
      board: {
        id: board.id,
        name: board.name,
        createdAt: board.createdAt,
      }
    }

    const view = nunjucks.render("index.html", { config: JSON.stringify(config) })
    res.send(view);
  });

  createAPI(logger, app, mongo, socketServer);

  const server = app.listen(envConfig.port, envConfig.host, () => {
    logger.info(
      { port: envConfig.port, host: envConfig.host },
      "server is listening"
    );
  });

  server.on("upgrade", (req, socket, head) => {
    socketServer.handleUpgrade(req, socket, head, (webSocket) => {
      socketServer.emit("connection", webSocket, req);
    });
  });
};

void run();
