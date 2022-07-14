import React, { FunctionComponent, useCallback } from "react";

interface Props {
  id: string;
  body: string;

  onDelete: (id: string) => void;
}

export const Post: FunctionComponent<Props> = ({ id, body, onDelete }) => {
  const onHandleDelete = useCallback(async () => {
    const response = await fetch("/api/post/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (response.ok) {
      onDelete(id);
    }
  }, [id]);

  return (
    <div id={`post-${id}`} className="column">
      <div className="box">
        <div className="columns">
          <div className="column is-full">
            <div style={{ paddingRight: "30px" }}>{body}</div>
          </div>
          <div className="column">
            <button
              style={{ position: "relative", marginLeft: "-36px" }}
              className="delete"
              onClick={onHandleDelete}
            >
              delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
