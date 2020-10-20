import express from "express";

import CreateBoardCommand from "../domain/commands/createBoard";
import { injectable } from "tsyringe";
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
        this.api.post("/createBoard", (req, res) => {
            this.createBoard.execute({
                id: "test",
                name: "test"
            });

            res.sendStatus(200);
        });
    }
}