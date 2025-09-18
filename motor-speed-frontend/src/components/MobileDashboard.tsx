import React, { useState, useEffect } from "react";
import type { MotorReading } from "../types/types";

interface MobileDashboardProps {
  reading: MotorReading | null;
  onRefresh: () => void;
}

export default function MobileDashboard({
  reading,
  onRefresh,
}: MobileDashboardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "maintenance":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  const getHealthColor = (health?: number) => {
    if (!health) return "text-gray-500";
    if (health >= 90) return "text-green-600";
    if (health >= 75) return "text-yellow-600";
    if (health >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="md:hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Mobile Dashboard
        </h2>
        <button
          onClick={onRefresh}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          🔄
        </button>
      </div>

      {!reading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No sensor data available
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${getStatusColor(reading.status)}`}
              ></div>
              <span className="font-medium text-gray-800 dark:text-white">
                {reading.status.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {new Date(reading.timestamp).toLocaleTimeString()}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg">
              <div className="text-xs opacity-90">Speed</div>
              <div className="text-xl font-bold">{reading.speed} RPM</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg">
              <div className="text-xs opacity-90">Temperature</div>
              <div className="text-xl font-bold">{reading.temperature}°C</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg">
              <div className="text-xs opacity-90">Efficiency</div>
              <div className="text-xl font-bold">
                {reading.efficiency?.toFixed(1) || "N/A"}%
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg">
              <div className="text-xs opacity-90">Health</div>
              <div
                className={`text-xl font-bold ${getHealthColor(
                  reading.systemHealth
                )}`}
              >
                {reading.systemHealth || "N/A"}%
              </div>
            </div>
          </div>

          {/* Vibration */}
          {reading.vibration && (
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  📳 Vibration
                </span>
                <span className="text-sm font-bold">
                  {reading.vibration.toFixed(2)} mm/s
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    reading.vibration > 4.0
                      ? "bg-red-500"
                      : reading.vibration > 3.0
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(100, (reading.vibration / 5.0) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Power Consumption */}
          {reading.powerConsumption && (
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  ⚡ Power
                </span>
                <span className="text-sm font-bold">
                  {reading.powerConsumption.toFixed(1)} kW
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (reading.powerConsumption / 6.0) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onRefresh}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              🔄 Refresh Data
            </button>
            <button
              onClick={() => {
                // Export functionality
                const data = {
                  timestamp: reading.timestamp,
                  speed: reading.speed,
                  temperature: reading.temperature,
                  efficiency: reading.efficiency,
                  vibration: reading.vibration,
                  systemHealth: reading.systemHealth,
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `motor-reading-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              📥 Export
            </button>
          </div>

          {/* Alerts */}
          {reading.status !== "normal" && (
            <div
              className={`p-3 rounded-lg ${
                reading.status === "critical"
                  ? "bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-700"
                  : reading.status === "warning"
                  ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700"
                  : "bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {reading.status === "critical"
                    ? "🚨"
                    : reading.status === "warning"
                    ? "⚠️"
                    : "🔧"}
                </span>
                <div>
                  <div className="font-semibold text-sm">
                    {reading.status === "critical"
                      ? "Critical Alert"
                      : reading.status === "warning"
                      ? "Warning"
                      : "Maintenance Required"}
                  </div>
                  <div className="text-xs opacity-90">
                    {reading.status === "critical"
                      ? "Immediate attention required"
                      : reading.status === "warning"
                      ? "Monitor closely"
                      : "Schedule maintenance"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
