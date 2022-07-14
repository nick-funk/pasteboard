import express from "express";
import { injectable } from "tsyringe";
import rateLimit from "express-rate-limit";
import nunjucks from "nunjucks";

import ExpressProvider from "./expressProvider";
import { Controller } from "./controller";
import CreateUserCommand from "../domain/commands/createUser";

@injectable()
export default class UserController implements Controller {
    private api: express.Express;
    private createUser: CreateUserCommand;

    constructor(
        exp: ExpressProvider, 
        createUser: CreateUserCommand, 
    ) {
        this.api = exp.instance();
        this.createUser = createUser;
    }

    public initialize() {
        const limiter = rateLimit({
            windowMs: 10 * 60 * 1000,
            max: 100
        });

        this.api.get("/register", limiter, async (req, res) => {
            try {
                const view = nunjucks.render("src/views/register.html", {});
                res.send(view);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });

        this.api.post("/api/user/create", limiter, async (req, res) => {
            try {
                const email = req.body.email;
                const username = req.body.username;
                const pass: string = req.body.pass as string;
                const now = new Date();

                if (!email) {
                    res.status(400);
                    res.send({ message: "must provide an email for the new account" });
                    return;
                }

                if (!username) {
                    res.status(400);
                    res.send({ message: "must provide a username for the new account" });
                    return;
                }

                if (!pass) {
                    res.status(400);
                    res.send({ message: "must provide a password for the new account" });
                    return;
                }

                if (pass.length < 8 || pass.length > 128) {
                    res.status(400);
                    res.send({ message: "password must be between 8 and 128 characters in length" });
                    return;
                }

                const result = await this.createUser.execute(
                    email,
                    username,
                    pass,
                    now
                );

                if (!result.ok) {
                    res.status(400);
                    res.send({ message: result.message });
                    return;
                }

                res.status(200);
                res.send(result.user);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        });
    }
}