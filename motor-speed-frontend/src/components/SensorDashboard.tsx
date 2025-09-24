import type { MotorReading } from "../types/types";
import React from "react";

interface SensorDashboardProps {
  reading: MotorReading | null;
}

export default function SensorDashboard({ reading }: SensorDashboardProps) {
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

  // Dynamic calculations for enhanced sensor insights
  const calculateVibrationRMS = () => {
    if (reading.vibrationX && reading.vibrationY && reading.vibrationZ) {
      return Math.sqrt(
        (reading.vibrationX ** 2 +
          reading.vibrationY ** 2 +
          reading.vibrationZ ** 2) /
          3
      );
    }
    return reading.vibration || 0;
  };

  const calculatePowerFromVoltageCurrent = () => {
    if (reading.voltage && reading.current) {
      return (
        (reading.voltage * reading.current * (reading.powerFactor || 0.9)) /
        1000
      ); // Convert to kW
    }
    return reading.powerConsumption || 0;
  };

  const calculateBearingHealth = () => {
    // Bearing health based on vibration, temperature, and sound level
    let health = 100;

    // Vibration impact (RMS vibration affects bearing health)
    const rmsVibration = calculateVibrationRMS();
    if (rmsVibration > 4.5) health -= 15;
    else if (rmsVibration > 2.5) health -= 8;
    else if (rmsVibration > 1.5) health -= 3;

    // Temperature impact
    if (reading.temperature > 90) health -= 12;
    else if (reading.temperature > 80) health -= 6;
    else if (reading.temperature > 70) health -= 2;

    // Sound level impact
    if (reading.soundLevel && reading.soundLevel > 80) health -= 8;
    else if (reading.soundLevel && reading.soundLevel > 70) health -= 4;

    return Math.max(0, Math.min(100, health));
  };

  const calculateDynamicEfficiency = () => {
    // Dynamic efficiency calculation based on power, torque, and RPM
    if (reading.powerConsumption && reading.torque && reading.rpm) {
      // Mechanical power = Torque × Angular Velocity
      const angularVelocity = (reading.rpm * 2 * Math.PI) / 60; // rad/s
      const mechanicalPower = (reading.torque * angularVelocity) / 1000; // kW

      // Efficiency = (Mechanical Power / Electrical Power) × 100%
      const efficiency = (mechanicalPower / reading.powerConsumption) * 100;

      // Apply temperature correction factor
      const tempFactor =
        reading.temperature > 80 ? 0.95 : reading.temperature > 70 ? 0.98 : 1.0;

      return Math.max(0, Math.min(100, efficiency * tempFactor));
    }

    // Fallback to reading efficiency or calculate from power factor
    if (reading.efficiency) return reading.efficiency;
    if (reading.powerFactor) return reading.powerFactor * 100;

    return 85; // Default efficiency
  };

  const calculateSystemHealth = () => {
    // Dynamic system health calculation based on all sensor readings
    let health = 100;

    // Vibration impact (RMS vibration affects overall health)
    const rmsVibration = calculateVibrationRMS();
    if (rmsVibration > 4.5) health -= 20;
    else if (rmsVibration > 2.5) health -= 10;
    else if (rmsVibration > 1.5) health -= 5;

    // Temperature impact
    if (reading.temperature > 90) health -= 15;
    else if (reading.temperature > 80) health -= 8;
    else if (reading.temperature > 70) health -= 3;

    // Bearing health impact
    const bearingHealth = calculateBearingHealth();
    health = (health + bearingHealth) / 2; // Average with bearing health

    // Efficiency impact
    const dynamicEfficiency = calculateDynamicEfficiency();
    if (dynamicEfficiency < 80) health -= 10;
    else if (dynamicEfficiency < 90) health -= 5;

    // Power factor impact
    if (reading.powerFactor && reading.powerFactor < 0.8) health -= 8;
    else if (reading.powerFactor && reading.powerFactor < 0.9) health -= 4;

    return Math.max(0, Math.min(100, health));
  };

  const calculateMaintenanceStatus = () => {
    // Dynamic maintenance status based on multiple sensor readings
    let status = 0; // Good

    // Check vibration thresholds
    const rmsVibration = calculateVibrationRMS();
    if (rmsVibration > 4.5) status = Math.max(status, 2); // Critical
    else if (rmsVibration > 2.5) status = Math.max(status, 1); // Warning

    // Check temperature
    if (reading.temperature > 90) status = Math.max(status, 2); // Critical
    else if (reading.temperature > 80) status = Math.max(status, 1); // Warning

    // Check bearing health
    const bearingHealth = calculateBearingHealth();
    if (bearingHealth < 70) status = Math.max(status, 2); // Critical
    else if (bearingHealth < 85) status = Math.max(status, 1); // Warning

    // Check operating hours for scheduled maintenance
    if (reading.operatingHours && reading.operatingHours > 1000)
      status = Math.max(status, 3); // Maintenance due

    return status;
  };

  const getVibrationStatus = (value: number) => {
    if (value < 2.5)
      return { status: "normal", color: "text-green-600", icon: "✅" };
    if (value < 4.5)
      return { status: "warning", color: "text-yellow-600", icon: "⚠️" };
    return { status: "critical", color: "text-red-600", icon: "🚨" };
  };

  const getPressureStatus = (value: number, type: string) => {
    const thresholds = {
      oil: { min: 2.0, max: 6.0 },
      air: { min: 6.0, max: 12.0 },
      hydraulic: { min: 150.0, max: 250.0 },
    };
    const threshold = thresholds[type as keyof typeof thresholds];
    if (!threshold)
      return { status: "normal", color: "text-gray-600", icon: "ℹ️" };

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
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Industrial Sensor Dashboard
        </h3>
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
              This dashboard displays real-time data from multiple industrial
              sensors monitoring your motor's performance, health, and
              environmental conditions. All values are dynamically calculated
              from actual sensor readings with intelligent status indicators and
              maintenance recommendations.
            </p>
            <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
              <div>
                • <strong>Real-time Data:</strong> All sensor readings are live
                data from your motor system
              </div>
              <div>
                • <strong>Dynamic Calculations:</strong> RMS vibration, power
                calculations, and health metrics are computed in real-time
              </div>
              <div>
                • <strong>Intelligent Status:</strong> Color-coded indicators
                show normal, warning, and critical conditions
              </div>
              <div>
                • <strong>Maintenance Integration:</strong> Automatic
                maintenance status based on sensor thresholds and operating
                hours
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="text-sm opacity-90">System Health</div>
          <div className="text-2xl font-bold text-white">
            {calculateSystemHealth().toFixed(0)}%
          </div>
          <div className="text-xs opacity-75 mt-1">
            Overall system condition based on all sensors
          </div>
          <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
            💡 <strong>Dynamic:</strong> Composite health score from vibration,
            temperature, bearing health, and efficiency
          </div>
          <div className="text-xs opacity-50 mt-1">
            <strong>Formula:</strong> Base(100%) - Vibration Penalty -
            Temperature Penalty - Efficiency Penalty - Power Factor Penalty,
            averaged with Bearing Health
          </div>
          <div className="text-xs opacity-50 mt-1">
            <strong>Physics:</strong> Weighted composite of all sensor health
            indicators with real-time thresholds
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="text-sm opacity-90">Efficiency</div>
          <div className="text-2xl font-bold text-white">
            {calculateDynamicEfficiency().toFixed(1)}%
          </div>
          <div className="text-xs opacity-75 mt-1">
            Energy conversion efficiency (higher is better)
          </div>
          <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
            💡 <strong>Dynamic:</strong> Real-time efficiency from mechanical
            power vs electrical power
          </div>
          <div className="text-xs opacity-50 mt-1">
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
          {/* Debug info - remove after fixing */}
          <div className="text-xs text-white opacity-50">
            Debug: h={reading.operatingHours}, m={reading.operatingMinutes}, s=
            {reading.operatingSeconds}
          </div>
          <div className="text-xs opacity-75 mt-1 text-white">
            {reading.operatingHours !== undefined && reading.operatingHours > 0
              ? `${reading.operatingMinutes}m ${Math.floor(
                  reading.operatingSeconds || 0
                )}s total runtime`
              : reading.operatingMinutes !== undefined &&
                reading.operatingMinutes > 0
              ? `${Math.floor(reading.operatingSeconds || 0)}s total runtime`
              : reading.operatingSeconds !== undefined &&
                reading.operatingSeconds > 0
              ? `${Math.floor(reading.operatingSeconds)}s total runtime`
              : "Session just started"}
          </div>
          <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
            💡 <strong>Real-time:</strong> Continuous tracking from motor
            startup
          </div>
          <div className="text-xs opacity-50 mt-1">
            <strong>Purpose:</strong> Maintenance scheduling and operational
            history tracking
          </div>
        </div>
      </div>

      {/* Sensor Data Grid */}
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
              Measures motor vibration in X, Y, Z axes. RMS (Root Mean Square)
              provides overall vibration severity. Normal: &lt;2.5 mm/s,
              Warning: 2.5-4.5 mm/s, Critical: &gt;4.5 mm/s
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
                  {calculateVibrationRMS().toFixed(2)} mm/s
                </span>
                <span className="text-xs">
                  {getVibrationStatus(calculateVibrationRMS()).icon}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 <strong>Dynamic:</strong> RMS = √((X² + Y² + Z²) ÷ 3) - Overall
              vibration severity
            </div>
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
              Monitors oil, air, and hydraulic pressure. Low pressure indicates
              leaks or pump issues, high pressure may cause damage. Each system
              has specific operating ranges.
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
              Electrical system monitoring. Voltage should be stable (220-240V),
              power factor near 1.0 indicates efficient operation. Power is
              calculated from voltage, current, and power factor.
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
                {calculatePowerFromVoltageCurrent().toFixed(1)} kW
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 <strong>Dynamic:</strong> Power = (Voltage × Current × Power
              Factor) ÷ 1000 - Real-time power calculation
            </div>
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
              Mechanical performance metrics. RPM and torque indicate motor
              load, shaft position shows alignment, displacement detects wear.
              These measurements help assess mechanical condition and
              performance.
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                RPM:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reading.rpm || "N/A"}
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
              Environmental conditions affecting motor performance. Temperature
              and humidity impact cooling efficiency and component life. Ambient
              pressure affects air density and cooling effectiveness.
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
              Sound level indicates mechanical condition. Bearing health {">"}
              90% is good, strain gauges detect structural stress and fatigue.
              Bearing health is dynamically calculated from vibration,
              temperature, and sound.
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
                className={`font-bold ${getHealthColor(
                  calculateBearingHealth()
                )}`}
              >
                {calculateBearingHealth().toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 <strong>Dynamic:</strong> Based on vibration (RMS),
              temperature, and sound level - calculated in real-time
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
              Fluid flow monitoring. Coolant flow prevents overheating, fuel
              flow indicates consumption and system efficiency. Flow rates are
              critical for thermal management and operational efficiency.
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

      {/* Maintenance Status */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Maintenance Status
        </h4>
        <div className="mb-3 p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
          <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
            💡 Intelligent Maintenance Analysis
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            Maintenance status is dynamically calculated based on vibration
            thresholds, temperature, bearing health, and operating hours. This
            provides proactive maintenance recommendations based on actual
            sensor data.
          </div>
        </div>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          Status Code: {calculateMaintenanceStatus()}
          {calculateMaintenanceStatus() === 0 && " - Good"}
          {calculateMaintenanceStatus() === 1 && " - Warning"}
          {calculateMaintenanceStatus() === 2 && " - Critical"}
          {calculateMaintenanceStatus() === 3 && " - Maintenance Due"}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          {calculateMaintenanceStatus() === 0 &&
            "✅ System is operating normally, no maintenance required."}
          {calculateMaintenanceStatus() === 1 &&
            "⚠️ Some parameters are outside normal range, monitor closely."}
          {calculateMaintenanceStatus() === 2 &&
            "🚨 Critical issues detected, immediate attention required."}
          {calculateMaintenanceStatus() === 3 &&
            "🔧 Scheduled maintenance is due based on operating hours and sensor data."}
        </div>
        <div className="text-xs text-blue-500 dark:text-blue-400 mt-3 border-t border-blue-300 dark:border-blue-700 pt-2">
          💡 <strong>Dynamic Calculation:</strong> Based on vibration RMS ({">"}
          4.5=Critical, {">"}2.5=Warning), temperature ({">"}90°C=Critical,{" "}
          {">"}80°C=Warning), bearing health ({"<"}70%=Critical, {"<"}
          85%=Warning), and operating hours ({">"}1000h=Maintenance Due)
        </div>
      </div>
    </div>
  );
}
