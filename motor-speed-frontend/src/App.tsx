import AlertSystem from "./components/AlertSystem";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AnimatedMotor from "./components/AnimatedMotor";
import ColorLegend from "./components/ColorLegend";
import DailyLifeApplications from "./components/DailyLifeApplications";
import DashboardStatsComponent from "./components/DashboardStats";
import IndustrialManagementDashboard from "./components/IndustrialManagementDashboard";
import IoTCloudIntegration from "./components/IoTCloudIntegration";
import MobileDashboard from "./components/MobileDashboard";
import Motor3D from "./components/Motor3D";
import MotorChart from "./components/MotorChart";
import MotorSpinner from "./components/MotorSpinner";
import NavBar from "./components/NavBar";
import ReadingList from "./components/ReadingList";
import SensorDashboard from "./components/SensorDashboard";
import SettingsModal from "./components/SettingsModal";
import { safeDate } from "./lib/dateUtils";
import { API_BASE_URL, SIGNALR_URL } from "./services/api";
import type { MotorReading, Alert, DashboardStats } from "./types";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [readings, setReadings] = useState<MotorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(true);
  const [signalRConnected, setSignalRConnected] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fastSpinCount, setFastSpinCount] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [maxReadings, setMaxReadings] = useState(100);

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
  const loadDashboardStats = async () => {
    try {
      const response = await axios.get<DashboardStats>(
        `${API_BASE_URL}/api/motor/stats`
      );
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
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

  // Load readings
  useEffect(() => {
    axios
      .get<MotorReading[]>(`${API_BASE_URL}/api/motor`)
      .then((res) => {
        console.log("[DEBUG] Readings loaded from backend:", res.data);
        res.data.forEach((r) => {
          console.log(`[DEBUG] Reading id=${r.id} timestamp=`, r.timestamp);
        });
        setReadings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false); // still hide spinner on error
      });

    loadDashboardStats();

    const hub = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount === 0) {
            return 0; // Start immediately on first retry
          }
          return Math.min(
            1000 * Math.pow(2, retryContext.previousRetryCount),
            30000
          ); // Exponential backoff, max 30s
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // New reading event
    hub.on("NewReading", (reading: MotorReading) => {
      setReadings((r) => {
        // Check if reading with same ID already exists
        const existingIndex = r.findIndex(
          (existing) => existing.id === reading.id
        );
        if (existingIndex !== -1) {
          // Replace existing reading with same ID
          const newReadings = [...r];
          newReadings[existingIndex] = reading;
          return newReadings;
        } else {
          // Add new reading to front
          return [reading, ...r].slice(0, maxReadings);
        }
      });

      // Refresh dashboard stats when new reading is added
      loadDashboardStats();

      if (reading.temperature > 80)
        setAlert(`⚠️ High Temp: ${reading.temperature} °C`);
    });

    // New alert event
    hub.on("NewAlert", (alert: Alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    // Add connection event handlers for better debugging
    hub.onclose((error) => {
      setSignalRConnected(false);
      if (error) {
        console.log("[SignalR] Connection closed with error:", error);
      } else {
        console.log("[SignalR] Connection closed");
      }
    });

    hub.onreconnecting((error) => {
      setSignalRConnected(false);
      console.log("[SignalR] Reconnecting...", error);
    });

    hub.onreconnected((connectionId) => {
      setSignalRConnected(true);
      console.log("[SignalR] Reconnected with connection ID:", connectionId);
    });

    // Start connection with error handling and small delay
    setTimeout(() => {
      hub
        .start()
        .then(() => {
          setSignalRConnected(true);
          console.log("[SignalR] Connected successfully");
        })
        .catch((error) => {
          setSignalRConnected(false);
          console.log("[SignalR] Failed to start connection:", error);
        });
    }, 100); // Small delay to ensure backend is ready

    return () => {
      hub.stop().catch(console.error);
    };
  }, [maxReadings]);

  return (
    <div
      className={`min-h-screen bg-gray-50 p-6${
        darkMode ? " dark bg-gray-900 text-white" : ""
      }`}
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <MotorSpinner />
        </div>
      )}

      <AlertSystem alerts={alerts} onAcknowledge={acknowledgeAlert} />

      <div className="max-w-9xl mx-auto">
        <NavBar />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Motor Dashboard
              </h1>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  signalRConnected
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {signalRConnected ? "🟢 Live" : "🔴 Offline"}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Motor Control Button */}
              <div className="relative">
                <button
                  className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3 ${
                    readings[0]
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  } text-white`}
                  onClick={() => {
                    axios.get(`${API_BASE_URL}/api/motor/sample`);
                    setFastSpinCount((c) => c + 1);
                  }}
                >
                  {/* Motor Icon */}
                  <div className="w-8 h-8 flex items-center justify-center mr-6">
                    {readings[0] ? (
                      <div className="relative">
                        <AnimatedMotor rpm={readings[0].speed} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-white rounded-full">
                        <div className="w-1 h-1 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                      {readings[0] ? "Generate Reading" : "Start Motor"}
                    </span>
                    {readings[0] && (
                      <span className="text-xs opacity-90">
                        Current: {readings[0].speed} RPM
                      </span>
                    )}
                  </div>
                </button>

                {/* Status Indicator */}
                {readings[0] && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                    LIVE
                  </div>
                )}
              </div>

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
          {dashboardStats && <DashboardStatsComponent stats={dashboardStats} />}
        </div>

        {/* 3D Motor Visualization */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3D Motor Visualization
          </h2>
          <Motor3D
            reading={readings[0] || null}
            className="border rounded-lg shadow-lg"
          />
        </div>

        {/* Industrial Sensor Dashboard */}
        <div className="mb-8">
          <SensorDashboard reading={readings[0] || null} />
        </div>

        {/* Advanced Analytics Dashboard */}
        <div className="mb-8">
          <AnalyticsDashboard machineId="MOTOR-001" />
        </div>

        {/* Industrial Management Dashboard */}
        <div className="mb-8">
          <IndustrialManagementDashboard facilityId="FACILITY-001" />
        </div>

        {/* Daily Life Applications */}
        <div className="mb-8">
          <DailyLifeApplications reading={readings[0] || null} />
        </div>

        {/* IoT Cloud Integration */}
        <div className="mb-8">
          <IoTCloudIntegration reading={readings[0] || null} />
        </div>

        {/* Mobile Dashboard */}
        <MobileDashboard
          reading={readings[0] || null}
          onRefresh={() => {
            axios.get(`${API_BASE_URL}/api/motor/sample`);
            setFastSpinCount((c) => c + 1);
          }}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-3">
            <MotorChart readings={readings} />
          </div>

          {/* Right Sidebar with Motor Animation and Notifications */}
          <div className="space-y-6">
            {/* Motor Animation */}
            {/* {readings[0] && <AnimatedMotor rpm={readings[0].speed} />} */}

            {/* Notifications */}
            <div className="space-y-3">
              {highestTemp && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🌡️</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Highest Temp: {highestTemp.temperature}°C
                      </div>
                      <div className="text-xs text-red-600">
                        {(() => {
                          const d = safeDate(highestTemp.timestamp);
                          return d ? d.toLocaleString() : "Invalid Date";
                        })()}
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
                  </div>
                </div>
              )}
              {lowestTemp && (
                <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">❄️</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Lowest Temp: {lowestTemp.temperature}°C
                      </div>
                      <div className="text-xs text-green-600">
                        {(() => {
                          const d = safeDate(lowestTemp.timestamp);
                          return d ? d.toLocaleString() : "Invalid Date";
                        })()}
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
                  </div>
                </div>
              )}
              {highestRpm && (
                <div className="p-3 bg-orange-50 text-orange-800 border border-orange-200 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⚡</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Highest RPM: {highestRpm.speed}
                      </div>
                      <div className="text-xs text-orange-600">
                        {(() => {
                          const d = safeDate(highestRpm.timestamp);
                          return d ? d.toLocaleString() : "Invalid Date";
                        })()}
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
                  </div>
                </div>
              )}
              {lowestRpm && (
                <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🐌</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Lowest RPM: {lowestRpm.speed}
                      </div>
                      <div className="text-xs text-blue-600">
                        {(() => {
                          const d = safeDate(lowestRpm.timestamp);
                          return d ? d.toLocaleString() : "Invalid Date";
                        })()}
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Readings Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Motor Readings</h2>
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
            </div>
          </div>

          {/* Color Legend */}
          <ColorLegend />

          <ReadingList readings={readings} />
        </div>

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

export default App;
