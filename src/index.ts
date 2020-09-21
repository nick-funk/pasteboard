import "reflect-metadata";

import dotenv from "dotenv";
import { container } from "tsyringe";

import { EnvironmentVariables } from "domain/environment";
import { Main } from "domain/main";
import { DbInstance } from "data/db";

dotenv.config();

const run = async () => {
    // Core
    container.registerSingleton<Main>(Main);
    container.register<EnvironmentVariables>(EnvironmentVariables, { useClass: EnvironmentVariables });

    // Data
    const db = new DbInstance(container.resolve(EnvironmentVariables));
    await db.initialize();
    container.registerInstance<DbInstance>(DbInstance, db);

    // Start up
    const main = container.resolve(Main);
    main.run();
}

run();