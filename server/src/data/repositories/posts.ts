import { BoardNotFoundError, PostNotFoundError } from "../../errors";
import { formatObj, Post } from "../models";
import { Db } from "../sql";
import { BoardRepository } from "./boards";

export class PostsRepository {
  private db: Db;
  private boards: BoardRepository;

  constructor(db: Db, boards: BoardRepository) {
    this.db = db;
    this.boards = boards;
  }

  public async seed() {
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS posts
      (
        id TEXT PRIMARY KEY NOT NULL,
        boardID TEXT NOT NULL,
        createdAt DATETIME,
        value TEXT
      );`
    );
  }

  public async postsForBoard(boardID: string) {
    const rows = await this.db.select<Post>(
      `SELECT * FROM posts WHERE boardID = ? ORDER BY createdAt DESC;`,
      [boardID]
    );

    return rows.map((r) => formatObj(r));
  }

  public async find(boardID: string, id: string) {
    const rows = await this.db.select<Post>(
      `SELECT * FROM posts WHERE boardID = ? AND id = ?;`,
      [boardID, id]
    );

    return rows.length > 0 ? formatObj(rows[0]) : null;
  }

  public async remove(boardID: string, id: string) {
    const existing = await this.find(boardID, id);
    if (!existing) {
      throw new PostNotFoundError({ boardID, id });
    }

    await this.db.run(
      `DELETE FROM posts WHERE boardID = ? AND id = ?;`,
      [boardID, id]
    );

    return existing;
  }

  public async create(post: Post) {
    const board = await this.boards.findByID(post.boardID);
    if (!board) {
      throw new BoardNotFoundError(post.boardID);
    }

    await this.db.run(
      `
        INSERT INTO posts 
          (id, boardID, createdAt, value)
        VALUES
          (?, ?, ?, ?);
      `,
      [post.id, post.boardID, post.createdAt, post.value]
    );

    return await this.find(post.boardID, post.id);
  }
}