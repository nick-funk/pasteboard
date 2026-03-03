import { useCallback, useEffect, useState, type FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { Config } from "../config";
import type { Board } from "../types";

interface GetResponse {
  board?: Board | null;
}

export const BoardPage: FunctionComponent = () => {
  const { id } = useParams();

  const [board, setBoard] = useState<Board | null>(null);

  const loadBoard = useCallback(async () => {
    const url = new URL(`/boards/${id}`, Config.serverUrl);
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      return;
    }

    const json = await response.json() as GetResponse;
    if (!json || !json.board) {
      return;
    }

    setBoard(json.board);
  }, [id]);

  useEffect(() => {
    loadBoard();
  }, [id]);

  if (!board) {
    return <>Loading...</>
  }

  return <div className="is-flex is-flex-direction-column">
    <h1 className="is-size-3 mb-2">{board.name}</h1>
    <span>{id}</span>
  </div>
}
