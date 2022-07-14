import React, { FunctionComponent, useCallback } from "react";

import { Board } from "../models/board";

interface Props {
  boards: Board[];
}

export const BoardList: FunctionComponent<Props> = ({ boards }) => {

  return (
    <div className="box">
      <div className="title">Boards:</div>
      <div>
        {boards.map((b) => {
          return (
            <div className="column">
              <a href={`/board/${b.id}`} className="button">{b.name}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
