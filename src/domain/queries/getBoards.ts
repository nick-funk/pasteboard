import { injectable } from "tsyringe";

import { DbInstance } from "../../data/db";
import Board from "../../domain/models/board";

@injectable()
export default class GetBoardsQuery {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async query(before: Date = new Date(), count: number = 10): Promise<Board[]> {
        const posts = this.db.collection("boards");

        const query = { createdAt: { $lt: before } };

        const items = 
            await posts.find(query)
                .sort({ createdAt: -1 })
                .limit(count)
                .toArray();

        return items;
    }
}