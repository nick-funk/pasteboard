import { EnvironmentVariables } from "../domain/environment";
import express from "express";
import { injectable } from "tsyringe";

@injectable()
export default class ExpressProvider {
    private exp: express.Express;
    private env: EnvironmentVariables;

    constructor(env: EnvironmentVariables) {
        this.env = env;

        this.exp = express();
    }

    public instance () {
        return this.exp;
    }

    public start() {
        this.exp.listen(this.env.Port, () => {
            console.log(`listening on port ${this.env.Port}`);
        });
    }
}