import { config as init } from "dotenv";

export class EnvConfig {
  public readonly host: string;
  public readonly port: number;

  public readonly mongoURL: string;
  public readonly mongoDb: string;

  constructor() {
    init();

    this.host = process.env.SERVER_HOST ? process.env.SERVER_HOST : "0.0.0.0";
    this.port = process.env.SERVER_PORT
      ? parseInt(process.env.SERVER_PORT)
      : 7000;

    this.mongoURL = process.env.MONGO_URL ? process.env.MONGO_URL : "mongodb://localhost:27017";
    this.mongoDb = process.env.MONGO_DB ? process.env.MONGO_DB : "pasteboard";
  }

  private parseBool(value: string | null | undefined) {
    if (!value) {
      return false;
    }
  
    const lower = value.toLowerCase();
    if (lower === "true") {
      return true;
    }
    if (lower === "yes") {
      return true;
    }
    if (value === "1") {
      return true;
    }
  
    return false;
  }
}