import { safeDate } from "../lib/dateUtils";
import type { MotorReading } from "../types";
import {
  // LineChart,
  // Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function MotorChart({ readings }: { readings: MotorReading[] }) {
  // Show last 20 readings, sorted oldest to newest
  const data = [...readings]
    .slice(0, 20)
    .reverse()
    .map((r) => {
      const d = safeDate(r.timestamp);
      return {
        ...r,
        time: d ? d.toLocaleTimeString() : "Invalid Date",
      };
    });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Real-time Motor Data
          </h2>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            💡 <strong>Dynamic Data:</strong> All values calculated using
            real-world physics formulas from C++ engine
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1 group relative">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Speed (RPM)</span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              📊 <strong>Formula:</strong> Base Speed + Load Variation -
              Temperature Impact + Random Variation
              <br />
              🔬 <strong>Physics:</strong> Speed = 2500 + (Load-0.7)×500 -
              (Temp-65°C)×2 ±1%
              <br />
              <strong>Range:</strong> 2000-3000 RPM
            </div>
          </div>
          <div className="flex items-center space-x-1 group relative">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Temperature (°C)</span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              📊 <strong>Formula:</strong> Base Temp + Load Impact + Efficiency
              Loss - Cooling Effect
              <br />
              🔬 <strong>Physics:</strong> Temp = 65°C + (Load-0.5)×2 +
              (100-Efficiency)×0.1 - Thermal Equilibrium
              <br />
              <strong>Range:</strong> 50-85°C (Critical: &gt;85°C)
            </div>
          </div>
          <div className="flex items-center space-x-1 group relative">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Efficiency (%)</span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              📊 <strong>Formula:</strong> Base Efficiency - Bearing Wear - Oil
              Degradation
              <br />
              🔬 <strong>Physics:</strong> Efficiency = 95% - (Bearing Wear×100)
              - (Oil Degradation×50)
              <br />
              <strong>Range:</strong> 75-95% (Optimal: &gt;90%)
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer
        width="100%"
        height={300}
        className="text-gray-500 dark:text-gray-400"
      >
        <AreaChart data={data}>
          <defs>
            <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            domain={[0, "auto"]}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgb(55 65 81)", // gray-700
              border: "1px solid rgb(75 85 99)", // gray-600
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              color: "rgb(249 250 251)", // gray-50
            }}
          />
          <Legend />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="speed"
            stroke="#3b82f6"
            fill="url(#speedGradient)"
            name="Speed (RPM)"
            strokeWidth={2}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="temperature"
            stroke="#f97316"
            fill="url(#tempGradient)"
            name="Temperature (°C)"
            strokeWidth={2}
          />
          {data.some((d) => d.efficiency) && (
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="efficiency"
              stroke="#8b5cf6"
              fill="url(#efficiencyGradient)"
              name="Efficiency (%)"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
