import MainDashboard from "./components/MainDashboard";
import HealthPage from "./components/HealthPage";
import BusinessInsightsPage from "./components/BusinessInsightsPage";
import { ToastProvider } from "./components/ui/ToastProvider";
import type { MotorReading, Alert, DashboardStats } from "./types";
import { useEffect, useState } from "react";
import { SIGNALR_URL } from "./services/api";
import * as signalR from "@microsoft/signalr";

function App() {
  const [readings, setReadings] = useState<MotorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [fastSpinCount, setAlert] = useState("");
  const [loading, setLoading] = useState(true);
  const [signalRConnected, setSignalRConnected] = useState(false);

  const [fastSpinCount2, setFastSpinCount] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark class to document element for Tailwind dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  const [maxReadings, setMaxReadings] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("page") || "dashboard";
  });

  // SignalR connection setup - moved from MainDashboard to App level
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL)
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        setSignalRConnected(true);
      })
      .catch((err) => {
        console.error("SignalR Connection Error:", err);
        setSignalRConnected(false);
      });

    connection.onclose(() => {
      console.log("SignalR Disconnected");
      setSignalRConnected(false);
    });

    return () => {
      connection.stop();
    };
  }, []);

  // Listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      setCurrentPage(urlParams.get("page") || "dashboard");
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  return (
    <ToastProvider>
      {currentPage === "health" ? (
        <HealthPage
          signalRConnected={signalRConnected}
          backendStatus={signalRConnected ? "connected" : "offline"}
        />
      ) : currentPage === "business-insights" ? (
        <BusinessInsightsPage
          signalRConnected={signalRConnected}
          backendStatus={signalRConnected ? "connected" : "offline"}
        />
      ) : (
        <MainDashboard
          readings={readings}
          setReadings={setReadings}
          alerts={alerts}
          setAlerts={setAlerts}
          dashboardStats={dashboardStats}
          setDashboardStats={setDashboardStats}
          _fastSpinCount={fastSpinCount}
          setAlert={setAlert}
          loading={loading}
          setLoading={setLoading}
          signalRConnected={signalRConnected}
          _setSignalRConnected={setSignalRConnected}
          _fastSpinCount2={fastSpinCount2}
          setFastSpinCount={setFastSpinCount}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          maxReadings={maxReadings}
          setMaxReadings={setMaxReadings}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      )}
    </ToastProvider>
  );
}

export default App;
