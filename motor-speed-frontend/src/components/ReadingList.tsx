import { formatTimestamp, getLocalDateComponents } from "../lib/dateUtils";
import type { MotorReading } from "../types";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { PhysicsFormulaTooltip } from "./ui/PhysicsFormulaTooltip";

export default function ReadingList({
  readings,
  signalRConnected: _signalRConnected = true, // eslint-disable-line @typescript-eslint/no-unused-vars
  backendStatus: _backendStatus = "connected", // eslint-disable-line @typescript-eslint/no-unused-vars
}: {
  readings: MotorReading[];
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Data source tracking - simplified to only track live/offline (commented for future use)
  // const getDataSourceStatus = () => {
  //   if (
  //     signalRConnected &&
  //     backendStatus === "connected" &&
  //     readings.length > 0
  //   ) {
  //     return "backend";
  //   } else {
  //     return "offline";
  //   }
  // };

  // Calculate status breakdown (global - for reference, kept for potential future use)
  // const dataSource = getDataSourceStatus();
  // const statusCounts = readings.reduce((acc, reading) => {
  //   acc[reading.status] = (acc[reading.status] || 0) + 1;
  //   return acc;
  // }, {} as Record<string, number>);

  // Group readings by date string (YYYY-MM-DD) using LOCAL timezone for display consistency
  const grouped: { [date: string]: MotorReading[] } = {};
  readings.forEach((r) => {
    // Use local time zone for grouping (consistent with user's timezone)
    const dateComponents = getLocalDateComponents(r.timestamp);
    if (!dateComponents) return; // skip invalid dates

    // Use YYYY-MM-DD for grouping to avoid locale ambiguity
    const dateKey =
      dateComponents.year +
      "-" +
      String(dateComponents.month + 1).padStart(2, "0") +
      "-" +
      String(dateComponents.date).padStart(2, "0");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(r);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // Calculate status counts for a specific date group
  const getDateGroupStatusCounts = (dateGroup: MotorReading[]) => {
    return dateGroup.reduce((acc, reading) => {
      acc[reading.status] = (acc[reading.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const toggleGroup = (dateKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedGroups(newExpanded);
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

  // Physics-based status determination explanation
  const getStatusExplanation = (status: string) => {
    switch (status) {
      case "critical":
        return "🚨 Critical: Temperature >90°C OR Vibration >6.0mm/s OR Efficiency <75%";
      case "warning":
        return "⚠️ Warning: Temperature >80°C OR Vibration >4.5mm/s OR Efficiency <80%";
      case "maintenance":
        return "🔧 Maintenance: System Health <85% - Preventive maintenance recommended";
      default:
        return "✅ Normal: All parameters within safe operating limits";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Dynamic Data Explanation */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">ℹ️</div>
          <div>
            <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
              📊 Motor Readings Dashboard - Dynamic Physics-Based Data
            </h4>

            <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
              All motor readings are calculated using real-world physics
              formulas from the C++ engine. Each reading represents actual
              sensor data processed through advanced algorithms.
            </p>
            <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
              <div>
                • <strong>Status Determination:</strong> Calculated using
                multi-parameter thresholds (Temperature, Vibration, Efficiency,
                Oil Pressure, Bearing Health, System Health)
              </div>
              <div>
                • <strong>Physics Formulas:</strong> All metrics use real-world
                physics calculations (Speed, Temperature, Vibration RMS,
                Efficiency, Power)
              </div>
              <div>
                • <strong>Real-time Updates:</strong> Data updates every 2
                seconds with live motor sensor readings
              </div>
              <div>
                • <strong>Grouping Logic:</strong> Readings are dynamically
                grouped by date using local timezone calculations
              </div>
              <div>
                • <strong>Hover Tooltips:</strong> Detailed physics formulas and
                thresholds available on all metrics
              </div>
              {/* <div className="mt-3 pt-2 border-t border-blue-300 dark:border-blue-700">
                <strong>Data Source:</strong>{" "}
                {dataSource === "backend"
                  ? "🔗 Real C++ Backend Data - Live physics calculations from enhanced_motor_engine.cpp"
                  : "❌ Offline Mode - No backend connection available"}
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {sortedDates.map((dateKey) => {
        const isExpanded = expandedGroups.has(dateKey);
        const [year, month, day] = dateKey.split("-");
        // Format the date for display using consistent timezone handling
        const displayDate = formatTimestamp(`${year}-${month}-${day}`, {
          includeTime: false,
          useLocalTime: true,
        });

        // Calculate status counts for this specific date group
        const dateGroupStatusCounts = getDateGroupStatusCounts(
          grouped[dateKey]
        );

        return (
          <div key={dateKey} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleGroup(dateKey)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                {isExpanded ? (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                )}
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {displayDate}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {grouped[dateKey].length} reading
                    {grouped[dateKey].length !== 1 ? "s" : ""}
                  </p>

                  {dateGroupStatusCounts.normal > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {dateGroupStatusCounts.normal} normal
                    </span>
                  )}
                  {dateGroupStatusCounts.warning > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      {dateGroupStatusCounts.warning} warning
                    </span>
                  )}
                  {dateGroupStatusCounts.critical > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      {dateGroupStatusCounts.critical} critical
                    </span>
                  )}
                  {dateGroupStatusCounts.maintenance > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {dateGroupStatusCounts.maintenance} maintenance
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                  {grouped[dateKey].length}
                </span>
              </div>
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                isExpanded ? "opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="p-4 space-y-3">
                {grouped[dateKey]
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )
                  .map((r) => {
                    const time = formatTimestamp(r.timestamp, {
                      includeTime: true,
                      includeSeconds: true,
                      useLocalTime: true,
                    });

                    return (
                      <div
                        key={r.id}
                        className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${getStatusColor(
                          r.status
                        )}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                r.status === "critical"
                                  ? "bg-red-500"
                                  : r.status === "warning"
                                  ? "bg-yellow-500"
                                  : r.status === "maintenance"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <div>
                              <h4 className="font-semibold text-base">
                                {r.title || `Reading #${r.id}`}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Machine: {r.machineId}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{time}</p>
                            <p className="text-xs text-gray-500">
                              {r.operatingHours?.toFixed(1)}h
                            </p>
                          </div>
                        </div>

                        {/* Status Message */}
                        <div className="mb-4">
                          {r.status === "critical" && (
                            <div className="bg-red-100 border border-red-200 rounded-lg p-3 group relative">
                              <p className="text-red-800 text-sm font-medium">
                                Critical: Immediate attention required
                              </p>
                              <div className="text-xs text-red-600 mt-1">
                                💡 <strong>Physics:</strong>{" "}
                                {getStatusExplanation(r.status)}
                              </div>
                              {/* Physics Formula Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                📊 <strong>Critical Thresholds:</strong>
                                <br />
                                • Temperature: &gt;90°C (Thermal stress limit)
                                <br />
                                • Vibration: &gt;6.0mm/s (Mechanical failure
                                risk)
                                <br />• Efficiency: &lt;75% (Energy loss
                                critical)
                              </div>
                            </div>
                          )}
                          {r.status === "warning" && (
                            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3 group relative">
                              <p className="text-yellow-800 text-sm font-medium">
                                Warning: Monitor closely
                              </p>
                              <div className="text-xs text-yellow-600 mt-1">
                                💡 <strong>Physics:</strong>{" "}
                                {getStatusExplanation(r.status)}
                              </div>
                              {/* Physics Formula Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                📊 <strong>Warning Thresholds:</strong>
                                <br />
                                • Temperature: &gt;80°C (Thermal stress warning)
                                <br />
                                • Vibration: &gt;4.5mm/s (Mechanical wear
                                warning)
                                <br />• Efficiency: &lt;80% (Energy loss
                                warning)
                              </div>
                            </div>
                          )}
                          {r.status === "maintenance" && (
                            <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 group relative">
                              <p className="text-blue-800 text-sm font-medium">
                                Maintenance: Schedule service
                              </p>
                              <div className="text-xs text-blue-600 mt-1">
                                💡 <strong>Physics:</strong>{" "}
                                {getStatusExplanation(r.status)}
                              </div>
                              {/* Physics Formula Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                📊 <strong>Maintenance Threshold:</strong>
                                <br />
                                • System Health: &lt;85% (Preventive
                                maintenance)
                                <br />
                                🔬 <strong>Physics:</strong> System Health =
                                100% - (Bearing Wear × 200) - (Oil Degradation ×
                                100) - (Temperature Impact × 0.5) - (Vibration
                                Impact × 10) - (Efficiency Loss × 0.5)
                              </div>
                            </div>
                          )}
                          {r.status === "normal" && (
                            <div className="bg-green-100 border border-green-200 rounded-lg p-3 group relative">
                              <p className="text-green-800 text-sm font-medium">
                                Normal: Operating within limits
                              </p>
                              <div className="text-xs text-green-600 mt-1">
                                💡 <strong>Physics:</strong>{" "}
                                {getStatusExplanation(r.status)}
                              </div>
                              {/* Physics Formula Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                📊 <strong>Normal Operating Range:</strong>
                                <br />
                                • Temperature: 45-80°C (Optimal thermal range)
                                <br />
                                • Vibration: &lt;4.5mm/s (Low mechanical stress)
                                <br />
                                • Efficiency: &gt;80% (High energy efficiency)
                                <br />• System Health: &gt;85% (Excellent
                                overall condition)
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                          <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200 relative">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-500">⚡</span>
                              <div className="flex-1">
                                <p className="text-xs text-gray-600 font-medium">
                                  Speed
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  {r.speed} RPM
                                </p>
                              </div>
                              <PhysicsFormulaTooltip type="speed" />
                            </div>
                          </div>

                          <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200 group relative">
                            <div className="flex items-center space-x-2">
                              <span className="text-orange-500">🌡️</span>
                              <div>
                                <p className="text-xs text-gray-600 font-medium">
                                  Temperature
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  {r.temperature}°C
                                </p>
                              </div>
                            </div>
                            {/* Physics Formula Tooltip */}
                            <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              📊 <strong>Formula:</strong> Base Temp + Load
                              Impact + Efficiency Loss - Cooling
                              <br />
                              🔬 <strong>Physics:</strong> Temp = Base Temp +
                              (Speed/2500)×2 + (Load-0.5)×3 + Cooling Effects
                              <br />
                              <strong>Range:</strong> 45-95°C (Critical:
                              &gt;90°C, Warning: &gt;80°C)
                            </div>
                          </div>

                          {r.vibration && (
                            <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200 group relative">
                              <div className="flex items-center space-x-2">
                                <span className="text-purple-500">📳</span>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">
                                    Vibration
                                  </p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {r.vibration} mm/s
                                  </p>
                                </div>
                              </div>
                              {/* Physics Formula Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                📊 <strong>Formula:</strong> RMS Vibration =
                                √(VibrationX² + VibrationY² + VibrationZ²)
                                <br />
                                🔬 <strong>Physics:</strong> Base Vibration +
                                (Speed/2500)×0.2 + Bearing Wear×0.8 + Random
                                Variation
                                <br />
                                <strong>Range:</strong> 0.5-7.0 mm/s (Critical:
                                &gt;6.0mm/s, Warning: &gt;4.5mm/s)
                              </div>
                            </div>
                          )}

                          {r.efficiency && (
                            <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200 group relative">
                              <div className="flex items-center space-x-2">
                                <span className="text-green-500">⚙️</span>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">
                                    Efficiency
                                  </p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {r.efficiency}%
                                  </p>
                                </div>
                              </div>
                              {/* Physics Formula Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                📊 <strong>Formula:</strong> Base Efficiency -
                                Bearing Wear - Oil Degradation
                                <br />
                                🔬 <strong>Physics:</strong> Efficiency = 92% -
                                (Bearing Wear×5) - (Oil Degradation×2.5) -
                                Temperature Losses
                                <br />
                                <strong>Range:</strong> 70-95% (Critical:
                                &lt;75%, Warning: &lt;80%, Optimal: &gt;85%)
                              </div>
                            </div>
                          )}

                          {r.powerConsumption && (
                            <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200 group relative">
                              <div className="flex items-center space-x-2">
                                <span className="text-red-500">⚡</span>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium">
                                    Power
                                  </p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {r.powerConsumption} kW
                                  </p>
                                </div>
                              </div>
                              {/* Physics Formula Tooltip */}
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                📊 <strong>Formula:</strong> Base Power + Load
                                Factor + Efficiency Loss
                                <br />
                                🔬 <strong>Physics:</strong> Power = 4.5kW +
                                (Load×1.5kW) + ((100-Efficiency)×0.1kW)
                                <br />
                                <strong>Range:</strong> 3.0-7.0 kW (Typical:
                                4.0-5.0 kW)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
