import { Router } from "express";
import * as z from "zod";

import { DataContext } from "../data/context";
import {
  BoardItemNotFound,
  BoardNotFound,
  FailedToCreateBoardItem,
  SomethingBadHappened,
} from "../errors";

const CreateSchema = z.object({
  boardId: z.uuidv4().nonoptional(),
  body: z.string().nonoptional(),
});

const DeleteSchema = z.object({
  boardId: z.uuidv4().nonoptional(),
  id: z.uuidv4().nonoptional(),
});

export const createBoardItemsRoute = (data: DataContext) => {
  const route = Router();

  route.post("/delete", (req, res) => {
    try {
      const payload = DeleteSchema.parse(req.body);

      const board = data.boards.findById(payload.boardId);
      if (!board) {
        return res.status(404).send({ message: BoardNotFound });
      }

      const boardItem = data.boardItems.findById(payload.boardId, payload.id);
      if (!boardItem) {
        return res.status(404).send({ message: BoardItemNotFound });
      }

      const success = data.boardItems.delete(payload.boardId, payload.id); 

      return res.status(200).send({
        success,
        boardItem,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).send({
          issues: err.issues,
        });
      }

      return res.status(500).send({ message: SomethingBadHappened });
    }
  });

  route.post("/create", (req, res) => {
    try {
      const payload = CreateSchema.parse(req.body);

      const board = data.boards.findById(payload.boardId);
      if (!board) {
        return res.status(404).send({ message: BoardNotFound });
      }

      const boardItem = data.boardItems.create(payload);
      if (!boardItem) {
        return res.status(500).send({ message: FailedToCreateBoardItem });
      }

      return res.status(200).send({
        boardItem,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).send({
          issues: err.issues,
        });
      }

      return res.status(500).send({ message: SomethingBadHappened });
    }
  });

  return route;
};
