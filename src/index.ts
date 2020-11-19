import "reflect-metadata";

import dotenv from "dotenv";
import { container } from "tsyringe";

import { EnvironmentVariables } from "./domain/environment";
import { Main } from "./domain/main";
import { DbInstance } from "./data/db";
import ExpressProvider from "./api/expressProvider";
import BoardController from "./api/boardController";
import PostController from "./api/postController";
import CreateBoardCommand from "./domain/commands/createBoard";
import CreatePostCommand from "./domain/commands/createPost";
import ControllerSet from "./api/controllerSet";
import GetPostsForBoardQuery from "./domain/queries/getPostsForBoard";
import StaticController from "./api/staticController";
import GetBoardsQuery from "./domain/queries/getBoards";
import GetBoardQuery from "./domain/queries/getBoard";

dotenv.config();

const run = async () => {
    // Core
    container.registerSingleton<Main>(Main);
    container.register<EnvironmentVariables>(EnvironmentVariables, { useClass: EnvironmentVariables });

    container.registerSingleton<CreateBoardCommand>(CreateBoardCommand);
    container.registerSingleton<CreatePostCommand>(CreatePostCommand);

    container.registerSingleton<GetPostsForBoardQuery>(GetPostsForBoardQuery);
    container.registerSingleton<GetBoardsQuery>(GetBoardsQuery);
    container.registerSingleton<GetBoardQuery>(GetBoardQuery);

    // Data
    const db = new DbInstance(container.resolve(EnvironmentVariables));
    await db.initialize();
    container.registerInstance<DbInstance>(DbInstance, db);

    // API
    container.registerSingleton<ExpressProvider>(ExpressProvider);

    container.registerSingleton<StaticController>(StaticController);
    container.registerSingleton<BoardController>(BoardController);
    container.registerSingleton<PostController>(PostController);
    container.registerSingleton<ControllerSet>(ControllerSet);

    // Start up
    const main = container.resolve(Main);
    main.run();
}

run();