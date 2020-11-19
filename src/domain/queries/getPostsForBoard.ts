import { injectable } from "tsyringe";

import Post from "../models/post";
import { DbInstance } from "../../data/db";

export interface PostsPaginationResult {
    posts: Post[];
    hasMore: boolean;
}

@injectable()
export default class GetPostsForBoardQuery {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async query(
        boardId: string, count: number = 10, before?: Date
    ): Promise<PostsPaginationResult> {
        const posts = this.db.collection("posts");

        const query = before ? 
            { boardId, createdAt: { $lt: before } } :
            { boardId }

        const items = 
            await posts.find(query)
                .sort({ createdAt: -1 })
                .limit(count + 1)
                .toArray();

        const result: PostsPaginationResult = {
            hasMore: items.length > count,
            posts: items.slice(0, 10),
        };

        return result;
    }
}