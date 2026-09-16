import React from "react";
import ReactDOM from "react-dom";
import { QueryProvider } from "./providers/QueryProvider";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>
);
