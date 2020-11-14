import { injectable } from "tsyringe";

import Post from "../models/post";
import { DbInstance } from "../../data/db";

@injectable()
export default class GetPostsForBoardQuery {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async query(
        boardId: string, count: number = 10, before?: Date
    ): Promise<Post[]> {
        const posts = this.db.collection("posts");

        const query = before ? 
            { boardId, createdAt: { $lt: before } } :
            { boardId }

        const items = 
            await posts.find(query)
                .sort({ createdAt: -1 })
                .limit(count)
                .toArray();

        return items;
    }
}