import { DbInstance } from "../../data/db";
import Board from "../models/board";
import { injectable } from "tsyringe";

@injectable()
export default class CreateBoardCommand {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public execute(board: Board) {
        const boards = this.db.collection("boards");

        boards.insertOne(board);
    }
}