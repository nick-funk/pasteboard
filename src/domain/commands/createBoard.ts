import { DbInstance } from "../../data/db";
import Board from "../models/board";
import { injectable } from "tsyringe";

export class CreateBoardResult {
    ok: boolean;
    message: string;
    board?: Board;
}

@injectable()
export default class CreateBoardCommand {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async execute(board: Board): Promise<CreateBoardResult> {
        const boards = this.db.collection("boards");

        const existing = await boards.findOne({ 
            $or: [
                { id: { $eq: board.id } },
                { name: { $eq: board.name  } }
            ]
        });

        if (existing) {
            return {
                ok: false,
                message: "board with name or id already exists"
            };
        }

        const result = (await boards.insertOne(board)).result;
        if (!result.ok) {
            return {
                ok: false,
                message: "failed to create new board"
            };
        }

        return {
            ok: true,
            message: "successfully created new board",
            board
        };
    }
}