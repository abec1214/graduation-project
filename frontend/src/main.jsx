// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // これだけでOK（CSSは読み込まない）

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
