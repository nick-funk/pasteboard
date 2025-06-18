import { Router } from "express";
import Joi from "joi";
import { v4 as uuid } from "uuid";

import { Board, formatObj } from "../data/models";
import { DataContext } from "../data/context";

const createBoardSchema = Joi.object({
  name: Joi.string().required(),
});

interface CreateBoardSchema {
  name: string;
}

const deleteBoardSchema = Joi.object({
  id: Joi.string().required(),
});

interface DeleteBoardSchema {
  id: string;
}

export const createBoardsRouter = (data: DataContext) => {
  const router = Router();

  router.post("/", async (req, res) => {
    const result = createBoardSchema.validate(req.body);
    if (result.error) {
      res.status(400).send(result.error);
      return;
    }

    const { name } = result.value as CreateBoardSchema;

    const board = await data.boards.createBoard({
      id: uuid(),
      name,
      createdAt: new Date(),
    });

    res.status(200).send({ board });
  });

  router.get("/", async (req, res) => {
    const boards = await data.boards.all();
    
    res.status(200).send({ boards });
  });

  router.delete("/", async (req, res) => {
    const result = deleteBoardSchema.validate(req.body);
    if (result.error) {
      res.status(400).send(result.error);
      return;
    }

    const { id } = result.value as DeleteBoardSchema;

    const board = await data.boards.removeByID(id);
    if (!board) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send({ board });
  });

  return router;
}