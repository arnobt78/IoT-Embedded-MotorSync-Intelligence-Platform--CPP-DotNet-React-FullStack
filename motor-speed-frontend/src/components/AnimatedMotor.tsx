import React from "react";
import type { MotorReading } from "../types/types";

interface AnimatedMotorProps {
  reading: MotorReading | null;
  className?: string;
}

export default function AnimatedMotor({
  reading,
  className = "",
}: AnimatedMotorProps) {
  const speed = reading?.speed || 0;
  const temperature = reading?.temperature || 0;
  const vibration = reading?.vibration || 0;
  const efficiency = reading?.efficiency || 0;

  // Calculate rotation speed based on motor speed and status
  const getRotationSpeed = () => {
    if (speed === 0) return 0;

    // Base speed calculation (0-5000 RPM -> 0.5-3 seconds per rotation)
    let baseSpeed = Math.max(0.5, 3 - (speed / 5000) * 2.5);

    // Adjust based on status
    if (reading?.status === "critical") {
      baseSpeed *= 0.3; // Fastest rotation for critical
    } else if (reading?.status === "warning") {
      baseSpeed *= 0.6; // Medium rotation for warning
    } else if (reading?.status === "maintenance") {
      baseSpeed *= 0.8; // Slower rotation for maintenance
    } else {
      baseSpeed *= 1.0; // Normal rotation for normal status
    }

    return baseSpeed;
  };

  const rotationSpeed = getRotationSpeed();

  // Calculate temperature color (blue -> green -> yellow -> red)
  const getTemperatureColor = (temp: number) => {
    if (temp < 30) return "text-blue-500";
    if (temp < 50) return "text-green-500";
    if (temp < 70) return "text-yellow-500";
    if (temp < 85) return "text-orange-500";
    return "text-red-500";
  };

  // Calculate vibration intensity
  const vibrationIntensity = Math.min(100, (vibration / 5.0) * 100);

  // Calculate efficiency color
  const getEfficiencyColor = (eff: number) => {
    if (eff >= 90) return "text-green-500";
    if (eff >= 80) return "text-yellow-500";
    if (eff >= 70) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className={`relative ${className}`}>
      {/* Gear System */}
      <div className="relative w-32 h-32 mx-auto">
        {/* Main Gear */}
        <div
          className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-4 border-gray-500"
          style={{
            animationName: "gearSpin",
            animationDuration: `${rotationSpeed}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: speed > 0 ? "running" : "paused",
            boxShadow:
              temperature > 80
                ? "0 0 20px rgba(239, 68, 68, 0.8)"
                : temperature > 60
                ? "0 0 15px rgba(245, 158, 11, 0.6)"
                : "0 0 10px rgba(34, 197, 94, 0.5)",
          }}
        >
          {/* Gear Teeth - Vertical */}
          <div className="absolute top-0 left-1/2 w-3 h-6 bg-gray-600 transform -translate-x-1/2 rounded-sm"></div>
          <div className="absolute bottom-0 left-1/2 w-3 h-6 bg-gray-600 transform -translate-x-1/2 rounded-sm"></div>

          {/* Gear Teeth - Horizontal */}
          <div className="absolute left-0 top-1/2 w-6 h-3 bg-gray-600 transform -translate-y-1/2 rounded-sm"></div>
          <div className="absolute right-0 top-1/2 w-6 h-3 bg-gray-600 transform -translate-y-1/2 rounded-sm"></div>

          {/* Gear Teeth - Diagonal */}
          <div className="absolute top-2 left-2 w-2 h-4 bg-gray-600 transform rotate-45 rounded-sm"></div>
          <div className="absolute top-2 right-2 w-2 h-4 bg-gray-600 transform -rotate-45 rounded-sm"></div>
          <div className="absolute bottom-2 left-2 w-2 h-4 bg-gray-600 transform -rotate-45 rounded-sm"></div>
          <div className="absolute bottom-2 right-2 w-2 h-4 bg-gray-600 transform rotate-45 rounded-sm"></div>
        </div>

        {/* Center Hub */}
        <div
          className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-300"
          style={{
            animationName: "gearPulse",
            animationDuration: `${Math.max(0.3, rotationSpeed * 0.5)}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        >
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Temperature Indicator */}
        <div
          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white ${getTemperatureColor(
            temperature
          )} bg-current`}
        >
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-current rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Vibration Indicator */}
        <div
          className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"
          style={{
            animationName: "pulse",
            animationDuration: `${Math.max(
              0.1,
              0.5 / (vibrationIntensity / 100)
            )}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            opacity: vibrationIntensity / 100,
          }}
        ></div>

        {/* Status Ring */}
        <div
          className={`absolute inset-0 rounded-full border-4 ${
            reading?.status === "critical"
              ? "border-red-500 animate-pulse"
              : reading?.status === "warning"
              ? "border-yellow-500"
              : reading?.status === "maintenance"
              ? "border-orange-500"
              : "border-green-500"
          }`}
        ></div>
      </div>

      {/* Data Display */}
      <div className="mt-4 space-y-2 text-center">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Gear System Status:{" "}
          <span
            className={`font-bold ${
              reading?.status === "critical"
                ? "text-red-500"
                : reading?.status === "warning"
                ? "text-yellow-500"
                : reading?.status === "maintenance"
                ? "text-orange-500"
                : "text-green-500"
            }`}
          >
            {reading?.status?.toUpperCase() || "OFFLINE"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <div className="font-semibold text-gray-800 dark:text-white">
              Speed
            </div>
            <div className="text-blue-400">{speed} RPM</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <div className="font-semibold text-gray-800 dark:text-white">
              Temperature
            </div>
            <div className={getTemperatureColor(temperature)}>
              {temperature}°C
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <div className="font-semibold text-gray-800 dark:text-white">
              Vibration
            </div>
            <div className="text-purple-400">{vibration.toFixed(2)} mm/s</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <div className="font-semibold text-gray-800 dark:text-white">
              Efficiency
            </div>
            <div className={getEfficiencyColor(efficiency)}>
              {efficiency.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gearSpin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes gearPulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
