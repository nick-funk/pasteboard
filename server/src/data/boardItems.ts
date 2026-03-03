import { randomUUID } from "node:crypto";
import { SqlContext } from "./sql";

interface BoardItemRecord {
  id: string;
  boardId: string;
  body: string;
  createdAt: string;
}

export interface BoardItem {
  id: string;
  boardId: string;
  body: string;
  createdAt: Date;
}

export interface CreateBoardItemInput {
  boardId: string;
  body: string;
}

export class BoardItemsRepository {
  private readonly sql: SqlContext;

  constructor(sql: SqlContext) {
    this.sql = sql;

    this.sql.db.exec(`
      CREATE TABLE IF NOT EXISTS boardItems (
        id TEXT PRIMARY KEY,
        boardId TEXT NOT NULL,
        body TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
  }

  private mapRecordToApiType(record: BoardItemRecord): BoardItem {
    return {
      ...record,
      createdAt: new Date(record.createdAt),
    };
  }

  public all(boardId: string) {
    const results = this.sql.select(
      `SELECT * FROM boardItems WHERE boardId = ? ORDER BY createdAt DESC;`,
      [boardId],
    );

    const records: BoardItemRecord[] =
      results && results.length > 0
        ? results.map((r) => r as unknown as BoardItemRecord)
        : [];

    return records.map((r) => {
      return this.mapRecordToApiType(r)
    });
  }

  public findById(boardId: string, id: string): BoardItem | null {
    const results = this.sql.select(
      `
        SELECT * FROM boardItems WHERE boardId = ? AND id = ?;
      `,
      [boardId, id],
    );

    const record =
      results && results.length > 0
        ? (results[0] as unknown as BoardItemRecord)
        : null;

    if (!record) {
      return null;
    }

    return this.mapRecordToApiType(record);
  }

  public create(input: CreateBoardItemInput) {
    const id = randomUUID();
    const now = new Date();

    this.sql.insert(
      `INSERT INTO boardItems (
        id, boardId, body, createdAt
      ) VALUES (?, ?, ?, ?)`,
      [id, input.boardId, input.body, now.toISOString()],
    );

    return this.findById(input.boardId, id);
  }
}
