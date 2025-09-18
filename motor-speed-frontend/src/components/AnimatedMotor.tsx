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

  // Calculate rotation speed based on motor speed (0-5000 RPM -> 0-10 rotations per second)
  const rotationSpeed = Math.min(10, (speed / 5000) * 10);

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
      {/* Motor Housing */}
      <div className="relative w-32 h-32 mx-auto">
        {/* Outer Housing */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full shadow-lg border-4 border-gray-500">
          {/* Motor Shaft */}
          <div
            className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-300"
            style={{
              animation: `spin ${Math.max(
                0.5,
                1 / rotationSpeed
              )}s linear infinite`,
              animationPlayState: speed > 0 ? "running" : "paused",
            }}
          >
            {/* Shaft Center */}
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Rotating Blades */}
            <div className="absolute top-1/2 left-1/2 w-12 h-1 bg-gray-300 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-12 bg-gray-300 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-1 bg-gray-300 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-1 bg-gray-300 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
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
              animation: `pulse ${Math.max(
                0.1,
                0.5 / (vibrationIntensity / 100)
              )}s ease-in-out infinite`,
              opacity: vibrationIntensity / 100,
            }}
          ></div>
        </div>

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
          Motor Status:{" "}
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
            <div className="font-semibold">Speed</div>
            <div className="text-blue-600 dark:text-blue-400">{speed} RPM</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <div className="font-semibold">Temp</div>
            <div className={getTemperatureColor(temperature)}>
              {temperature}°C
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <div className="font-semibold">Vibration</div>
            <div className="text-purple-600 dark:text-purple-400">
              {vibration.toFixed(2)} mm/s
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <div className="font-semibold">Efficiency</div>
            <div className={getEfficiencyColor(efficiency)}>
              {efficiency.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
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
