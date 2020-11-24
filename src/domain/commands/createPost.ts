import { injectable } from "tsyringe";
import escape from "escape-html";

import { DbInstance } from "../../data/db";
import Post from "../models/post";

export class CreatePostResult {
    ok: boolean;
    message: string;
    post?: Post;
}

@injectable()
export default class CreatePostCommand {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async execute(post: Post): Promise<CreatePostResult> {
        const boards = this.db.collection("boards");
        const posts = this.db.collection("posts");

        const boardExists = await boards.findOne({ id: post.boardId });
        if (!boardExists) {
            return {
                ok: false,
                message: "board does not exist"
            };
        }

        const existing = await posts.findOne({ id: post.id });
        if (existing) {
            return {
                ok: false,
                message: "post with id already exists"
            };
        }

        const cleanBody = escape(post.body);
        post.body = cleanBody;

        const update = await posts.insertOne(post);
        const result = update.result;

        if (!result.ok) {
            return {
                ok: false,
                message: "failed to create new post"
            };
        }

        const newPost = update.ops[0] as Post;

        return {
            ok: true,
            message: "successfully created new post",
            post: newPost
        };
    }
}