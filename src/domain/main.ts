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

        this.exp.start();
    }
}