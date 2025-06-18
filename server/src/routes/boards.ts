import { Router } from "express";
import Joi from "joi";
import { v4 as uuid } from "uuid";

import { DataContext } from "../data/context";
import { BoardNotFoundError } from "../errors";

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

const getBoardSchema = Joi.object({
  boardID: Joi.string().required(),
});

interface GetBoardSchema {
  boardID: string;
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

    const board = await data.boards.create({
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

    try {
      const board = await data.boards.removeByID(id);
      res.status(200).send({ board });
    } catch (err) {
      if (err instanceof BoardNotFoundError) {
        res.status(404).send(err.message);
        return;
      }

      res.sendStatus(500);
    }
  });

  router.get("/:boardID", async (req, res) => {
      const result = getBoardSchema.validate(req.params);
      if (result.error) {
        res.sendStatus(404);
        return;
      }
  
      const { boardID } = result.value as GetBoardSchema;
      const posts = await data.posts.postsForBoard(boardID);
  
      res.status(200).send({
        boardID,
        posts,
      });
  });

  return router;
}