import express from "express";
import { injectable } from "tsyringe";
import { v4 as uuid } from "uuid";
import rateLimit from "express-rate-limit";

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
        const limiter = rateLimit({
            windowMs: 10 * 60 * 1000,
            max: 100
        });

        this.api.post("/api/post/create", limiter, async (req, res) => {
            try {
                const body = req.body.body;
                const boardId = req.body.boardId;
                const now = new Date();

                if (!body) {
                    res.status(400);
                    res.send({ message: "must provide a body for the post" });
                    return;
                }
                if (!boardId) {
                    res.status(400);
                    res.send({ message: "must provide a boardId for the post" });
                    return;
                }

                const result = await this.createPost.execute({
                    id: uuid(),
                    boardId,
                    body,
                    createdAt: now,
                });

                if (!result.ok) {
                    res.status(400);
                    res.send({ message: result.message });
                    return;
                }

                res.status(200);
                res.send(result.post);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });

        this.api.get("/api/posts", limiter, async (req, res) => {
            try {
                const boardId: string | undefined = req.query.boardId as string;
                const before: string | undefined = req.query.before as string;
                const cursor = before ? new Date(before) : undefined;

                if (!boardId) {
                    res.status(400);
                    res.send({ message: "must provide a boardId to retrieve posts" });
                    return;
                }

                const result = await this.getPosts.query(boardId, 10, cursor);

                res.status(200);
                res.send({
                    posts: result.posts,
                    hasMore: result.hasMore,
                    cursor: result.hasMore 
                        ? result.posts[result.posts.length - 1].createdAt.toISOString()
                        : new Date().toISOString()
                });
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
    }
}