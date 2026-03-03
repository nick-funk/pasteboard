import React from "react";
import * as ReactDOMClient from "react-dom/client";

import { App } from "./app";
import { Board } from "./models/board";

interface Config {
  board: Board | null;
}

const loadConfig = (): Config => {
  const el = document.getElementById("config");
  if (!el) {
    return {
      board: null
    };
  }

  const rawConfig = el.innerText.replace(/&quot;/g, "\"").trim();
  if (!rawConfig || rawConfig === "") {
    return {
      board: null
    };
  }

  const config = JSON.parse(rawConfig) as Config;

  return config;
}

const run = async () => {
  const appContainer = document.getElementById("app");
  if (!appContainer) {
    console.error("unable to find app element");
    return;
  }

  const config = loadConfig();

  const root = ReactDOMClient.createRoot(appContainer);
  root.render(<App board={config.board} />);
}

document.addEventListener("DOMContentLoaded", () => {
  void run();
});