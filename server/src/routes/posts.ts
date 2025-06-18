import { Router } from "express";
import Joi from "joi";
import { v4 as uuid } from "uuid";

import { DataContext } from "../data/context";
import { BoardNotFoundError, PostNotFoundError } from "../errors";

const createPostSchema = Joi.object({
  boardID: Joi.string().required(),
  value: Joi.string().required(),
});

interface CreatePostSchema {
  boardID: string;
  value: string;
}

const deletePostSchema = Joi.object({
  boardID: Joi.string().required(),
  id: Joi.string().required(),
});

interface DeletePostSchema {
  boardID: string;
  id: string;
}

export const createPostsRouter = (data: DataContext) => {
  const router = Router();

  router.post("/", async (req, res) => {
    const result = createPostSchema.validate(req.body);
    if (result.error) {
      res.sendStatus(400);
      return;
    }

    const { boardID, value } = result.value as CreatePostSchema;

    try {
      const post = await data.posts.create({
        id: uuid(),
        boardID,
        createdAt: new Date(),
        value,
      });

      res.status(200).send({ post });
    } catch (err) {
      if (err instanceof BoardNotFoundError) {
        res.status(404).send(err.message);
        return;
      }

      res.sendStatus(500);
    }
  });

  router.delete("/", async (req, res) => {
    const result = deletePostSchema.validate(req.body);
    if (result.error) {
      res.status(400).send(result.error);
      return;
    }

    const { id, boardID } = result.value as DeletePostSchema;

    try {
      const post = await data.posts.remove(boardID, id);
      res.status(200).send({ post });
    } catch (err) {
      if (err instanceof PostNotFoundError) {
        res.status(404).send(err.message);
        return;
      }

      res.sendStatus(500);
    }
  });

  return router;
}