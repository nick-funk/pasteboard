import { BoardRepository } from "./repositories/boards";
import { Db } from "./sql";

export class DataContext {
  public readonly db: Db;
  public readonly boards: BoardRepository;

  constructor(db: Db) {
    this.db = db;

    this.boards = new BoardRepository(this.db);
  }

  public async init() {
    await this.boards.seed();
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS post 
      (
        id TEXT PRIMARY KEY NOT NULL,
        boardID TEXT NOT NULL,
        createdAt DATETIME,
        value TEXT,
      );`
    );
  }
}