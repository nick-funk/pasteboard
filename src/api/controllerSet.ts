import { injectable } from "tsyringe";

import BoardController from "./boardController";
import { Controller } from "./controller";

@injectable()
export default class ControllerSet {
    private controllers: Controller[];

    constructor(boardController: BoardController ) {
        this.controllers = [
            boardController,
        ];
    }

    public all() {
        return this.controllers;
    }
}