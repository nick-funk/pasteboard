import express from "express";
import { injectable } from "tsyringe";
import nunjucks from "nunjucks";
import path from "path";
import rateLimit from "express-rate-limit";

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
        
        const limiter = rateLimit({
            windowMs: 10 * 60 * 1000,
            max: 100
        });

        this.api.get("/", limiter, (req, res) => {
            const view = nunjucks.render("src/views/index.html", {});
            res.send(view);
        });
    }
}