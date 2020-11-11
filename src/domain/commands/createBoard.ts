import { DbInstance } from "../../data/db";
import Board from "../models/board";
import { injectable } from "tsyringe";

@injectable()
export default class CreateBoardCommand {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async execute(board: Board) {
        const boards = this.db.collection("boards");

        const existing = await boards.findOne({ 
            $or: [
                { id: { $eq: board.id } },
                { name: { $eq: board.name  } }
            ]
        });

        if (existing) {
            throw new Error("board with name or id already exists");
        }

        const result = (await boards.insertOne(board)).result;
        if (!result.ok) {
            throw new Error("failed to create new board");
        }

        return board;
    }
}