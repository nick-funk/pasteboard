import { Router } from "express";

import { DataContext } from "../data/context";

import { createBoardsRoute } from "./boards";
import { createBoardItemsRoute } from "./boardItems";

export const createApiRoute = (data: DataContext) => {
  const router = Router();

  router.use("/boards", createBoardsRoute(data));
  router.use("/boardItems", createBoardItemsRoute(data));

  return router
}