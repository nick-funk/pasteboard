import React, {
  ChangeEvent,
  FunctionComponent,
  MouseEvent,
  useCallback,
  useState,
} from "react";

import { Board } from "../models/board";

interface Props {
  onCreated: (board: Board | null) => void;
}

export const CreateBoardForm: FunctionComponent<Props> = ({ onCreated }) => {
  const [name, setName] = useState<string>("");

  const onSubmit = useCallback(
    async (ev: MouseEvent<HTMLInputElement>) => {
      ev.stopPropagation();
      ev.preventDefault();

      const response = await fetch("/api/board/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        onCreated(json);
      }
    },
    [name]
  );

  const onChangeName = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setName(ev.target.value);
    },
    [setName]
  );

  return (
    <div className="box">
      <form>
        <div className="field">
          <label htmlFor="name" className="label">
            Name:
          </label>
          <div className="control">
            <input
              type="text"
              id="name"
              name="name"
              className="input is-normal"
              onChange={onChangeName}
            />
          </div>
        </div>
        <div className="control">
          <input
            type="submit"
            value="Create"
            onClick={onSubmit}
            className="button is-primary"
          />
        </div>
      </form>
    </div>
  );
};
