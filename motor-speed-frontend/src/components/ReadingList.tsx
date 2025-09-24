import { safeDate } from "../lib/dateUtils";
import type { MotorReading } from "../types";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ReadingList({
  readings,
}: {
  readings: MotorReading[];
}) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group readings by date string (YYYY-MM-DD)
  const grouped: { [date: string]: MotorReading[] } = {};
  readings.forEach((r) => {
    // Always use local time zone for grouping
    const localDate = safeDate(r.timestamp);
    if (!localDate) return; // skip invalid dates
    // Use YYYY-MM-DD for grouping to avoid locale ambiguity
    const dateKey =
      localDate.getFullYear() +
      "-" +
      String(localDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(localDate.getDate()).padStart(2, "0");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(r);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

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
        return "🚨 Critical: Temperature >90°C OR Vibration >5.0mm/s OR Efficiency <75% OR Oil Pressure <2.0bar OR Bearing Health <70% OR System Health <60%";
      case "warning":
        return "⚠️ Warning: Temperature >80°C OR Vibration >4.0mm/s OR Efficiency <85% OR Oil Pressure <2.5bar OR Bearing Health <80% OR System Health <75%";
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
            </div>
          </div>
        </div>
      </div>
      {sortedDates.map((dateKey) => {
        const isExpanded = expandedGroups.has(dateKey);
        const [year, month, day] = dateKey.split("-");
        const localDate = safeDate(`${year}-${month}-${day}`);
        const displayDate = localDate
          ? localDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : dateKey;

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
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {displayDate}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {grouped[dateKey].length} reading
                    {grouped[dateKey].length !== 1 ? "s" : ""}
                  </p>
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
                {grouped[dateKey].map((r) => {
                  const d = safeDate(r.timestamp);
                  const time = d
                    ? d.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "Invalid Date";

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
                              • Vibration: &gt;5.0mm/s (Mechanical failure risk)
                              <br />
                              • Efficiency: &lt;75% (Energy loss critical)
                              <br />
                              • Oil Pressure: &lt;2.0bar (Lubrication failure)
                              <br />
                              • Bearing Health: &lt;70% (Mechanical wear
                              critical)
                              <br />• System Health: &lt;60% (Overall
                              degradation)
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
                              • Vibration: &gt;4.0mm/s (Mechanical wear warning)
                              <br />
                              • Efficiency: &lt;85% (Energy loss warning)
                              <br />
                              • Oil Pressure: &lt;2.5bar (Lubrication warning)
                              <br />
                              • Bearing Health: &lt;80% (Mechanical wear
                              warning)
                              <br />• System Health: &lt;75% (Overall
                              degradation warning)
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
                              • System Health: &lt;85% (Preventive maintenance)
                              <br />
                              🔬 <strong>Physics:</strong> System Health = 100%
                              - (Bearing Wear × 200) - (Oil Degradation × 100) -
                              (Temperature Impact × 0.5) - (Vibration Impact ×
                              10) - (Efficiency Loss × 0.5)
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
                              • Temperature: 50-80°C (Optimal thermal range)
                              <br />
                              • Vibration: &lt;4.0mm/s (Low mechanical stress)
                              <br />
                              • Efficiency: &gt;85% (High energy efficiency)
                              <br />
                              • Oil Pressure: &gt;2.5bar (Adequate lubrication)
                              <br />
                              • Bearing Health: &gt;80% (Good mechanical
                              condition)
                              <br />• System Health: &gt;85% (Excellent overall
                              condition)
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200 group relative">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-500">⚡</span>
                            <div>
                              <p className="text-xs text-gray-600 font-medium">
                                Speed
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                {r.speed} RPM
                              </p>
                            </div>
                          </div>
                          {/* Physics Formula Tooltip */}
                          <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            📊 <strong>Formula:</strong> Base Speed + Load
                            Variation - Temperature Impact + Random
                            <br />
                            🔬 <strong>Physics:</strong> Speed = 2500 +
                            (Load-0.7)×500 - (Temp-65°C)×2 ±1%
                            <br />
                            <strong>Range:</strong> 2000-3000 RPM (Optimal:
                            2200-2800 RPM)
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
                            📊 <strong>Formula:</strong> Base Temp + Load Impact
                            + Efficiency Loss - Cooling
                            <br />
                            🔬 <strong>Physics:</strong> Temp = 65°C +
                            (Load-0.5)×2 + (100-Efficiency)×0.1 - Thermal
                            Equilibrium
                            <br />
                            <strong>Range:</strong> 50-90°C (Critical: &gt;90°C,
                            Warning: &gt;80°C)
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
                              (Speed/2500)×0.5 + Bearing Wear×5 + Random
                              Variation
                              <br />
                              <strong>Range:</strong> 1.0-6.0 mm/s (Critical:
                              &gt;5.0mm/s, Warning: &gt;4.0mm/s)
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
                              🔬 <strong>Physics:</strong> Efficiency = 95% -
                              (Bearing Wear×100) - (Oil Degradation×50)
                              <br />
                              <strong>Range:</strong> 75-95% (Critical: &lt;75%,
                              Warning: &lt;85%, Optimal: &gt;90%)
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
