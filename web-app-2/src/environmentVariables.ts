import { config } from "dotenv";

config();

export default class EnvironmentVariables {
    public readonly port: number;

    constructor() {
        this.port = process.env.PORT ? parseInt(process.env.PORT) : 7000;
    }
}

