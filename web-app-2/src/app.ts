import express from "express";
import nunjucks from "nunjucks";

import EnvironmentVariables from "./environmentVariables";

export default class App {
    private env: EnvironmentVariables;
    private app: express.Express;

    constructor(env: EnvironmentVariables) {
        this.env = env;
        this.app = express();
    }

    public async run() {
        nunjucks.configure("src/views", { autoescape: true });

        this.app.get("/", (req, res) => {
            res.send(nunjucks.render("index.html", {}));
        });

        this.app.listen(this.env.port, () => {
            console.log(`listening on ${this.env.port}...`);
        });
    }
}