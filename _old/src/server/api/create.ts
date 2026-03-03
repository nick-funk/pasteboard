import Logger from "bunyan";
import express from "express";
import { WebSocketServer } from "ws";

import { MongoContext } from "../mongoContext";
import { createBoardsAPI } from "./boards";
import { createPostsAPI } from "./posts";

export const createAPI = (
  logger: Logger,
  app: express.Express,
  mongo: MongoContext,
  socketServer: WebSocketServer
) => {
  createBoardsAPI(logger, app, mongo);
  createPostsAPI(logger, app, mongo, socketServer);
};