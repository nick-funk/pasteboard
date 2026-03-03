import type { FunctionComponent } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import clsx from "clsx";

import "./App.css";
import { BoardsPage } from "./routes/Boards/Boards";
import { BoardPage } from "./routes/Board";
import { CreateBoardPage } from "./routes/CreateBoard";
import { EditBoardPage } from "./routes/EditBoard";

const Nav: FunctionComponent = () => {
  const location = useLocation();

  console.log(location, location.pathname.startsWith("/boards"));

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div id="main" className="navbar-menu">
        <div className={"navbar-item has-dropdown is-hoverable"}>
          <a className={"navbar-link"} href="/boards">
            <span>Boards</span>
          </a>

          <div className="navbar-dropdown">
            <a className={clsx("navbar-item", {
              "is-selected": location.pathname === "/" || location.pathname === "/boards"
            })} href="/boards">
              All
            </a>
            <a className={clsx("navbar-item", {
              "is-selected": location.pathname === "/board/create"
            })} href="/board/create">
              Create
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<BoardsPage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
        <Route path="/board/:id/edit" element={<EditBoardPage />} />
        <Route path="/board/create" element={<CreateBoardPage />} />
      </Routes>
    </BrowserRouter>
  );
};
