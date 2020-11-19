import { injectable } from "tsyringe";

import { DbInstance } from "../../data/db";
import Board from "../../domain/models/board";

@injectable()
export default class GetBoardsQuery {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async query(id: string): Promise<Board> {
        const posts = this.db.collection("boards");

        const query = { id };

        const item = 
            await posts.findOne(query);

        return item;
    }
}