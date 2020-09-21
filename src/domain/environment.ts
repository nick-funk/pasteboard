import { injectable } from "tsyringe";

@injectable()
export class EnvironmentVariables {
    public MongoUrl: string;
    public MongoDataDbName: string;

    constructor() {
        this.MongoUrl = process.env.MONGO_URL;
        this.MongoDataDbName = process.env.MONGO_DATA_DB_NAME;
    }
}