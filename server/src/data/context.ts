import { BoardRepository } from "./repositories/boards";
import { PostsRepository } from "./repositories/posts";
import { Db } from "./sql";

export class DataContext {
  public readonly db: Db;
  public readonly boards: BoardRepository;
  public readonly posts: PostsRepository;

  constructor(db: Db) {
    this.db = db;

    this.boards = new BoardRepository(this.db);
    this.posts = new PostsRepository(this.db, this.boards);
  }

  public async init() {
    await this.boards.seed();
    await this.posts.seed();
  }
}