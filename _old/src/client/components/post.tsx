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
        <div className="columns" style={{ position: "relative" }}>
          <div className="column is-full">
            <div
              style={{
                whiteSpace: "pre-wrap",
                overflow: "hidden",
                overflowWrap: "break-word",
                paddingRight: "12px",
              }}
            >
              {body}
            </div>
          </div>
          <button
            style={{
              position: "absolute",
              top: "16px",
              right: "2px",
            }}
            className="delete"
            onClick={onHandleDelete}
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
};
