import { injectable } from "tsyringe";

import BoardController from "./boardController";
import { Controller } from "./controller";
import PostController from "./postController";
import StaticController from "./staticController";
import UserController from "./userController";

@injectable()
export default class ControllerSet {
    private controllers: Controller[];

    constructor(
        boardController: BoardController,
        postController: PostController,
        staticController: StaticController,
        userController: UserController,
    ) {
        this.controllers = [
            staticController,
            boardController,
            postController,
            userController,
        ];
    }

    public all() {
        return this.controllers;
    }
}