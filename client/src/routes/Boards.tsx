import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import { Config } from "../config";
import type { Board } from "../types";

interface BoardsResponse {
  boards: Board[];
}

export const BoardsPage: FunctionComponent = () => {
  const [boards, setBoards] = useState<Board[]>([]);

  const loadBoards = useCallback(async () => {
    const url = new URL("/boards", Config.serverUrl);
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      return;
    }

    const json = (await response.json()) as BoardsResponse;
    if (!json) {
      return;
    }

    setBoards(json.boards);
  }, []);

  useEffect(() => {
    loadBoards();
  }, []);

  return (
    <>
      <h1 className="title">Boards</h1>
      {boards.map((b) => {
        const viewUrl = `/board/${b.id}`;
        const editUrl = `/board/edit/${b.id}`;

        return (
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                <a key={b.id} href={viewUrl}>
                  {b.name}
                </a>
              </p>
            </header>
            <footer className="card-footer">
              <a href={viewUrl} className="card-footer-item">
                View
              </a>
              <a href={editUrl} className="card-footer-item">
                Edit
              </a>
              <a href="#" className="card-footer-item">
                Delete
              </a>
            </footer>
          </div>
        );
      })}
    </>
  );
};
