import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import { Config } from "../../config";
import type { Board } from "../../types";

import "./Boards.css";

interface BoardsResponse {
  boards: Board[];
}

interface BoardItemProps {
  board: Board;
  onDelete: (id: string) => void;
}

export const BoardItem: FunctionComponent<BoardItemProps> = ({
  board,
  onDelete,
}) => {
  const viewUrl = `/board/${board.id}`;
  const editUrl = `/board/${board.id}/edit`;

  const [showModal, setShowModal] = useState<boolean>(false);

  const onConfirmDelete = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async () => {
    const url = new URL("/api/boards/delete", Config.serverUrl);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: board.id }),
    });

    if (!response.ok) {
      return;
    }

    setShowModal(false);
    onDelete(board.id);
  }, [board.id, onDelete]);

  const onCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            <a key={board.id} href={viewUrl}>
              {board.name}
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
          <button
            className="card-footer-item link"
            value="Delete"
            onClick={onConfirmDelete}
          >
            <span className="danger">Delete</span>
          </button>
        </footer>
      </div>
      {showModal && (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="card is-flex is-flex-direction-column p-5">
              <p className="mb-4">
                Are you sure you want to delete <span>{board.name}</span>?
              </p>
              <button className="is-danger button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={onCloseModal}
          ></button>
        </div>
      )}
    </>
  );
};

export const BoardsPage: FunctionComponent = () => {
  const [boards, setBoards] = useState<Board[]>([]);

  const loadBoards = useCallback(async () => {
    const url = new URL("/api/boards", Config.serverUrl);
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

  const onDelete = useCallback((id: string) => {
    setBoards((boards) => boards.filter((b) => b.id !== id));
  }, []);

  useEffect(() => {
    loadBoards();
  }, []);

  return (
    <>
      <h1 className="is-size-3 mb-2">Boards</h1>
      {boards.map((b) => (
        <BoardItem key={b.id} board={b} onDelete={onDelete} />
      ))}
    </>
  );
};
