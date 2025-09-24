import MainDashboard from "./components/MainDashboard";
import HealthPage from "./components/HealthPage";
import { ToastProvider } from "./components/ui/ToastProvider";
import type { MotorReading, Alert, DashboardStats } from "./types";
import { useEffect, useState } from "react";

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
        <HealthPage />
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
          setSignalRConnected={setSignalRConnected}
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
