import AlertSystem from "./AlertSystem";
import AdvancedAnalyticsDashboard from "./AdvancedAnalyticsDashboard";
import AnimatedMotor from "./AnimatedMotor";
// import ColorLegend from "./ColorLegend";
import DailyLifeApplications from "./DailyLifeApplications";
import DashboardStatsComponent from "./DashboardStats";
import EdgeComputingDashboard from "./EdgeComputingDashboard";
import IndustrialManagementDashboard from "./IndustrialManagementDashboard";
import IoTCloudIntegration from "./IoTCloudIntegration";
import MobileDashboard from "./MobileDashboard";
import MotorChart from "./MotorChart";
import MotorControlDashboard from "./MotorControlDashboard";
import MotorSpinner from "./MotorSpinner";
import NavBar from "./NavBar";
import PredictiveMaintenanceDashboard from "./PredictiveMaintenanceDashboard";
import ReadingList from "./ReadingList";
import SensorDashboard from "./SensorDashboard";
import SettingsModal from "./SettingsModal";
import AnimatedGearIcon from "./ui/AnimatedGearIcon";
import { PhysicsFormulaTooltip } from "./ui/PhysicsFormulaTooltip";
import { formatTimestamp } from "../lib/dateUtils";
import { API_BASE_URL } from "../services/api";
import type { MotorReading, Alert, DashboardStats } from "../types";
import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";

