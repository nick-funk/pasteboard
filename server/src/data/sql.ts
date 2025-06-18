import { Database, RunResult } from "sqlite3";
import path from "path";
import fs from "fs";

export class Db {
  public readonly _db: Database;

  constructor(filename: string) {
    const dir = path.dirname(filename);
    this.ensureDirExists(dir);

    this._db = new Database(filename);
  }

  private ensureDirExists(dir: string) {
    try {
      fs.mkdirSync(dir);
    } catch {
      // ignore
    }
  }

  public async run(sql: string, params: any = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      this._db.run(sql, params, (result: RunResult, err: Error | null) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

  public async select<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this._db.all<T>(sql, ...params, (err: Error | null, rows: T[]) => {
        if (err) {
          reject(err);
        }

        resolve(rows);
      });
    });
  }
}