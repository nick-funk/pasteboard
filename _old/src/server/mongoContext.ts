import { MongoClient, Db, Collection } from "mongodb";

import { Board } from "./models/board";
import { Post } from "./models/post";

export class MongoContext {
  public readonly mongoURL: string;
  public readonly dbName: string;
  
  private client: MongoClient;
  private db: Db;

  constructor(mongoURL: string, dbName: string) {
    this.mongoURL = mongoURL;
    this.dbName = dbName;

    this.client = new MongoClient(this.mongoURL);
    this.db = this.client.db(this.dbName);
  }

  public boards(): Collection<Board> {
    return this.db.collection<Readonly<Board>>("boards");
  }

  public posts(): Collection<Post> {
    return this.db.collection<Readonly<Post>>("posts");
  }
}