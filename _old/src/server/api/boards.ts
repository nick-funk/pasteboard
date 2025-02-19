import express from "express";
import Logger from "bunyan";
import { v4 as uuid } from "uuid";
import Joi from "joi";

import { MongoContext } from "../mongoContext";
import {
  Board,
  createBoard,
  deleteBoard,
  paginateBoards,
} from "../models/board";

interface CreateBoardBody {
  name: string;
}

const create = (logger: Logger, app: express.Express, mongo: MongoContext) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  app.post("/api/board/create", async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).send(error.message);
      return;
    }

    const body = value as CreateBoardBody;
    const board: Board = {
      id: uuid(),
      name: body.name,
      createdAt: new Date(),
    };

    try {
      const newBoard = await createBoard(mongo, board);
      res.status(200).send(newBoard);
    } catch (err) {
      logger.error(err);
      res.sendStatus(500);
    }
  });
};

interface BoardsBody {
  after: string;
  count: number;
}

const boards = (logger: Logger, app: express.Express, mongo: MongoContext) => {
  const schema = Joi.object({
    after: Joi.string()
      .optional()
      .default(() => {
        return new Date().toISOString();
      }),
    count: Joi.number().optional().default(20),
  });

  app.post("/api/boards", async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).send(error.message);
      return;
    }

    const body = value as BoardsBody;

    try {
      const result = await paginateBoards(
        mongo,
        new Date(body.after),
        body.count
      );

      res.status(200).send(result);
    } catch (err) {
      logger.error(err);
      res.sendStatus(500);
    }
  });
};

interface DeleteBoardBody {
  id: string;
}

const registerDeleteBoard = (
  logger: Logger,
  app: express.Express,
  mongo: MongoContext
) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });

  app.post("/api/board/delete", async (req, res) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      res.status(400).send(error.message);
      return;
    }

    const body = value as DeleteBoardBody;

    try {
      const result = await deleteBoard(mongo, body.id);

      if (result) {
        res.status(200).send({ id: body.id });
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      logger.error(err);
      res.sendStatus(404);
    }
  });
};

export const createBoardsAPI = (
  logger: Logger,
  app: express.Express,
  mongo: MongoContext
) => {
  create(logger, app, mongo);
  boards(logger, app, mongo);
  registerDeleteBoard(logger, app, mongo);
};
