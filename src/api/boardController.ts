import express from "express";
import { injectable } from "tsyringe";
import { v4 as uuid } from "uuid";

import CreateBoardCommand from "../domain/commands/createBoard";
import ExpressProvider from "./expressProvider";
import { Controller } from "./controller";

@injectable()
export default class BoardController implements Controller {
    private api: express.Express;
    private createBoard: CreateBoardCommand;

    constructor(exp: ExpressProvider, createBoard: CreateBoardCommand) {
        this.api = exp.instance();
        this.createBoard = createBoard;
    }

    public initialize() {
        this.api.post("api/board/create", async (req, res) => {
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