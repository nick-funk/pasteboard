
import { injectable } from "tsyringe";
import bcrypt, { hash } from "bcrypt";
import { v4 as uuid } from "uuid";

import { DbInstance } from "../../data/db";
import User from "../models/user";

export class CreateUserResult {
    ok: boolean;
    message: string;
    user?: User;
}

@injectable()
export default class CreateUserCommand {
    private db: DbInstance;

    private saltRounds: number = 10;

    constructor(db: DbInstance) {
        this.db = db;
    }

    public async execute(
        email: string, 
        username: string, 
        pass: string,
        now: Date,
    ): Promise<CreateUserResult> 
    {
        const users = this.db.collection("users");

        const existing = await users.findOne({ 
            $or: [
                { email: { $eq: email  } },
                { username: { $eq: username  } }
            ]
        });

        if (existing) {
            return {
                ok: false,
                message: "username or email already exists"
            };
        }

        const hashPass = bcrypt.hashSync(pass, this.saltRounds);

        const user: User = {
            id: uuid(),
            email,
            username,
            hashPass,
            createdAt: now,
        };

        const result = (await users.insertOne(user)).result;

        if (!result.ok) {
            return {
                ok: false,
                message: "failed to create new user"
            };
        }

        return {
            ok: true,
            message: "successfully created new user",
            user: {
                id: user.id,
                email,
                username,
                createdAt: user.createdAt
            }
        };
    }
}