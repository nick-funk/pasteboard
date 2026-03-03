import { BoardsRepository } from "./boards";
import { SqlContext } from "./sql";

export class DataContext {
  public readonly sql: SqlContext;
  public readonly boards: BoardsRepository;

  constructor(sql: SqlContext) {
    this.sql = sql;
    this.boards = new BoardsRepository(sql);
  }
}