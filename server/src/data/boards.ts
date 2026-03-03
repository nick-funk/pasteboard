import { randomUUID } from "node:crypto";
import { SqlContext } from "./sql";

export interface Board {
  id: string;
  name: string;
}

export class BoardsRepository {
  private readonly sql: SqlContext;

  constructor(sql: SqlContext) {
    this.sql = sql;

    this.sql.db.exec(`
      CREATE TABLE IF NOT EXISTS boards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);
  }

  public findByName(name: string): Board | null {
    const existing = this.sql.select(`
      SELECT * FROM boards WHERE name = ?;  
    `, [name]);

    return existing && existing.length > 0 ?
      existing[0] as unknown as Board : null;
  }

  public findById(id: string): Board | null {
    const existing = this.sql.select(`
      SELECT * FROM boards WHERE id = ?;  
    `, [id]);

    return existing && existing.length > 0 ?
      existing[0] as unknown as Board : null;
  }

  public create(name: string) {
    const existing = this.findByName(name);
    if (existing) {
      return existing;
    }

    const id = randomUUID();
    this.sql.insert(
      `INSERT INTO boards (id, name) VALUES (?, ?)`,
      [id, name]
    );

    return this.findById(id);
  }

  public all(): Board[] {
    const results = this.sql.select(
      `SELECT * FROM boards;`
    );

    return results.map((r) => r as unknown as Board);
  }
}