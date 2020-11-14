import express from "express";
import { injectable } from "tsyringe";
import { v4 as uuid } from "uuid";
import nunjucks from "nunjucks";

import CreateBoardCommand from "../domain/commands/createBoard";
import ExpressProvider from "./expressProvider";
import { Controller } from "./controller";
import GetPostsForBoardQuery from "../domain/queries/getPostsForBoard";
import GetBoardsQuery from "../domain/queries/getBoards";

@injectable()
export default class BoardController implements Controller {
    private api: express.Express;
    private createBoard: CreateBoardCommand;
    private getPosts: GetPostsForBoardQuery;
    private getBoards: GetBoardsQuery;

    constructor(
        exp: ExpressProvider, 
        createBoard: CreateBoardCommand, 
        getPosts: GetPostsForBoardQuery,
        getBoards: GetBoardsQuery,
    ) {
        this.api = exp.instance();
        this.createBoard = createBoard;
        this.getPosts = getPosts;
        this.getBoards = getBoards;
    }

    public initialize() {
        this.api.get("/board/:boardId", async (req, res) => {
            try {
                const boardId = req.params.boardId;
                if (!boardId) {
                    res.sendStatus(404);
                    return;
                }

                const now = new Date();
                const posts = await this.getPosts.query(boardId, 10, now);

                const view = nunjucks.render("src/views/board.html", { id: boardId, posts });
                res.send(view);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });

        this.api.post("/api/board/create", async (req, res) => {
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

        this.api.get("/boards", async (req, res) => {
            try {
                const now = new Date();
                const boards = await this.getBoards.query(now);

                const view = nunjucks.render("src/views/boards.html", { boards });
                res.send(view);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
    }
}