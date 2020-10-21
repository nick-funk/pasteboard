import { DbInstance } from "../../data/db";
import Post from "../models/post";
import { injectable } from "tsyringe";

@injectable()
export default class CreateBoardCommand {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async execute(post: Post) {
        const boards = this.db.collection("boards");
        const posts = this.db.collection("posts");

        const boardExists = await boards.findOne({ id: post.boardId });
        if (!boardExists) {
            throw new Error("board does not exist");
        }

        const existing = await posts.findOne({ id: post.id });
        if (existing) {
            throw new Error("post with id already exists");
        }

        const result = (await posts.insertOne(post)).result;
        if (!result.ok) {
            throw new Error("failed to create new post");
        }

        return post;
    }
}