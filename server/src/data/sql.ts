import path from "path";

import { DatabaseSync, SQLInputValue } from "node:sqlite";
import { ensureDirectoryExists } from "../dir";

export class SqlContext {
  public readonly db: DatabaseSync;

  constructor(filePath: string) {
    const dir = path.dirname(filePath);
    ensureDirectoryExists(dir);

    this.db = new DatabaseSync(filePath, { open: true });
  }

  public select(query: string, params: SQLInputValue[] = []) {
    const cmd = this.db.prepare(query);
    return cmd.all(...params);
  }

  public insert(query: string, params: SQLInputValue[] = []) {
    const cmd = this.db.prepare(query);
    return cmd.run(...params);
  }
}