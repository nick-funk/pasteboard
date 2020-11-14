import { DbInstance } from "../../data/db";
import Post from "../models/post";
import { injectable } from "tsyringe";

export class CreatePostResult {
    ok: boolean;
    message: string;
    post?: Post;
}

@injectable()
export default class CreateBoardCommand {
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
            }
        }

        const existing = await posts.findOne({ id: post.id });
        if (existing) {
            return {
                ok: false,
                message: "post with id already exists"
            }
        }

        const result = (await posts.insertOne(post)).result;
        if (!result.ok) {
            return {
                ok: false,
                message: "failed to create new post"
            }
        }

        return {
            ok: true,
            message: "successfully created new post",
            post: post
        };
    }
}