import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Board } from "../models/board";
import { BoardList } from "./boardList";
import { CreateBoardForm } from "./createBoardForm";

export const BoardsPage: FunctionComponent = () => {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          after: new Date().toString(),
          count: 10,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        setBoards(json.boards);
      }
    };
    fetchData().catch(console.error);
  }, [setBoards]);

  const onCreateBoard = useCallback(
    (board: Board | null) => {
      if (!board) {
        return;
      }

      setBoards([board, ...boards]);
    },
    [boards, setBoards]
  );

  return (
    <div>
      <BoardList boards={boards} />
      <div>
        <CreateBoardForm onCreated={onCreateBoard} />
      </div>
    </div>
  );
};
