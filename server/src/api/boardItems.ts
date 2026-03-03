import { Router } from "express";
import * as z from "zod";

import { DataContext } from "../data/context";
import {
  BoardNotFound,
  FailedToCreateBoardItem,
  SomethingBadHappened,
} from "../errors";

const CreateSchema = z.object({
  boardId: z.uuidv4().nonoptional(),
  body: z.string().nonoptional(),
});

export const createBoardItemsRoute = (data: DataContext) => {
  const route = Router();

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
