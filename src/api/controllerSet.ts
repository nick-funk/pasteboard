import { injectable } from "tsyringe";

import BoardController from "./boardController";
import { Controller } from "./controller";
import PostController from "./postController";
import StaticController from "./staticController";

@injectable()
export default class ControllerSet {
    private controllers: Controller[];

    constructor(
        boardController: BoardController,
        postController: PostController,
        staticController: StaticController,
    ) {
        this.controllers = [
            staticController,
            boardController,
            postController,
        ];
    }

    public all() {
        return this.controllers;
    }
}