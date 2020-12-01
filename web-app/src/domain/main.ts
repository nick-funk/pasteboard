import { injectable } from "tsyringe";

import ExpressProvider from "../api/expressProvider";
import ControllerSet from "../api/controllerSet";

@injectable()
export class Main {
    private exp: ExpressProvider;
    private controllers: ControllerSet;

    constructor(exp: ExpressProvider, controllers: ControllerSet) {
        this.exp = exp;
        this.controllers = controllers;
    }

    public run() {
        this.controllers.all().forEach(c => c.initialize());

        this.setupErrorHandling();

        this.exp.start();
    }

    private setupErrorHandling() {
        this.exp.instance().use((error, _req, res, _next) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }

            return res.status(500)
                    .json({ error: error.toString() });
        });
    }
}