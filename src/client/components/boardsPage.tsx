import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  MouseEvent,
} from "react";

import { Board } from "../models/board";
import { CreateBoardForm } from "./createBoardForm";

export const BoardsPage: FunctionComponent = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string>(new Date().toISOString());

  const fetchData = useCallback(
    async (cursor: string, boards: Board[], paginating: boolean) => {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          after: cursor,
          count: 10,
        }),
      });

      if (response.ok) {
        const json = await response.json();

        if (paginating) {
          setBoards([...boards, ...json.boards]);
        } else {
          setBoards(json.boards);
        }

        setHasMore(json.hasMore);
        setCursor(json.nextCursor);
      }
    },
    [setBoards, setHasMore, setCursor]
  );

  useEffect(() => {
    fetchData(cursor, boards, false).catch(console.error);
  }, []);

  const onCreateBoard = useCallback(
    (board: Board | null) => {
      if (!board) {
        return;
      }

      setBoards([board, ...boards]);
    },
    [boards, setBoards]
  );

  const onLoadMore = useCallback(async () => {
    if (!hasMore) {
      return;
    }

    await fetchData(cursor, boards, true);
  }, [hasMore, cursor, boards]);

  const onDeleteBoard = useCallback(
    async (id: string, ev: MouseEvent<HTMLButtonElement>) => {
      const response = await fetch("/api/board/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (response.ok) {
        setBoards(boards.filter((b) => b.id !== id));
      }

      ev.stopPropagation();
    },
    [boards, setBoards]
  );

  return (
    <div>
      <div className="box">
        <div className="title">Boards:</div>
        <div style={{ maxWidth: "600px" }}>
          {boards.map((b) => {
            return (
              <div className="column">
                <div
                  className="card panel-block"
                  style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "space-between",
                    padding: "8px",
                    paddingLeft: "16px",
                    margin: "4px",
                  }}
                >
                  <a href={`/board/${b.id}`}>{b.name}</a>
                  <button
                    className="delete"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      onDeleteBoard(b.id, e);
                    }}
                  >
                    delete
                  </button>
                </div>
              </div>
            );
          })}
          {hasMore && (
            <div className="column">
              <button className="button is-primary" onClick={onLoadMore}>
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <CreateBoardForm onCreated={onCreateBoard} />
      </div>
    </div>
  );
};
