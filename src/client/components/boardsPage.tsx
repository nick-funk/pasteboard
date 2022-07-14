import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
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

  return (
    <div>
      <div className="box">
        <div className="title">Boards:</div>
        <div>
          {boards.map((b) => {
            return (
              <div className="column">
                <a href={`/board/${b.id}`} className="button">
                  {b.name}
                </a>
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
