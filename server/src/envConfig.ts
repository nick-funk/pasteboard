import { config } from "dotenv";

export class EnvConfig {
  public readonly port: number;
  public readonly host: string;
  public readonly dbFilename: string;

  constructor() {
    config();

    this.port = this.readInt(process.env.PORT, 3000);
    this.host = process.env.HOST ?? "localhost";

    this.dbFilename = process.env.DB_FILENAME ?? "./tmp/data.db";
  }

  private readInt(value: string | undefined, defaultVal: number) {
    if (value === undefined || value.length === 0) {
      return defaultVal;
    }

    try {
      return parseInt(value, 10);
    } catch {
      return defaultVal;
    }
  }
}