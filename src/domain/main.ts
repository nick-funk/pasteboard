import { injectable } from "tsyringe";

import { DbInstance } from "data/db";
import { Db } from "mongodb";

@injectable()
export class Main {
    private db: Db;

    constructor(db: DbInstance) {
        this.db = db.instance();
    }

    public run() {
        console.log("hello");
    }
}