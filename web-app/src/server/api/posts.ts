import express from "express";
import Logger from "bunyan";
import { v4 as uuid } from "uuid";
import Joi from "joi";

import { MongoContext } from "../mongoContext";
import { Post, createPost, paginatePosts } from "../models/post";

interface CreatePostBody {
  boardID: string;
  body: string;
}

const create = (logger: Logger, app: express.Express, mongo: MongoContext) => {
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
    } catch (err) {
      logger.error(err);
      res.sendStatus(500);
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
  mongo: MongoContext
) => {
  create(logger, app, mongo);
  posts(logger, app, mongo);
};