interface MainDashboardProps {
  // Props that will be passed from App.tsx
  readings: MotorReading[];
  setReadings: React.Dispatch<React.SetStateAction<MotorReading[]>>;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  dashboardStats: DashboardStats | null;
  setDashboardStats: React.Dispatch<
    React.SetStateAction<DashboardStats | null>
  >;
  _fastSpinCount: string;
  setAlert: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  signalRConnected: boolean;
  _setSignalRConnected: React.Dispatch<React.SetStateAction<boolean>>;
  _fastSpinCount2: number;
  setFastSpinCount: React.Dispatch<React.SetStateAction<number>>;
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  maxReadings: number;
  setMaxReadings: React.Dispatch<React.SetStateAction<number>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MainDashboard({
  readings,
  setReadings,
  alerts,
  setAlerts,
  dashboardStats,
  setDashboardStats,
  //fastSpinCount,
  // setAlert is not used in this component
  loading,
  setLoading,
  signalRConnected,
  // setSignalRConnected is not used in this component (managed in App.tsx)
  //fastSpinCount2,
  setFastSpinCount,
  settingsOpen,
  setSettingsOpen,
  darkMode,
  setDarkMode,
  maxReadings,
  setMaxReadings,
  isGenerating,
  setIsGenerating,
}: MainDashboardProps) {
  // Backend status tracking - based on SignalR connection
  const backendStatus = signalRConnected ? "connected" : "offline";

  // Force re-render counter
  const [forceUpdate, setForceUpdate] = useState(0);

  // Get latest reading for display - use useMemo to ensure it updates
  const latestReading = useMemo(() => {
    console.log(
      "🔄 latestReading useMemo recalculating:",
      readings.length,
      readings[0]?.id
    );
    return readings.length > 0 ? readings[0] : null;
  }, [readings]);

  // Determine data source status for status indicators
  const dataSource =
    latestReading && signalRConnected && backendStatus === "connected"
      ? "backend"
      : "offline";

  // Debug: Log readings state changes
  useEffect(() => {
    console.log(
      "🔄 Readings state changed:",
      readings.length,
      readings[0]?.id,
      readings[0]?.speed
    );
    console.log(
      "🔄 Full readings array:",
      readings.map((r) => ({ id: r.id, speed: r.speed }))
    );
    console.log(
      "🔄 latestReading variable:",
      latestReading?.id,
      latestReading?.speed
    );
  }, [readings, latestReading]);

  // SignalR connection is now handled at App level

  // CSV export helper
  function exportCsv() {
    if (!readings.length) return;
    const header =
      "ID,Speed (RPM),Temperature (°C),Timestamp,Title,MachineId,Status," +
      "VibrationX,VibrationY,VibrationZ,Vibration," +
      "OilPressure,AirPressure,HydraulicPressure," +
      "CoolantFlowRate,FuelFlowRate," +
      "Voltage,Current,PowerFactor,PowerConsumption," +
      "RPM,Torque,Efficiency," +
      "Humidity,AmbientTemperature,AmbientPressure," +
      "ShaftPosition,Displacement," +
      "StrainGauge1,StrainGauge2,StrainGauge3," +
      "SoundLevel,BearingHealth," +
      "OperatingHours,MaintenanceStatus,SystemHealth";
    const rows = readings.map(
      (r) =>
        `${r.id},${r.speed},${r.temperature},${r.timestamp},${r.title || ""},${
          r.machineId
        },${r.status},${r.vibrationX || ""},${r.vibrationY || ""},${
          r.vibrationZ || ""
        },${r.vibration || ""},${r.oilPressure || ""},${r.airPressure || ""},${
          r.hydraulicPressure || ""
        },${r.coolantFlowRate || ""},${r.fuelFlowRate || ""},${
          r.voltage || ""
        },${r.current || ""},${r.powerFactor || ""},${
          r.powerConsumption || ""
        },${r.rpm || ""},${r.torque || ""},${r.efficiency || ""},${
          r.humidity || ""
        },${r.ambientTemperature || ""},${r.ambientPressure || ""},${
          r.shaftPosition || ""
        },${r.displacement || ""},${r.strainGauge1 || ""},${
          r.strainGauge2 || ""
        },${r.strainGauge3 || ""},${r.soundLevel || ""},${
          r.bearingHealth || ""
        },${r.operatingHours || ""},${r.maintenanceStatus || ""},${
          r.systemHealth || ""
        }`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "motor_readings.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Compute highest/lowest temp and RPM notifications
  const highestTemp = readings.length
    ? readings.reduce((a, b) => (a.temperature > b.temperature ? a : b))
    : null;
  const lowestTemp = readings.length
    ? readings.reduce((a, b) => (a.temperature < b.temperature ? a : b))
    : null;
  const highestRpm = readings.length
    ? readings.reduce((a, b) => (a.speed > b.speed ? a : b))
    : null;
  const lowestRpm = readings.length
    ? readings.reduce((a, b) => (a.speed < b.speed ? a : b))
    : null;

  // Load dashboard stats
  const loadDashboardStats = useCallback(async () => {
    try {
      const response = await axios.get<DashboardStats>(
        `${API_BASE_URL}/api/motor/stats`
      );
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  }, [setDashboardStats]);

  // Delete all data function with passkey protection
  const deleteAllData = async () => {
    // First confirmation
    if (
      !confirm(
        "⚠️ WARNING: This will delete ALL motor readings permanently!\n\nAre you sure you want to continue?"
      )
    ) {
      return;
    }

    // Passkey protection
    const passkey = prompt(
      "🔒 Security Check Required\n\nEnter the admin passkey to delete all data:"
    );
    
    // Check passkey (you can change this to any secure passkey you want)
    const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || "motor2025";
    
    if (passkey !== ADMIN_PASSKEY) {
      alert("❌ Invalid passkey. Data deletion cancelled.");
      return;
    }

    // Final confirmation with passkey verified
    if (
      !confirm(
        "🔐 Passkey verified.\n\nThis is your FINAL confirmation. Delete ALL motor readings?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/motor/clear`);
      const result = response.data;

      // Clear local state
      setReadings([]);
      setDashboardStats(null);

      // Show success message
      alert(
        `✅ Successfully deleted ${result.clearedCount} readings from database.`
      );

      // Refresh dashboard stats
      await loadDashboardStats();
    } catch (error) {
      console.error("Failed to delete all data:", error);
      alert("❌ Failed to delete all data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Acknowledge alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  // Load readings - only real C++ data or offline
  useEffect(() => {
    // Load dashboard stats
    loadDashboardStats();

    // Load historical readings from database
    axios
      .get<MotorReading[]>(`${API_BASE_URL}/api/motor`)
      .then((res) => {
        setReadings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Note: Automatic data fetching has been removed - users will manually generate readings
    // This prevents automatic data generation on component mount
  }, [maxReadings, loadDashboardStats, setLoading, setReadings]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6`}>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <MotorSpinner />
        </div>
      )}

      <AlertSystem
        alerts={alerts}
        onAcknowledge={acknowledgeAlert}
        signalRConnected={signalRConnected}
        backendStatus={backendStatus}
      />

      <div className="max-w-9xl mx-auto">
        <NavBar darkMode={darkMode} />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height="40px"
                width="40px"
                version="1.1"
                id="Layer_1"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
              >
                <g transform="translate(1 1)">
                  <g>
                    <path
                      style={{ fill: "#FFDD09" }}
                      d="M45.933,319c-2.56,0-4.267-0.853-5.973-2.56c-3.413-3.413-3.413-8.533,0-11.947l217.6-217.6    c3.413-3.413,8.533-3.413,11.947,0s3.413,8.533,0,11.947L52.76,316.44C51.053,318.147,48.493,319,45.933,319z"
                    />
                    <path
                      style={{ fill: "#FFDD09" }}
                      d="M493.933,451.267c-5.12,0-8.533-3.413-8.533-8.533v-307.2c0-5.12,3.413-8.533,8.533-8.533    c5.12,0,8.533,3.413,8.533,8.533v307.2C502.467,447.853,499.053,451.267,493.933,451.267z"
                    />
                    <path
                      style={{ fill: "#FFDD09" }}
                      d="M442.733,502.467h-0.853l-358.4-51.2c-4.267-0.853-7.68-5.12-6.827-9.387s5.12-7.68,9.387-6.827    l358.4,51.2c4.267,0.853,7.68,5.12,6.827,9.387C450.413,499.053,447,502.467,442.733,502.467z"
                    />
                    <path
                      style={{ fill: "#FFDD09" }}
                      d="M502.467,442.733c0,33.28-26.453,59.733-59.733,59.733S383,476.013,383,442.733    S409.453,383,442.733,383S502.467,409.453,502.467,442.733"
                    />
                  </g>
                  <path
                    style={{ fill: "#FD9808" }}
                    d="M442.733,383c-4.267,0-8.533,0.853-12.8,1.707c26.453,5.973,46.933,29.867,46.933,58.027   c0,28.16-20.48,52.053-46.933,58.027c4.267,0.853,8.533,1.707,12.8,1.707c33.28,0,59.733-26.453,59.733-59.733   S476.013,383,442.733,383"
                  />
                  <path
                    style={{ fill: "#FFDD09" }}
                    d="M92.867,280.6c-46.933,0-85.333,38.4-85.333,85.333s38.4,85.333,85.333,85.333   s85.333-38.4,85.333-85.333S139.8,280.6,92.867,280.6"
                  />
                  <path
                    style={{ fill: "#FD9808" }}
                    d="M92.867,280.6c-4.267,0-8.533,0.853-12.8,0.853c40.96,5.973,72.533,41.813,72.533,84.48   s-31.573,78.507-72.533,84.48c4.267,0,8.533,0.853,12.8,0.853c46.933,0,85.333-38.4,85.333-85.333S139.8,280.6,92.867,280.6"
                  />
                  <path
                    style={{ fill: "#54C9FD" }}
                    d="M92.867,400.067c-18.773,0-34.133-15.36-34.133-34.133S74.093,331.8,92.867,331.8   S127,347.16,127,365.933S111.64,400.067,92.867,400.067"
                  />
                  <path
                    style={{ fill: "#33A9F8" }}
                    d="M92.867,331.8c-4.267,0-8.533,0.853-12.8,2.56c12.8,5.12,21.333,17.067,21.333,31.573   s-8.533,26.453-21.333,31.573c4.267,1.707,8.533,2.56,12.8,2.56c18.773,0,34.133-15.36,34.133-34.133S111.64,331.8,92.867,331.8"
                  />
                  <path
                    style={{ fill: "#FFDD09" }}
                    d="M502.467,135.533c0,70.827-57.173,128-128,128s-128-57.173-128-128s57.173-128,128-128   S502.467,64.707,502.467,135.533"
                  />
                  <path
                    style={{ fill: "#FD9808" }}
                    d="M374.467,7.533c-2.56,0-5.973,0-8.533,0.853C432.493,12.653,485.4,68.12,485.4,135.533   s-52.907,122.88-119.467,127.147c2.56,0,5.973,0.853,8.533,0.853c70.827,0,128-57.173,128-128S445.293,7.533,374.467,7.533"
                  />
                  <path
                    style={{ fill: "#54C9FD" }}
                    d="M374.467,41.667c-52.053,0-93.867,41.813-93.867,93.867s41.813,93.867,93.867,93.867   s93.867-41.813,93.867-93.867S426.52,41.667,374.467,41.667"
                  />
                  <path
                    style={{ fill: "#33A9F8" }}
                    d="M374.467,41.667c-2.56,0-5.973,0-8.533,0.853c47.787,4.267,85.333,44.373,85.333,93.013   s-37.547,88.747-85.333,93.013c2.56,0,5.973,0.853,8.533,0.853c52.053,0,93.867-41.813,93.867-93.867S426.52,41.667,374.467,41.667   "
                  />
                  <path
                    style={{ fill: "#FFDD09" }}
                    d="M374.467,161.133c-14.507,0-25.6-11.093-25.6-25.6s11.093-25.6,25.6-25.6   c14.507,0,25.6,11.093,25.6,25.6S388.973,161.133,374.467,161.133"
                  />
                  <path d="M374.467,272.067c-75.093,0-136.533-61.44-136.533-136.533S299.373-1,374.467-1S511,60.44,511,135.533   S449.56,272.067,374.467,272.067z M374.467,16.067C308.76,16.067,255,69.827,255,135.533S308.76,255,374.467,255   s119.467-53.76,119.467-119.467S440.173,16.067,374.467,16.067z" />
                  <path d="M442.733,511c-37.547,0-68.267-30.72-68.267-68.267s30.72-68.267,68.267-68.267S511,405.187,511,442.733   S480.28,511,442.733,511z M442.733,391.533c-28.16,0-51.2,23.04-51.2,51.2c0,28.16,23.04,51.2,51.2,51.2   c28.16,0,51.2-23.04,51.2-51.2C493.933,414.573,470.893,391.533,442.733,391.533z" />
                  <path d="M41.667,306.2c-2.56,0-4.267-0.853-5.973-2.56c-3.413-3.413-3.413-8.533,0-11.947l217.6-217.6   c3.413-3.413,8.533-3.413,11.947,0c3.413,3.413,3.413,8.533,0,11.947l-217.6,217.6C45.933,305.347,44.227,306.2,41.667,306.2z" />
                  <path d="M502.467,451.267c-5.12,0-8.533-3.413-8.533-8.533v-307.2c0-5.12,3.413-8.533,8.533-8.533c5.12,0,8.533,3.413,8.533,8.533   v307.2C511,447.853,507.587,451.267,502.467,451.267z" />
                  <path d="M442.733,511h-0.853L92.013,459.8c-4.267-0.853-7.68-5.12-6.827-9.387s5.12-7.68,9.387-6.827l349.867,51.2   c4.267,0.853,7.68,5.12,6.827,9.387C450.413,507.587,447,511,442.733,511z" />
                  <path d="M442.733,451.267c-5.12,0-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533c5.12,0,8.533,3.413,8.533,8.533   C451.267,447.853,447.853,451.267,442.733,451.267" />
                  <path d="M374.467,84.333c-5.12,0-8.533-3.413-8.533-8.533s3.413-8.533,8.533-8.533c5.12,0,8.533,3.413,8.533,8.533   C383,80.92,379.587,84.333,374.467,84.333" />
                  <path d="M374.467,203.8c-5.12,0-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533c5.12,0,8.533,3.413,8.533,8.533   C383,200.387,379.587,203.8,374.467,203.8" />
                  <path d="M92.867,459.8C40.813,459.8-1,417.987-1,365.933s41.813-93.867,93.867-93.867s93.867,41.813,93.867,93.867   S144.92,459.8,92.867,459.8z M92.867,289.133c-42.667,0-76.8,34.133-76.8,76.8s34.133,76.8,76.8,76.8s76.8-34.133,76.8-76.8   S135.533,289.133,92.867,289.133z" />
                  <path d="M425.667,135.533c0-5.12,3.413-8.533,8.533-8.533c5.12,0,8.533,3.413,8.533,8.533s-3.413,8.533-8.533,8.533   C429.08,144.067,425.667,140.653,425.667,135.533" />
                  <path d="M306.2,135.533c0-5.12,3.413-8.533,8.533-8.533c5.12,0,8.533,3.413,8.533,8.533s-3.413,8.533-8.533,8.533   C309.613,144.067,306.2,140.653,306.2,135.533" />
                  <path d="M340.333,92.867c0,5.12-3.413,8.533-8.533,8.533s-8.533-3.413-8.533-8.533s3.413-8.533,8.533-8.533   S340.333,87.747,340.333,92.867" />
                  <path d="M425.667,178.2c0,5.12-3.413,8.533-8.533,8.533s-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533   S425.667,173.08,425.667,178.2" />
                  <path d="M408.6,92.867c0-5.12,3.413-8.533,8.533-8.533s8.533,3.413,8.533,8.533s-3.413,8.533-8.533,8.533   S408.6,97.987,408.6,92.867" />
                  <path d="M331.8,186.733c-5.12,0-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533s8.533,3.413,8.533,8.533   C340.333,183.32,336.92,186.733,331.8,186.733" />
                  <path d="M374.467,237.933c-56.32,0-102.4-46.08-102.4-102.4s46.08-102.4,102.4-102.4s102.4,46.08,102.4,102.4   S430.787,237.933,374.467,237.933z M374.467,50.2c-46.933,0-85.333,38.4-85.333,85.333s38.4,85.333,85.333,85.333   s85.333-38.4,85.333-85.333S421.4,50.2,374.467,50.2z" />
                  <path d="M374.467,169.667c-18.773,0-34.133-15.36-34.133-34.133s15.36-34.133,34.133-34.133c18.773,0,34.133,15.36,34.133,34.133   S393.24,169.667,374.467,169.667z M374.467,118.467c-9.387,0-17.067,7.68-17.067,17.067s7.68,17.067,17.067,17.067   s17.067-7.68,17.067-17.067S383.853,118.467,374.467,118.467z" />
                  <path d="M92.867,408.6c-23.893,0-42.667-18.773-42.667-42.667c0-23.893,18.773-42.667,42.667-42.667s42.667,18.773,42.667,42.667   C135.533,389.827,116.76,408.6,92.867,408.6z M92.867,340.333c-14.507,0-25.6,11.093-25.6,25.6s11.093,25.6,25.6,25.6   s25.6-11.093,25.6-25.6S107.373,340.333,92.867,340.333z" />
                </g>
              </svg>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                MotorSync Intelligence
              </h1>

              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    signalRConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    signalRConnected
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {signalRConnected ? "Live" : "Offline"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                onClick={() => setSettingsOpen(true)}
                title="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* Dashboard Stats */}
          {dashboardStats && (
            <DashboardStatsComponent
              stats={dashboardStats}
              signalRConnected={signalRConnected}
              backendStatus={backendStatus}
            />
          )}
        </div>

        {/* Hero Section - Motor Status Dashboard */}
        <div
          id="hero"
          className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-blue-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ⚙️ MotorSync Intelligence Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time monitoring and control
              </p>
            </div>

            {/* Motor Control Button - Redesigned */}
            <div className="relative">
              <button
                className={`px-6 py-2 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-4 ${
                  isGenerating
                    ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                    : readings.length > 0
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                } text-white`}
                onClick={async () => {
                  if (isGenerating) return;
                  setIsGenerating(true);

                  try {
                    // Generate new reading
                    console.log("🔄 Generating new reading...");
                    await axios.get(`${API_BASE_URL}/api/motor/sample`);

                    // Refresh readings from database
                    console.log("📊 Fetching updated readings...");
                    const response = await axios.get<MotorReading[]>(
                      `${API_BASE_URL}/api/motor`
                    );
                    console.log("📈 Latest reading:", response.data[0]);
                    console.log("🔄 Setting readings state...");
                    console.log(
                      "📊 Current readings state before update:",
                      readings
                    );
                    setReadings((prevReadings) => {
                      console.log(
                        "🔄 setReadings callback - prevReadings:",
                        prevReadings.length,
                        prevReadings[0]?.id
                      );
                      console.log(
                        "🔄 setReadings callback - newData:",
                        response.data.length,
                        response.data[0]?.id
                      );
                      return response.data;
                    });
                    console.log("✅ Readings state updated");
                    console.log("📊 New readings data:", response.data);

                    // Force re-render
                    setForceUpdate((prev) => {
                      console.log("🔄 Force update from", prev, "to", prev + 1);
                      return prev + 1;
                    });
                    console.log("🔄 Forced re-render triggered");

                    // Refresh dashboard stats
                    await loadDashboardStats();

                    setFastSpinCount((c) => c + 1);
                  } catch (error) {
                    console.error("Failed to generate reading:", error);
                  } finally {
                    setTimeout(() => setIsGenerating(false), 1000);
                  }
                }}
              >
                {/* Animated Gear Icon */}
                <AnimatedGearIcon
                  isActive={isGenerating || readings.length > 0}
                  size="md"
                  status={signalRConnected ? "live" : "offline"}
                />

                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold">
                    {isGenerating
                      ? "Generating..."
                      : readings.length > 0
                      ? "Generate Reading"
                      : "Start Motor"}
                  </span>
                  {readings.length > 0 && !isGenerating && (
                    <span className="text-xs opacity-90">
                      Current: {latestReading?.speed} RPM (ID:{" "}
                      {latestReading?.id}) [R
                      {forceUpdate}]
                    </span>
                  )}
                </div>
              </button>

              {/* LIVE/OFFLINE Indicator - positioned relative to button */}
              {signalRConnected ? (
                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
                  LIVE
                </div>
              ) : (
                <div className="absolute -top-3 -right-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
                  OFFLINE
                </div>
              )}
            </div>
          </div>

          {/* Main Motor Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Motor Status Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="mb-4">
                    <AnimatedMotor
                      reading={latestReading}
                      className="mx-auto"
                      signalRConnected={signalRConnected}
                      backendStatus={backendStatus}
                    />
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        latestReading?.status === "critical"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : latestReading?.status === "warning"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : latestReading?.status === "maintenance"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {latestReading?.status?.toUpperCase() || "OFFLINE"}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    MotorSync Intelligence
                  </p>
                  {latestReading && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      🕒 <strong>Last Updated:</strong>{" "}
                      {formatTimestamp(latestReading.timestamp, {
                        includeTime: true,
                        useLocalTime: true,
                      })}
                      <br />
                      📊 <strong>Reading ID:</strong> {latestReading.id}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Center: Key Metrics */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {/* Speed */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Motor Speed
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {latestReading?.speed || 0} RPM [R{forceUpdate}]
                      </p>
                      {readings.length > 0 && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          📊 <strong>Formula:</strong> Base Speed + Load
                          Variation + Time Effects + Random Variation
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Temperature */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🌡️</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Motor Temperature
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {latestReading?.temperature || 0}°C
                      </p>
                      {readings.length > 0 && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          📊 <strong>Formula:</strong> Base Temp +
                          (Speed/2500)×2 + (Load-0.5)×3 + Cooling Effects
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vibration */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📳</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Motor Vibration
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {latestReading?.vibration || 0} mm/s
                      </p>
                      {readings.length > 0 && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          📊 <strong>Formula:</strong> √(VibrationX² +
                          VibrationY² + VibrationZ²) = RMS Vibration
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Efficiency */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Motor Efficiency
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {latestReading?.efficiency || 0}%
                      </p>
                      {readings.length > 0 && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          📊 <strong>Formula:</strong> 92% - (Bearing Wear × 5)
                          - (Oil Degradation × 2.5) - Temperature Losses
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Metrics Row */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Power */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Motor Power
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {latestReading?.powerConsumption || 0} kW
                      </p>
                      {readings.length > 0 && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          📊 <strong>Formula:</strong> Base Power + (Load Factor
                          × 1.5kW) + ((100-Efficiency) × 0.1kW)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Health */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <span className="text-2xl">❤️</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Motor Health
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {latestReading?.systemHealth || 0}%
                      </p>
                      {readings.length > 0 && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          📊 <strong>Formula:</strong> (Efficiency × 40%) +
                          (Vibration Health × 25%) + (Temperature Health × 20%)
                          + (Bearing Health × 10%) + (Oil Health × 5%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div id="charts" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-3">
            <MotorChart
              readings={readings}
              signalRConnected={signalRConnected}
              backendStatus={backendStatus}
            />
          </div>

          {/* Right Sidebar with Motor Animation and Notifications */}
          <div className="space-y-6">
            {/* Motor Animation */}
            {/* {readings[0] && <AnimatedMotor rpm={readings[0].speed} />} */}

            {/* Notifications */}
            <div className="space-y-3">
              {highestTemp && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg shadow-sm relative">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🌡️</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Highest Temp: {highestTemp.temperature}°C
                      </div>
                      <div className="text-xs text-red-600">
                        {formatTimestamp(highestTemp.timestamp, {
                          includeTime: true,
                          useLocalTime: true,
                        })}
                      </div>
                      <div className="text-xs mt-1">
                        {highestTemp.temperature > 85 ? (
                          <span className="text-red-700 font-medium">
                            🚨 Critical: Above 85°C threshold
                          </span>
                        ) : highestTemp.temperature > 75 ? (
                          <span className="text-orange-600 font-medium">
                            ⚠️ Warning: Above 75°C threshold
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">
                            ✅ Normal: Below 75°C threshold
                          </span>
                        )}
                      </div>
                    </div>
                    <PhysicsFormulaTooltip type="temperature" />
                  </div>
                </div>
              )}
              {lowestTemp && (
                <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg shadow-sm relative">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">❄️</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Lowest Temp: {lowestTemp.temperature}°C
                      </div>
                      <div className="text-xs text-green-600">
                        {formatTimestamp(lowestTemp.timestamp, {
                          includeTime: true,
                          useLocalTime: true,
                        })}
                      </div>
                      <div className="text-xs mt-1">
                        {lowestTemp.temperature < 30 ? (
                          <span className="text-blue-600 font-medium">
                            ❄️ Cold: Below 30°C - Check heating
                          </span>
                        ) : lowestTemp.temperature < 50 ? (
                          <span className="text-green-600 font-medium">
                            ✅ Optimal: 30-50°C range
                          </span>
                        ) : (
                          <span className="text-yellow-600 font-medium">
                            🌡️ Warm: Above 50°C
                          </span>
                        )}
                      </div>
                    </div>
                    <PhysicsFormulaTooltip type="temperature" />
                  </div>
                </div>
              )}
              {highestRpm && (
                <div className="p-3 bg-orange-50 text-orange-800 border border-orange-200 rounded-lg shadow-sm relative">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⚡</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Highest RPM: {highestRpm.speed}
                      </div>
                      <div className="text-xs text-orange-600">
                        {formatTimestamp(highestRpm.timestamp, {
                          includeTime: true,
                          useLocalTime: true,
                        })}
                      </div>
                      <div className="text-xs mt-1">
                        {highestRpm.speed > 3000 ? (
                          <span className="text-red-600 font-medium">
                            🚨 Overload: Above 3000 RPM limit
                          </span>
                        ) : highestRpm.speed > 2500 ? (
                          <span className="text-orange-600 font-medium">
                            ⚡ High: 2500-3000 RPM range
                          </span>
                        ) : highestRpm.speed > 1500 ? (
                          <span className="text-green-600 font-medium">
                            ✅ Optimal: 1500-2500 RPM range
                          </span>
                        ) : (
                          <span className="text-blue-600 font-medium">
                            🐌 Low: Below 1500 RPM
                          </span>
                        )}
                      </div>
                    </div>
                    <PhysicsFormulaTooltip type="speed" />
                  </div>
                </div>
              )}
              {lowestRpm && (
                <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg shadow-sm relative">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🐌</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Lowest RPM: {lowestRpm.speed}
                      </div>
                      <div className="text-xs text-blue-600">
                        {formatTimestamp(lowestRpm.timestamp, {
                          includeTime: true,
                          useLocalTime: true,
                        })}
                      </div>
                      <div className="text-xs mt-1">
                        {lowestRpm.speed < 500 ? (
                          <span className="text-red-600 font-medium">
                            🚨 Stall Risk: Below 500 RPM
                          </span>
                        ) : lowestRpm.speed < 1000 ? (
                          <span className="text-orange-600 font-medium">
                            ⚠️ Low: 500-1000 RPM range
                          </span>
                        ) : lowestRpm.speed < 1500 ? (
                          <span className="text-yellow-600 font-medium">
                            🐌 Idle: 1000-1500 RPM range
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">
                            ✅ Normal: Above 1500 RPM
                          </span>
                        )}
                      </div>
                    </div>
                    <PhysicsFormulaTooltip type="speed" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Readings Section */}
        <div id="readings" className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                ⚙️ Motor Readings Data List Dashboard
              </h2>
              {/* Data Source Status Indicator */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                  dataSource === "backend"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {dataSource === "backend" ? "🔗 LIVE DATA" : "❌ OFFLINE"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                onClick={exportCsv}
              >
                Export CSV
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                onClick={() =>
                  window.open(
                    `${API_BASE_URL}/api/motor/export?format=json`,
                    "_blank"
                  )
                }
              >
                Export JSON
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                onClick={deleteAllData}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete All Data"}
              </button>
            </div>
          </div>

          {/* Color Legend */}
          {/* <ColorLegend /> */}

          {/* Reading List */}
          <div className="mb-8">
            <ReadingList readings={readings} />
          </div>
        </div>

        {/* Industrial Sensor Dashboard */}
        <div id="sensor-dashboard" className="mb-8">
          <SensorDashboard
            reading={latestReading}
            signalRConnected={signalRConnected}
            backendStatus={backendStatus}
          />
        </div>

        {/* Advanced Analytics Dashboard */}
        <div id="advanced-analytics" className="mb-8">
          <AdvancedAnalyticsDashboard
            motorId="MOTOR-001"
            signalRConnected={signalRConnected}
            backendStatus={backendStatus}
            readings={readings}
            isReadingsLoading={loading}
          />
        </div>

        {/* Industrial Management Dashboard */}
        <div id="industrial-management" className="mb-8">
          <IndustrialManagementDashboard
            facilityId="FACILITY-001"
            signalRConnected={signalRConnected}
            backendStatus={backendStatus}
            readings={readings}
            isReadingsLoading={loading}
          />
        </div>

        {/* Predictive Maintenance Dashboard */}
        <div id="predictive-maintenance" className="mb-8">
          <PredictiveMaintenanceDashboard
            readings={readings}
            isReadingsLoading={loading}
            motorId="MOTOR-001"
            signalRConnected={signalRConnected}
            backendStatus={backendStatus}
          />
        </div>

        {/* Motor Control Dashboard */}
        <div id="motor-control" className="mb-8">
          <MotorControlDashboard
            reading={latestReading}
            motorId="MOTOR-001"
            signalRConnected={signalRConnected}
            backendStatus={backendStatus}
          />
        </div>

        {/* Daily Life Applications */}
        <div id="daily-applications" className="mb-8">
          <DailyLifeApplications
            reading={latestReading}
            signalRConnected={signalRConnected}
            backendStatus={backendStatus}
          />
        </div>

        {/* IoT Cloud Integration */}
        <div id="iot-cloud" className="mb-8">
          <IoTCloudIntegration
            reading={latestReading}
            signalRConnected={signalRConnected}
            backendStatus={backendStatus}
          />
        </div>

        {/* Edge Computing Dashboard */}
        <div id="edge-computing" className="mb-8">
          <EdgeComputingDashboard
            readings={readings}
            isReadingsLoading={loading}
            motorId="MOTOR-001"
            signalRConnected={signalRConnected}
            backendStatus={backendStatus}
          />
        </div>

        {/* Mobile Dashboard */}
        <MobileDashboard
          reading={latestReading}
          onRefresh={() => {
            axios.get(`${API_BASE_URL}/api/motor/sample`);
            setFastSpinCount((c) => c + 1);
          }}
        />

        {/* Settings Modal */}
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          maxReadings={maxReadings}
          setMaxReadings={setMaxReadings}
        />
      </div>
    </div>
  );
}
