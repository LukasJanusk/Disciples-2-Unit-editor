import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, HashRouter } from "react-router-dom";

const app = window.location.protocol === "file:" ? (
  <HashRouter>
    <App />
  </HashRouter>
) : (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>{app}</StrictMode>,
);
