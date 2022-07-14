import { MongoContext } from "../mongoContext";

export interface Board {
  id: string;
  createdAt: Date;
  name: string;
}

export const createBoard = async (mongo: MongoContext, board: Board) => {
  const exists = await mongo.boards().findOne({ id: board.id });
  if (exists) {
    throw new Error("board with id already exists");
  }

  const result = await mongo.boards().insertOne(board);

  if (result.acknowledged) {
    return board;
  } else {
    throw new Error("unable to create board");
  }
}

interface BoardsPaginationResult {
  boards: Board[];
  after: Date;
  nextCursor: Date;
  hasMore: boolean;
}

export const paginateBoards = async (
  mongo: MongoContext,
  after: Date,
  count: number
): Promise<BoardsPaginationResult> => {
  const result = await mongo
    .boards()
    .find({ createdAt: { $lt: after } })
    .sort({ createdAt: -1 })
    .limit(count + 1)
    .toArray();

  const hasMore = result && result.length > count;
  const lastIndex = hasMore ? count - 1 : result.length - 1;
  const boards = result && lastIndex >= 0 ? result.slice(0, lastIndex + 1) : [];
  const nextCursor =
    boards && boards.length > 0 ? boards[boards.length - 1].createdAt : after;

  return {
    boards,
    after,
    nextCursor,
    hasMore,
  };
};

export const findBoard = async (
  mongo: MongoContext,
  id: string,
) => {
  const result = await mongo.boards().findOne({ id });
  return result;
}
