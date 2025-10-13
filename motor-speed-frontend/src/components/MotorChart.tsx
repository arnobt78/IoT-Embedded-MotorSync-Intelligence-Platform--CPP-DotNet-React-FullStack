import { formatTimestamp } from "../lib/dateUtils";
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
import { useCallback } from "react";
import { PhysicsTooltip } from "./ui/tooltip";

interface MotorChartProps {
  readings: MotorReading[];
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}

export default function MotorChart({
  readings,
  signalRConnected = true,
  backendStatus = "connected",
}: MotorChartProps) {
  // Data source tracking
  const getDataSourceStatus = () => {
    if (
      signalRConnected &&
      backendStatus === "connected" &&
      readings.length > 0
    ) {
      return "backend";
    } else if (readings.length > 0) {
      return "connected";
    } else {
      return "offline";
    }
  };

  const dataSource = getDataSourceStatus();

  // Tooltip content for Speed
  const SpeedTooltipContent = () => (
    <div>
      <div className="font-medium mb-1">⚡ Speed Formula</div>
      <div className="text-gray-300 mb-1">
        <strong>📊 Formula:</strong> Base Speed + Load Variation - Temperature
        Impact + Random Variation
      </div>
      <div className="text-gray-300 mb-1">
        <strong>🔬 Physics:</strong> Speed = 2500 + (Load-0.7)×500 -
        (Temp-65°C)×2 ±1%
      </div>
      <div className="text-gray-300">
        <strong>Range:</strong> 2000-3000 RPM
      </div>
    </div>
  );

  // Tooltip content for Temperature
  const TemperatureTooltipContent = () => (
    <div>
      <div className="font-medium mb-1">🌡️ Temperature Formula</div>
      <div className="text-gray-300 mb-1">
        <strong>📊 Formula:</strong> Base Temp + Load Impact + Efficiency Loss -
        Cooling Effect
      </div>
      <div className="text-gray-300 mb-1">
        <strong>🔬 Physics:</strong> Temp = 65°C + (Load-0.5)×2 +
        (100-Efficiency)×0.1 - Thermal Equilibrium
      </div>
      <div className="text-gray-300">
        <strong>Range:</strong> 50-85°C (Critical: &gt;85°C)
      </div>
    </div>
  );

  // Tooltip content for Efficiency
  const EfficiencyTooltipContent = () => (
    <div>
      <div className="font-medium mb-1">⚙️ Efficiency Formula</div>
      <div className="text-gray-300 mb-1">
        <strong>📊 Formula:</strong> Base Efficiency - Bearing Wear - Oil
        Degradation
      </div>
      <div className="text-gray-300 mb-1">
        <strong>🔬 Physics:</strong> Efficiency = 95% - (Bearing Wear×100) -
        (Oil Degradation×50)
      </div>
      <div className="text-gray-300">
        <strong>Range:</strong> 75-95% (Optimal: &gt;90%)
      </div>
    </div>
  );

  // Generate fallback data when backend is unavailable
  const generateFallbackData = useCallback((): MotorReading[] => {
    const fallbackData: MotorReading[] = [];
    const now = new Date();

    for (let i = 19; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 2000); // 2 seconds apart
      const timeVariation = Math.sin(i * 0.1) * 0.1; // Deterministic variation

      fallbackData.push({
        id: i,
        timestamp: timestamp.toISOString(),
        title: "Fallback Data",
        machineId: "MOTOR-001",
        status: "normal",
        speed: Math.max(
          0,
          2500 + Math.sin(i * 0.05) * 200 + timeVariation * 100
        ),
        temperature: Math.max(
          20,
          65 + Math.sin(i * 0.03) * 10 + timeVariation * 5
        ),
        vibration: Math.max(
          0,
          1.5 + Math.sin(i * 0.07) * 0.5 + timeVariation * 0.2
        ),
        efficiency: Math.max(
          70,
          Math.min(95, 92 + Math.sin(i * 0.04) * 3 + timeVariation * 2)
        ),
        powerConsumption: Math.max(
          0,
          4.5 + Math.sin(i * 0.06) * 0.5 + timeVariation * 0.3
        ),
        systemHealth: Math.max(
          60,
          Math.min(100, 95 - Math.sin(i * 0.08) * 5 + timeVariation * 3)
        ),
        // Additional physics-based fields
        voltage: 240 + Math.sin(i * 0.02) * 10,
        current: 18.5 + Math.sin(i * 0.05) * 2,
        powerFactor: 0.85 + Math.sin(i * 0.03) * 0.1,
        humidity: 45 + Math.sin(i * 0.04) * 10,
        ambientTemperature: 22 + Math.sin(i * 0.02) * 3,
        ambientPressure: 1013 + Math.sin(i * 0.01) * 5,
        shaftPosition: Math.sin(i * 0.1) * 180,
        displacement: Math.sin(i * 0.08) * 0.5,
        strainGauge1: Math.sin(i * 0.06) * 100,
        strainGauge2: Math.sin(i * 0.07) * 100,
        strainGauge3: Math.sin(i * 0.05) * 100,
        soundLevel: 65 + Math.sin(i * 0.09) * 10,
        bearingHealth: Math.max(70, Math.min(100, 90 - Math.sin(i * 0.1) * 5)),
        operatingHours: 8760 + i * 0.1,
        maintenanceStatus: 1,
        vibrationX: Math.sin(i * 0.1) * 0.5,
        vibrationY: Math.sin(i * 0.12) * 0.5,
        vibrationZ: Math.sin(i * 0.08) * 0.5,
        oilPressure: 2.5 + Math.sin(i * 0.03) * 0.3,
        airPressure: 6.0 + Math.sin(i * 0.04) * 0.5,
        hydraulicPressure: 150 + Math.sin(i * 0.05) * 20,
        coolantFlowRate: 25 + Math.sin(i * 0.06) * 5,
        fuelFlowRate: 12 + Math.sin(i * 0.07) * 2,
        rpm: Math.max(0, 2500 + Math.sin(i * 0.05) * 200),
        torque: 50 + Math.sin(i * 0.08) * 10,
      });
    }

    return fallbackData;
  }, []);

  // Determine which data to use
  const chartData =
    dataSource === "offline" ? generateFallbackData() : readings;

  // Show last 20 readings, sorted oldest to newest (newest on right)
  const data = [...chartData]
    .slice(0, 20)
    .reverse()
    .map((r) => {
      return {
        ...r,
        time: formatTimestamp(r.timestamp, {
          includeTime: true,
          includeSeconds: false,
          useLocalTime: true,
        }),
      };
    });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            📊 Real-time Motor Data Chart
          </h2>

          {/* Data Source Status Indicator */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              dataSource === "backend"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {dataSource === "backend" ? "🔗 LIVE DATA" : "❌ OFFLINE"}
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1 relative cursor-help">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Speed (RPM)</span>
            <PhysicsTooltip
              content={<SpeedTooltipContent />}
              children={
                <div className="absolute inset-0 cursor-help opacity-0" />
              }
            />
          </div>
          <div className="flex items-center space-x-1 relative cursor-help">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Temperature (°C)</span>
            <PhysicsTooltip
              content={<TemperatureTooltipContent />}
              children={
                <div className="absolute inset-0 cursor-help opacity-0" />
              }
            />
          </div>
          <div className="flex items-center space-x-1 relative cursor-help">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Efficiency (%)</span>
            <PhysicsTooltip
              content={<EfficiencyTooltipContent />}
              children={
                <div className="absolute inset-0 cursor-help opacity-0" />
              }
            />
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
