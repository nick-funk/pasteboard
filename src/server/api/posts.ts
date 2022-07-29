import express from "express";
import Logger from "bunyan";
import { v4 as uuid } from "uuid";
import Joi from "joi";
import { WebSocketServer } from "ws";

import { MongoContext } from "../mongoContext";
import {
  Post,
  createPost,
  paginatePosts,
  deletePost as deletePostModel,
} from "../models/post";

interface CreatePostBody {
  boardID: string;
  body: string;
}

const create = (
  logger: Logger,
  app: express.Express,
  mongo: MongoContext,
  socketServer: WebSocketServer
) => {
  const createSchema = Joi.object({
    boardID: Joi.string().required(),
    body: Joi.string().required(),
  });

  app.post("/api/post/create", async (req, res) => {
    const { error, value } = createSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.message);
      return;
    }

    const body = value as CreatePostBody;
    const post: Post = {
      id: uuid(),
      boardID: body.boardID,
      body: body.body,
      createdAt: new Date(),
    };

    try {
      const newPost = await createPost(mongo, post);
      res.status(200).send(newPost);

      for (const client of socketServer.clients) {
        client.send(
          JSON.stringify({
            action: "createPost",
            post: newPost,
          })
        );
      }
    } catch (err) {
      logger.error(err);
      res.sendStatus(500);
    }
  });
};

interface DeletePostBody {
  id: string;
}

const deletePost = (
  logger: Logger,
  app: express.Express,
  mongo: MongoContext
) => {
  const createSchema = Joi.object({
    id: Joi.string().required(),
  });

  app.post("/api/post/delete", async (req, res) => {
    const { error, value } = createSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.message);
      return;
    }

    const body = value as DeletePostBody;

    try {
      const result = await deletePostModel(mongo, body.id);

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

interface PostsBody {
  boardID: string;
  after: string;
  count: number;
}

const posts = (logger: Logger, app: express.Express, mongo: MongoContext) => {
  const postsSchema = Joi.object({
    boardID: Joi.string().required(),
    after: Joi.string()
      .optional()
      .default(() => {
        return new Date().toISOString();
      }),
    count: Joi.number().optional().default(20),
  });

  app.post("/api/posts", async (req, res) => {
    const { error, value } = postsSchema.validate(req.body);
    if (error) {
      res.status(400).send(error.message);
      return;
    }

    const body = value as PostsBody;

    try {
      const result = await paginatePosts(
        mongo,
        body.boardID,
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

export const createPostsAPI = (
  logger: Logger,
  app: express.Express,
  mongo: MongoContext,
  socketServer: WebSocketServer
) => {
  create(logger, app, mongo, socketServer);
  posts(logger, app, mongo);
  deletePost(logger, app, mongo);
};
