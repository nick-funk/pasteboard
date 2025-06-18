import { BoardNotFoundError } from "../../errors";
import { Board, formatObj } from "../models";
import { Db } from "../sql";

export class BoardRepository {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  public async seed() {
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS boards 
      (
        id TEXT PRIMARY KEY NOT NULL, 
        name TEXT, 
        createdAt DATETIME
      );`
    );
  }

  public async create(model: Board) {
    await this.db.run(
      `INSERT INTO boards (id, name, createdAt) VALUES (?, ?, ?);`,
      [model.id, model.name, model.createdAt]
    );

    return this.findByID(model.id);
  }

  public async all() {
    const rows = await this.db.select<Board>(
      `SELECT * FROM boards ORDER BY createdAt DESC;`, 
    );
    const boards = rows.map((r) => formatObj(r));

    return boards;
  }

  public async findByID(id: string) {
    const rows = await this.db.select<Board>(
      `SELECT * FROM boards WHERE id = ?;`,
      [id]
    );

    return rows.length > 0 ? formatObj(rows[0]) : null;
  }

  public async removeByID(id: string) {
    const existing = await this.findByID(id);
    if (!existing) {
      throw new BoardNotFoundError(id);
    }

    await this.db.run(
      `DELETE FROM boards WHERE id = ?;`,
      [id]
    );

    return existing;
  }
}