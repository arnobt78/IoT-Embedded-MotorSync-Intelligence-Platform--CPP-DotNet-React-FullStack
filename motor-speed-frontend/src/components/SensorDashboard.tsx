import type { MotorReading } from "../types/types";
import React from "react";

interface SensorDashboardProps {
  reading: MotorReading | null;
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}

export default function SensorDashboard({
  reading,
  signalRConnected = true,
  backendStatus = "connected",
}: SensorDashboardProps) {
  // Determine data source status
  const dataSource =
    reading && signalRConnected && backendStatus === "connected"
      ? "backend"
      : "offline";
  if (!reading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Industrial Sensor Dashboard
        </h3>
        <div className="text-gray-500 dark:text-gray-400">
          No sensor data available
        </div>
      </div>
    );
  }

  // Helper functions for status indicators (NO CALCULATIONS - just status display)
  const getVibrationStatus = (value: number | undefined) => {
    if (!value) return { status: "normal", color: "text-gray-500", icon: "ℹ️" };
    if (value < 2.5)
      return { status: "normal", color: "text-green-600", icon: "✅" };
    if (value < 4.5)
      return { status: "warning", color: "text-yellow-600", icon: "⚠️" };
    return { status: "critical", color: "text-red-600", icon: "🚨" };
  };

  const getPressureStatus = (value: number | undefined, type: string) => {
    if (!value) return { status: "normal", color: "text-gray-500", icon: "ℹ️" };

    const thresholds = {
      oil: { min: 2.0, max: 6.0 },
      air: { min: 6.0, max: 12.0 },
      hydraulic: { min: 150.0, max: 250.0 },
    };
    const threshold = thresholds[type as keyof typeof thresholds];
    if (!threshold)
      return { status: "normal", color: "text-gray-500", icon: "ℹ️" };

    if (value < threshold.min || value > threshold.max)
      return { status: "warning", color: "text-yellow-600", icon: "⚠️" };
    return { status: "normal", color: "text-green-600", icon: "✅" };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 border-red-300 text-red-800";
      case "warning":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "maintenance":
        return "bg-blue-100 border-blue-300 text-blue-800";
      default:
        return "bg-green-100 border-green-300 text-green-800";
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
    <div className="bg-indigo-100 dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            🏭 Industrial Sensor Dashboard
          </h3>
          {/* Data Source Status Indicator */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              dataSource === "backend"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {dataSource === "backend" ? "🔗 LIVE DATA" : "❌ OFFLINE"}
          </span>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            reading.status
          )}`}
        >
          {reading.status.toUpperCase()}
        </div>
      </div>

      {/* Educational Overview Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">ℹ️</div>
          <div>
            <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
              🔧 Industrial Sensor Dashboard Overview
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
              All values are computed from the latest motor reading data (which
              is generated as last time the motor was sampled) from the C++
              engine using real-world physics formulas and transmitted to the
              frontend without any intermediate calculations.
            </p>
            <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
              <div>
                • <strong>Direct C++ Data:</strong> All sensor readings come
                directly from C++ backend physics calculations
              </div>
              <div>
                • <strong>Real Physics Formulas:</strong> Temperature,
                vibration, efficiency, power, and health metrics use actual
                physics
              </div>
              <div>
                • <strong>No Frontend Calculations:</strong> This dashboard only
                displays data - no calculations performed here
              </div>
              <div>
                • <strong>Live Backend Integration:</strong> Data flows directly
                from motor_engine.cpp
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Overview - USING DIRECT C++ DATA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="text-sm opacity-90">System Health</div>
          <div className="text-2xl font-bold text-white">
            {reading.systemHealth?.toFixed(0) || "N/A"}%
          </div>
          <div className="text-xs opacity-75 mt-1">
            Overall system condition from C++ backend
          </div>

          <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
            <strong>Formula:</strong> Composite health score from vibration,
            temperature, bearing health, and efficiency
          </div>
          <div className="text-xs opacity-50 mt-1">
            <strong>Physics:</strong> Weighted composite of all sensor health
            indicators with real-time thresholds
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="text-sm opacity-90">Efficiency</div>
          <div className="text-2xl font-bold text-white">
            {reading.efficiency?.toFixed(1) || "N/A"}%
          </div>
          <div className="text-xs opacity-75 mt-1">
            Energy conversion efficiency from C++ backend
          </div>

          <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
            <strong>Formula:</strong> (Mechanical Power ÷ Electrical Power) ×
            100% × Temperature Factor
          </div>
          <div className="text-xs opacity-50 mt-1">
            <strong>Physics:</strong> Mechanical Power = Torque × Angular
            Velocity, Angular Velocity = (RPM × 2π) ÷ 60
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="text-sm opacity-90">Operating Time</div>
          <div className="text-2xl font-bold text-white">
            {reading.operatingHours !== undefined && reading.operatingHours > 0
              ? `${Math.floor(reading.operatingHours)}h`
              : reading.operatingMinutes !== undefined &&
                reading.operatingMinutes > 0
              ? `${reading.operatingMinutes}m`
              : reading.operatingSeconds !== undefined &&
                reading.operatingSeconds > 0
              ? `${Math.floor(reading.operatingSeconds)}s`
              : "0s"}
          </div>
          <div className="text-xs opacity-75 mt-1 text-white">
            {reading.operatingHours !== undefined && reading.operatingHours > 0
              ? `${reading.operatingMinutes || 0}m ${Math.floor(
                  (reading.operatingSeconds || 0) % 60
                )}s`
              : reading.operatingMinutes !== undefined &&
                reading.operatingMinutes > 0
              ? `${Math.floor((reading.operatingSeconds || 0) % 60)}s`
              : reading.operatingSeconds !== undefined &&
                reading.operatingSeconds > 0
              ? `${Math.floor(reading.operatingSeconds)}s`
              : "Session just started"}
          </div>
          <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
            💡 <strong>Source:</strong> Direct tracking from C++ backend
          </div>
          <div className="text-xs opacity-50 mt-1">
            <strong>Purpose:</strong> Maintenance scheduling and operational
            history tracking
          </div>
        </div>
      </div>

      {/* Sensor Data Grid - ALL DIRECT C++ DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vibration Sensors */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            📳 3-Axis Vibration
          </h4>
          <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-sm text-orange-800 dark:text-orange-200 font-medium mb-1">
              💡 Vibration Analysis
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-300">
              Direct C++ backend vibration data. RMS calculated using physics
              formulas. Normal: &lt;2.5 mm/s, Warning: 2.5-4.5 mm/s, Critical:
              &gt;4.5 mm/s
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                X-Axis:
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {reading.vibrationX?.toFixed(2) || "N/A"} mm/s
                </span>
                {reading.vibrationX && (
                  <span className="text-xs">
                    {getVibrationStatus(reading.vibrationX).icon}
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Horizontal vibration - affects motor stability
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Y-Axis:
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {reading.vibrationY?.toFixed(2) || "N/A"} mm/s
                </span>
                {reading.vibrationY && (
                  <span className="text-xs">
                    {getVibrationStatus(reading.vibrationY).icon}
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Vertical vibration - indicates bearing condition
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Z-Axis:
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {reading.vibrationZ?.toFixed(2) || "N/A"} mm/s
                </span>
                {reading.vibrationZ && (
                  <span className="text-xs">
                    {getVibrationStatus(reading.vibrationZ).icon}
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Axial vibration - shows shaft alignment issues
            </div>

            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                RMS:
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900 dark:text-white">
                  {reading.vibration?.toFixed(2) || "N/A"} mm/s
                </span>
                <span className="text-xs">
                  {getVibrationStatus(reading.vibration).icon}
                </span>
              </div>
            </div>
            {/* <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 <strong>Direct C++ Data:</strong> RMS calculated in C++ backend
              using physics formulas
            </div> */}
          </div>
        </div>

        {/* Pressure Sensors */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            🔧 Pressure Sensors
          </h4>
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
            <div className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">
              💡 Pressure Monitoring
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300">
              Direct C++ backend pressure data. Each system has specific
              operating ranges calculated using physics-based formulas.
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Oil:
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {reading.oilPressure?.toFixed(2) || "N/A"} bar
                </span>
                {reading.oilPressure && (
                  <span className="text-xs">
                    {getPressureStatus(reading.oilPressure, "oil").icon}
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Normal range: 2.0-6.0 bar - Lubrication system pressure
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Air:
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {reading.airPressure?.toFixed(2) || "N/A"} bar
                </span>
                {reading.airPressure && (
                  <span className="text-xs">
                    {getPressureStatus(reading.airPressure, "air").icon}
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Normal range: 6.0-12.0 bar - Pneumatic system pressure
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Hydraulic:
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {reading.hydraulicPressure?.toFixed(1) || "N/A"} bar
                </span>
                {reading.hydraulicPressure && (
                  <span className="text-xs">
                    {
                      getPressureStatus(reading.hydraulicPressure, "hydraulic")
                        .icon
                    }
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Normal range: 150.0-250.0 bar - High-pressure hydraulic system
            </div>
          </div>
        </div>

        {/* Electrical Monitoring */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            ⚡ Electrical
          </h4>
          <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-1">
              💡 Electrical System Analysis
            </div>
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              Direct C++ backend electrical data. All calculations performed
              using real-world physics formulas in the C++ engine.
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Voltage:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.voltage?.toFixed(1) || "N/A"} V
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Input voltage to motor - should be stable within 220-240V range
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Current:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.current?.toFixed(1) || "N/A"} A
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Motor current draw - varies with load and efficiency
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Power Factor:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.powerFactor?.toFixed(3) || "N/A"}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Power efficiency factor - closer to 1.0 is better (ideal:
              0.95-1.0)
            </div>

            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Power:
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {reading.powerConsumption?.toFixed(1) || "N/A"} kW
              </span>
            </div>
            {/* <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 <strong>Direct C++ Data:</strong> Power calculated in C++
              backend using physics formulas
            </div> */}
          </div>
        </div>

        {/* Mechanical Measurements */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            ⚙️ Mechanical
          </h4>
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
            <div className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">
              💡 Mechanical Performance
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300">
              Direct C++ backend mechanical data. All measurements calculated
              using real-world physics formulas in the C++ engine.
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                RPM:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.rpm || reading.speed || "N/A"}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Rotations per minute - indicates motor speed and load
              conditions
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Torque:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.torque?.toFixed(1) || "N/A"} Nm
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Rotational force output - varies with load and efficiency
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Shaft Position:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.shaftPosition?.toFixed(1) || "N/A"}°
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Angular position - shows shaft alignment and rotation angle
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Displacement:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.displacement?.toFixed(3) || "N/A"} mm
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Shaft displacement - detects bearing wear and mechanical issues
            </div>
          </div>
        </div>

        {/* Environmental Sensors */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            🌡️ Environment
          </h4>
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
              💡 Environmental Monitoring
            </div>
            <div className="text-xs text-red-700 dark:text-red-300">
              Direct C++ backend environmental data. Temperature and humidity
              impact cooling efficiency and component life.
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Motor Temp:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.temperature}°C
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Internal motor temperature - critical for performance and
              longevity
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Ambient Temp:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.ambientTemperature?.toFixed(1) || "N/A"}°C
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Surrounding air temperature - affects cooling efficiency
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Humidity:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.humidity?.toFixed(1) || "N/A"}%
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Air humidity level - high humidity can affect electrical
              components
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Pressure:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.ambientPressure?.toFixed(1) || "N/A"} kPa
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Atmospheric pressure - affects air density and cooling
              effectiveness
            </div>
          </div>
        </div>

        {/* Acoustic & Health */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            🔊 Acoustic & Health
          </h4>
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
            <div className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">
              💡 Health & Acoustic Analysis
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300">
              Direct C++ backend acoustic and health data. Bearing health
              calculated using physics-based formulas in the C++ engine.
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Sound Level:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.soundLevel?.toFixed(1) || "N/A"} dB
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Acoustic noise level - indicates mechanical condition and wear
            </div>

            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Bearing Health:
              </span>
              <span
                className={`font-bold ${getHealthColor(reading.bearingHealth)}`}
              >
                {reading.bearingHealth?.toFixed(1) || "N/A"}%
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 <strong>Direct C++ Data:</strong> Bearing health calculated in
              C++ backend using physics formulas
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Strain Gauge 1:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.strainGauge1?.toFixed(1) || "N/A"} με
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Structural stress measurement - detects material fatigue
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Strain Gauge 2:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.strainGauge2?.toFixed(1) || "N/A"} με
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Secondary stress measurement - validates structural integrity
            </div>
          </div>
        </div>

        {/* Flow Rate Sensors */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            💧 Flow Rates
          </h4>
          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
              💡 Fluid Flow Monitoring
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              Direct C++ backend flow rate data. Coolant and fuel flow rates
              calculated using physics-based formulas.
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Coolant:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.coolantFlowRate?.toFixed(1) || "N/A"} L/min
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💡 Cooling system flow rate - prevents motor overheating and
              thermal damage
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Fuel:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.fuelFlowRate?.toFixed(1) || "N/A"} L/min
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Fuel consumption rate - indicates system efficiency and
              operational load
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Status - USING DIRECT C++ DATA */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Maintenance Status
        </h4>
        <div className="mb-3 p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
          <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
            💡 Intelligent Maintenance Analysis
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            Maintenance status calculated directly in C++ backend based on
            vibration thresholds, temperature, bearing health, and operating
            hours.
          </div>
        </div>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          Status Code: {reading.maintenanceStatus || 0}
          {reading.maintenanceStatus === 0 && " - Good"}
          {reading.maintenanceStatus === 1 && " - Warning"}
          {reading.maintenanceStatus === 2 && " - Critical"}
          {reading.maintenanceStatus === 3 && " - Maintenance Due"}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          {reading.maintenanceStatus === 0 &&
            "✅ System is operating normally, no maintenance required."}
          {reading.maintenanceStatus === 1 &&
            "⚠️ Some parameters are outside normal range, monitor closely."}
          {reading.maintenanceStatus === 2 &&
            "🚨 Critical issues detected, immediate attention required."}
          {reading.maintenanceStatus === 3 &&
            "🔧 Scheduled maintenance is due based on operating hours and sensor data."}
        </div>
        <div className="text-xs text-blue-500 dark:text-blue-400 mt-3 border-t border-blue-300 dark:border-blue-700 pt-2">
          💡 <strong>Direct C++ Calculation:</strong> Based on vibration RMS (
          {">"}4.5=Critical, {">"}2.5=Warning), temperature ({">"}90°C=Critical,{" "}
          {">"}80°C=Warning), bearing health ({"<"}70%=Critical, {"<"}
          85%=Warning), and operating hours ({">"}1000h=Maintenance Due)
        </div>
      </div>
    </div>
  );
}
