import { config } from "dotenv";

export class Config {
  public readonly port: number;
  public readonly host: string;
  public readonly dbFile: string;

  constructor() {
    config();

    this.port = this.parseInt(process.env.PORT, 8493);
    this.host = process.env.HOST ?? "localhost";
    this.dbFile = process.env.DB_FILE ?? "db/data.db";
  }

  private parseInt(value: string | null | undefined, defaultValue: number): number {
    if (!value) {
      return defaultValue;
    }

    try {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        return defaultValue;
      }

      return num;
    } catch (err) {
      return defaultValue;
    }
  }
}