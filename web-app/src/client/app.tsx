import React, { FunctionComponent, useCallback, useState } from "react";
import { BoardPage } from "./components/boardPage";

import { BoardsPage } from "./components/boardsPage";
import { Board } from "./models/board";

interface Props {
  board: Board | null;
}

export const App: FunctionComponent<Props> = ({ board }) => {
  return (
    <>
      {!board && <BoardsPage />}
      {board && <BoardPage board={board} />}
    </>
  );
};
