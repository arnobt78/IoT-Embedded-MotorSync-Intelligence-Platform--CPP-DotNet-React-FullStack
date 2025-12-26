// Backend migrated to Hetzner VPS (Coolify) - Dec 26, 2025
// Using sslip.io domain with valid Let's Encrypt SSL certificate
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
