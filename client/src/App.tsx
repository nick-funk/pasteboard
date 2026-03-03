import type { FunctionComponent } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css"
import { BoardsPage } from "./routes/Boards";
import { BoardPage } from "./routes/Board";

export const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BoardsPage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
