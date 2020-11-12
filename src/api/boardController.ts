import express from "express";
import { injectable } from "tsyringe";
import { v4 as uuid } from "uuid";
import nunjucks from "nunjucks";

import CreateBoardCommand from "../domain/commands/createBoard";
import ExpressProvider from "./expressProvider";
import { Controller } from "./controller";
import GetPostsForBoardQuery from "../domain/queries/getPostsForBoard";

@injectable()
export default class BoardController implements Controller {
    private api: express.Express;
    private createBoard: CreateBoardCommand;
    private getPosts: GetPostsForBoardQuery;

    constructor(
        exp: ExpressProvider, 
        createBoard: CreateBoardCommand, 
        getPosts: GetPostsForBoardQuery
    ) {
        this.api = exp.instance();
        this.createBoard = createBoard;
        this.getPosts = getPosts;
    }

    public initialize() {
        this.api.get("/board/:boardId", async (req, res) => {
            const boardId = req.params.boardId;
            if (!boardId) {
                res.sendStatus(404);
                return;
            }

            const now = new Date();
            const posts = await this.getPosts.query(boardId, 10, now);

            const view = nunjucks.render("src/views/board.html", { id: boardId, posts });
            res.send(view);
        });

        this.api.post("/api/board/create", async (req, res) => {
            try {
                const name = req.body.name;
                const now = new Date();

                if (!name) {
                    res.status(400);
                    res.send("must provide a name for the board");
                    return;
                }

                const board = await this.createBoard.execute({
                    id: uuid(),
                    name: name,
                    createdAt: now,
                });

                res.status(200);
                res.send(board);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
    }
}