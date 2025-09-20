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

  return (
    <div className="space-y-4">
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
                          <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                            <p className="text-red-800 text-sm font-medium">
                              Critical: Immediate attention required
                            </p>
                          </div>
                        )}
                        {r.status === "warning" && (
                          <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                            <p className="text-yellow-800 text-sm font-medium">
                              Warning: Monitor closely
                            </p>
                          </div>
                        )}
                        {r.status === "maintenance" && (
                          <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
                            <p className="text-blue-800 text-sm font-medium">
                              Maintenance: Schedule service
                            </p>
                          </div>
                        )}
                        {r.status === "normal" && (
                          <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                            <p className="text-green-800 text-sm font-medium">
                              Normal: Operating within limits
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200">
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
                        </div>

                        <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200">
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
                        </div>

                        {r.vibration && (
                          <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200">
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
                          </div>
                        )}

                        {r.efficiency && (
                          <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200">
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
                          </div>
                        )}

                        {r.powerConsumption && (
                          <div className="bg-white bg-opacity-80 px-4 py-3 rounded-lg border border-gray-200">
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
