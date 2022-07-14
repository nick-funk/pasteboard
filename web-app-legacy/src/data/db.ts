import { injectable } from "tsyringe";
import { MongoClient, Db } from "mongodb"

import { EnvironmentVariables } from "../domain/environment";

@injectable()
export class DbInstance {
    private variables: EnvironmentVariables;
    private db: Db;

    constructor(variables: EnvironmentVariables) {
        this.variables = variables;
    }

    public async initialize() {
        const result = await MongoClient.connect(this.variables.MongoUrl);
        this.db = result.db(this.variables.MongoDataDbName);
    }

    public collection(name: string) {
        return this.db.collection(name);
    }

    public instance() {
        return this.db;
    }
}