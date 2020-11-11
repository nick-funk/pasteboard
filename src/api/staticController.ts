import express from "express";
import { injectable } from "tsyringe";
import nunjucks from "nunjucks";
import path from "path";

import ExpressProvider from "./expressProvider";
import { Controller } from "./controller";

@injectable()
export default class StaticController implements Controller {
    private api: express.Express;

    constructor(exp: ExpressProvider) {
        this.api = exp.instance();
    }

    public initialize() {
        this.api.use("/static", express.static(path.resolve("./static")));
        
        this.api.get("/", (req, res) => {
            const view = nunjucks.render("src/views/index.html", {});
            res.send(view);
        });
    }
}