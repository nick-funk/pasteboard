import express from "express";
import { injectable } from "tsyringe";
import { v4 as uuid } from "uuid";

import CreatePostCommand from "../domain/commands/createPost";
import ExpressProvider from "./expressProvider";
import { Controller } from "./controller";
import GetPostsForBoardQuery from "../domain/queries/getPostsForBoard";

@injectable()
export default class PostController implements Controller {
    private api: express.Express;
    private createPost: CreatePostCommand;
    private getPosts: GetPostsForBoardQuery;

    constructor(
        exp: ExpressProvider, 
        createPost: CreatePostCommand,
        getPosts: GetPostsForBoardQuery
    ) {
        this.api = exp.instance();
        this.createPost = createPost;
        this.getPosts = getPosts;
    }

    public initialize() {
        this.api.post("api/post/create", async (req, res) => {
            try {
                const body = req.body.body;
                const boardId = req.body.boardId;
                const now = new Date();

                if (!body) {
                    res.status(400);
                    res.send("must provide a body for the post");
                    return;
                }
                if (!boardId) {
                    res.status(400);
                    res.send("must provide a boardId for the post");
                    return;
                }

                const post = await this.createPost.execute({
                    id: uuid(),
                    boardId,
                    body,
                    createdAt: now,
                });

                res.status(200);
                res.send(post);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });

        this.api.get("api/posts", async (req, res) => {
            try {
                const boardId = req.body.boardId;
                const before = req.body.before ? new Date(req.body.before) : undefined;

                if (!boardId) {
                    res.status(400);
                    res.send("must provide a boardId to retrieve posts");
                    return;
                }

                const posts = await this.getPosts.query(boardId, 10, before);

                res.status(200);
                res.send(posts);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
    }
}