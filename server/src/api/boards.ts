import * as z from "zod";

import { Router } from "express";
import { DataContext } from "../data/context";
import { BoardNotFound, FailedToCreateBoard, SomethingBadHappened } from "../errors";

const CreateSchema = z.object({
  name: z.string().min(3).nonoptional(),
});

const DeleteSchema = z.object({
  id: z.uuidv4().nonoptional(),
});

export const createBoardsRoute = (data: DataContext) => {
  const route = Router();

  route.get("/", (req, res) => {
    return res.status(200).send({
      boards: data.boards.all(),
    });
  });

  route.post("/create", (req, res) => {
    try {
      const payload = CreateSchema.parse(req.body);

      const board = data.boards.create(payload.name);
      if (!board) {
        return res.status(500).send({ message: FailedToCreateBoard });
      }

      return res.status(200).send({
        board
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

  route.post("/delete", (req, res) => {
    try {
      const payload = DeleteSchema.parse(req.body);

      const existing = data.boards.findById(payload.id);
      if (!existing) {
        res.status(404).send({ message: BoardNotFound })
      }

      const success = data.boards.delete(payload.id);

      return res.status(200).send({
        success,
        board: existing,
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
}