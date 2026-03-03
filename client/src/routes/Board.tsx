import { useCallback, useEffect, useState, type FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { Config } from "../config";
import type { Board, BoardItem } from "../types";
import { CreateItemForm } from "../components/CreateBoardItem/CreateBoardItemForm";

interface GetResponse {
  board?: Board | null;
}

interface ItemsResponse {
  board?: Board | null;
  items: BoardItem[];
}

interface ItemProps {
  item: BoardItem;
}

export const Item: FunctionComponent<ItemProps> = ({ item }) => {
  return <div className="card p-2">
    <textarea className="input" value={item.body} readOnly></textarea>
  </div>
}

export const BoardPage: FunctionComponent = () => {
  const { id } = useParams();

  const [board, setBoard] = useState<Board | null>(null);
  const [items, setItems] = useState<BoardItem[]>([]);

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

  const loadItems = useCallback(async () => {
    const url = new URL(`/boards/${id}/items`, Config.serverUrl);
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      return;
    }

    const json = await response.json() as ItemsResponse;
    if (!json || !json.board || !json.items) {
      return;
    }

    setItems(json.items);
  }, [id]);

  const onCreate = useCallback((item: BoardItem) => {
    setItems((items) => [item, ...items]);
  }, []);

  useEffect(() => {
    loadBoard();
    loadItems();
  }, [id]);

  if (!board || !id) {
    return <>Loading...</>
  }

  return <div className="is-flex is-flex-direction-column">
    <h1 className="is-size-3 mb-2">{board.name}</h1>
    <CreateItemForm boardId={id} onCreate={onCreate} />

    {items.map((i) => <Item key={i.id} item={i} />)}
  </div>
}
