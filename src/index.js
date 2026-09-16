import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { QueryProvider } from "./providers/QueryProvider";
import * as Sentry from "@sentry/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Initialize Sentry
Sentry.init({
  dsn: "https://48eb9267c96aaa0aec3e0ecac0b8f0b5@o4509577258401792.ingest.de.sentry.io/4509577263513680",
  sendDefaultPii: true,
});

// Custom Console Branding
console.log(`
  ╔════════════════════════════╗
  ║      PRABHABI INFOCOM      ║
  ╚════════════════════════════╝
`);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <QueryProvider>
      <Sentry.ErrorBoundary fallback={"An error has occurred"}>
        <App />
      </Sentry.ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  </Provider>
  // </React.StrictMode>
);

reportWebVitals();
