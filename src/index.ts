import "reflect-metadata";

import dotenv from "dotenv";
import { container } from "tsyringe";

import { EnvironmentVariables } from "./domain/environment";
import { Main } from "./domain/main";
import { DbInstance } from "./data/db";
import ExpressProvider from "./api/expressProvider";
import BoardController from "./api/boardController";
import CreateBoardCommand from "./domain/commands/createBoard";
import ControllerSet from "./api/controllerSet";

dotenv.config();

const run = async () => {
    // Core
    container.registerSingleton<Main>(Main);
    container.register<EnvironmentVariables>(EnvironmentVariables, { useClass: EnvironmentVariables });

    container.registerSingleton<CreateBoardCommand>(CreateBoardCommand);

    // Data
    const db = new DbInstance(container.resolve(EnvironmentVariables));
    await db.initialize();
    container.registerInstance<DbInstance>(DbInstance, db);

    // API
    container.registerSingleton<ExpressProvider>(ExpressProvider);

    container.registerSingleton<BoardController>(BoardController);
    container.registerSingleton<ControllerSet>(ControllerSet);

    // Start up
    const main = container.resolve(Main);
    main.run();
}

run();