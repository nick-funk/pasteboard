import { injectable } from "tsyringe";

import BoardController from "./boardController";
import { Controller } from "./controller";
import PostController from "./postController";

@injectable()
export default class ControllerSet {
    private controllers: Controller[];

    constructor(
        boardController: BoardController,
        postController: PostController,
    ) {
        this.controllers = [
            boardController,
            postController,
        ];
    }

    public all() {
        return this.controllers;
    }
}