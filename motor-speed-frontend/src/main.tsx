// Backend migrated to Hetzner VPS (Coolify) but having SSL issue, no using DuckDNS domain for backend
// Backend URL configured via environment variables (VITE_API_URL)
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/toast.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
