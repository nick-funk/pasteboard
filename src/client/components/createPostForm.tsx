import React, {
  ChangeEvent,
  FunctionComponent,
  MouseEvent,
  useCallback,
  useState,
} from "react";

import { Post } from "../models/post";

interface Props {
  boardID: string;
  onCreated: (board: Post | null) => void;
}

export const CreatePostForm: FunctionComponent<Props> = ({
  boardID,
  onCreated,
}) => {
  const [body, setBody] = useState<string>("");

  const onSubmit = useCallback(
    async (ev: MouseEvent<HTMLInputElement>) => {
      ev.stopPropagation();
      ev.preventDefault();

      const response = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardID,
          body,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        onCreated(json);

        setBody("");
      }
    },
    [body, boardID, onCreated, setBody]
  );

  const onChangeBody = useCallback(
    (ev: ChangeEvent<HTMLTextAreaElement>) => {
      setBody(ev.target.value);
    },
    [setBody]
  );

  return (
    <div className="box">
      <form>
        <div className="field">
          <div className="control">
            <textarea
              id="body"
              name="body"
              value={body}
              onChange={onChangeBody}
              className="input is-normal"
            ></textarea>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <input
              type="submit"
              value="Post"
              onClick={onSubmit}
              className="button is-primary"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
