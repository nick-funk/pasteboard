import express from "express";
import { injectable } from "tsyringe";
import { v4 as uuid } from "uuid";
import nunjucks from "nunjucks";
import rateLimit from "express-rate-limit";

import CreateBoardCommand from "../domain/commands/createBoard";
import ExpressProvider from "./expressProvider";
import { Controller } from "./controller";
import GetPostsForBoardQuery from "../domain/queries/getPostsForBoard";
import GetBoardsQuery from "../domain/queries/getBoards";
import GetBoardQuery from "../domain/queries/getBoard";

@injectable()
export default class BoardController implements Controller {
    private api: express.Express;
    private createBoard: CreateBoardCommand;
    private getPosts: GetPostsForBoardQuery;
    private getBoards: GetBoardsQuery;
    private getBoard: GetBoardQuery;

    constructor(
        exp: ExpressProvider, 
        createBoard: CreateBoardCommand, 
        getPosts: GetPostsForBoardQuery,
        getBoards: GetBoardsQuery,
        getBoard: GetBoardQuery,
    ) {
        this.api = exp.instance();
        this.createBoard = createBoard;
        this.getPosts = getPosts;
        this.getBoards = getBoards;
        this.getBoard = getBoard;
    }

    public initialize() {
        const limiter = rateLimit({
            windowMs: 10 * 60 * 1000,
            max: 100
        });

        this.api.get("/board/:boardId", limiter, async (req, res) => {
            try {
                const boardId = req.params.boardId;
                if (!boardId) {
                    res.sendStatus(404);
                    return;
                }

                const board = await this.getBoard.query(boardId);
                if (!board) {
                    res.sendStatus(404);
                    return;
                }

                const now = new Date();
                const pagination = await this.getPosts.query(boardId, 10, now);

                const view = nunjucks.render("src/views/board.html", 
                    { 
                        id: board.id, 
                        name: board.name, 
                        posts: pagination.posts,
                        pagination: {
                            hasMore: pagination.hasMore,
                            cursor: pagination.hasMore 
                                ? pagination.posts[pagination.posts.length - 1].createdAt.toISOString()
                                : now.toISOString(),
                        }
                    }
                );
                res.send(view);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });

        this.api.get("/boards", limiter, async (req, res) => {
            try {
                const cursor = new Date();
                const result = await this.getBoards.query(cursor);

                const view = nunjucks.render(
                    "src/views/boards.html", 
                    {
                        boards: result.boards,
                        pagination: {
                            hasMore: result.hasMore,
                            cursor: result.hasMore
                                ? result.boards[result.boards.length - 1].createdAt.toISOString()
                                : cursor.toISOString()
                        }
                    }
                );

                res.send(view);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });

        this.api.get("/api/boards", limiter, async (req, res) => {
            try {
                const before: string | undefined = req.query.before as string;
                const cursor = before ? new Date(before) : new Date();

                const result = await this.getBoards.query(cursor);

                res.status(200);
                res.send({
                    boards: result.boards,
                    hasMore: result.hasMore,
                    cursor: result.hasMore
                        ? result.boards[result.boards.length - 1].createdAt.toISOString()
                        : cursor.toISOString()
                });
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });

        this.api.post("/api/board/create", limiter, async (req, res) => {
            try {
                const name = req.body.name;
                const now = new Date();

                if (!name) {
                    res.status(400);
                    res.send({ message: "must provide a name for the board" });
                    return;
                }

                const result = await this.createBoard.execute({
                    id: uuid(),
                    name: name,
                    createdAt: now,
                });

                if (!result.ok) {
                    res.status(400);
                    res.send({ message: result.message });
                    return;
                }

                res.status(200);
                res.send(result.board);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
    }
}