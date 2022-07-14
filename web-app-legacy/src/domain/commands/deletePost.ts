import { injectable } from "tsyringe";

import { DbInstance } from "../../data/db";

export class DeletePostResult {
    ok: boolean;
    message: string;
}

@injectable()
export default class DeletePostCommand {
    private db: DbInstance;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async execute(id: string): Promise<DeletePostResult> {
        const posts = this.db.collection("posts");

        const op = await posts.findOneAndDelete({ id });

        return {
            ok: op.ok ? true : false,
            message: op.ok ? "successfully delete post" : "failed to delete post"
        };
    }
}