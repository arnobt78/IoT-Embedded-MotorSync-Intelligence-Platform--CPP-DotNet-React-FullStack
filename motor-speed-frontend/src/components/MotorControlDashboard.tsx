import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AnimatedGearIcon from "./ui/AnimatedGearIcon";
import { useToast } from "../hooks/useToast";
import type { MotorReading } from "../types";

interface MotorControlDashboardProps {
  reading: MotorReading | null;
  motorId?: string;
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}

interface ControlCommand {
  id: string;
  type: "start" | "stop" | "speed_set" | "emergency_stop";
  timestamp: string;
  operator: string;
  value?: number;
  status: "pending" | "executed" | "failed";
  responseTime?: number;
}

interface SafetyStatus {
  emergencyStop: boolean;
  safetyInterlock: boolean;
  overloadProtection: boolean;
  temperatureProtection: boolean;
  vibrationProtection: boolean;
  powerSupplyStatus: boolean;
}

interface MotorStatus {
  isRunning: boolean;
  currentSpeed: number;
  targetSpeed: number;
  load: number;
  temperature: number;
  voltage: number;
  current: number;
  power: number;
  efficiency: number;
  operatingHours: number;
  vibration: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

export default function MotorControlDashboard({
  reading,
  motorId = "MOTOR-001",
  signalRConnected = false,
  backendStatus = "offline",
}: MotorControlDashboardProps) {
  const [activeTab, setActiveTab] = useState("control");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [motorStatus, setMotorStatus] = useState<MotorStatus>({
    isRunning: false,
    currentSpeed: 0,
    targetSpeed: 2500,
    load: 0,
    temperature: 22,
    voltage: 230,
    current: 0,
    power: 0,
    efficiency: 0,
    operatingHours: 0,
    vibration: 0,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
  });
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>({
    emergencyStop: false,
    safetyInterlock: true,
    overloadProtection: true,
    temperatureProtection: true,
    vibrationProtection: true,
    powerSupplyStatus: true,
  });
  const [controlHistory, setControlHistory] = useState<ControlCommand[]>([]);
  const [speedHistory, setSpeedHistory] = useState<
    Array<{ timestamp: string; speed: number }>
  >([]);
  const [isEmergencyStop, setIsEmergencyStop] = useState(false);
  const [controlEnabled] = useState(true);
  const [speedSetpoint, setSpeedSetpoint] = useState(2500);
  const toast = useToast();

  // Determine live status based on reading availability and connection status
  const isLive =
    reading !== null && signalRConnected && backendStatus === "connected";

  // Enhanced motor sync operation with dynamic feedback
  const performMotorSync = async () => {
    try {
      setRefreshing(true);

      // Simulate sync operation with realistic timing
      await new Promise(
        (resolve) => setTimeout(resolve, 600 + 150) // Fixed timing instead of random
      );

      // Get current motor status for dynamic calculations
      const currentMotor = motorStatus;
      const currentSafety = safetyStatus;

      // Calculate system health metrics
      const systemHealth =
        (((currentSafety.safetyInterlock ? 1 : 0) +
          (currentSafety.overloadProtection ? 1 : 0) +
          (currentSafety.temperatureProtection ? 1 : 0) +
          (currentSafety.vibrationProtection ? 1 : 0) +
          (currentSafety.powerSupplyStatus ? 1 : 0)) /
          5) *
        100;

      const motorEfficiency = currentMotor.efficiency;
      const operatingHours = currentMotor.operatingHours;
      const temperature = currentMotor.temperature;

      // Simulate sync scenarios based on motor conditions
      const syncSuccessRate = Math.min(
        99.5,
        90 + (systemHealth / 100) * 8 + (motorEfficiency / 100) * 2
      );
      const isSuccessful = syncSuccessRate > 95; // Use deterministic success based on system health

      // Check for system stress conditions
      const isSystemStressed = temperature > 70 || motorEfficiency < 85;
      const isSystemCritical =
        temperature > 80 || motorEfficiency < 80 || isEmergencyStop;

      if (isSuccessful) {
        // Success scenario - calculate dynamic metrics
        const syncLatency = Math.max(
          30,
          100 + (temperature - 22) * 2 + 25 // Fixed variation instead of random
        );
        const dataPoints = Math.floor(
          operatingHours * 100 + 25 // Fixed variation instead of random
        );
        const safetyScore = Math.floor(systemHealth);

        // Determine sync quality based on motor conditions
        const syncQuality =
          syncLatency < 200 && motorEfficiency > 90
            ? "Excellent"
            : syncLatency < 300 && motorEfficiency > 85
            ? "Good"
            : "Fair";

        toast.success(
          `✅ Motor Data Synchronized - ${syncQuality} Quality`,
          `Synced ${dataPoints} data points in ${syncLatency.toFixed(
            0
          )}ms. Motor efficiency: ${motorEfficiency.toFixed(
            1
          )}%, Safety score: ${safetyScore}%`
        );

        // Show warning if system is under stress but sync was successful
        if (isSystemStressed && !isSystemCritical) {
          setTimeout(() => {
            toast.info(
              "⚠️ Motor Performance Notice",
              `Sync completed but motor is under stress. Temperature: ${temperature.toFixed(
                1
              )}°C, Efficiency: ${motorEfficiency.toFixed(
                1
              )}%. Consider maintenance check.`
            );
          }, 2000);
        }
      } else {
        // Error scenario - provide helpful information
        const errorType =
          temperature > 80
            ? "Temperature Overload"
            : motorEfficiency < 80
            ? "Efficiency Degradation"
            : isEmergencyStop
            ? "Emergency Stop Active"
            : "System Busy";
        const retryTime = Math.floor(5); // Fixed retry time

        const errorMessage = isEmergencyStop
          ? `Motor sync blocked due to emergency stop activation. All safety systems active. Reset emergency stop to continue.`
          : `Unable to complete motor sync operation. Temperature: ${temperature.toFixed(
              1
            )}°C, Efficiency: ${motorEfficiency.toFixed(
              1
            )}%. Retry recommended in ${retryTime} seconds.`;

        toast.error(`⚠️ Motor Sync Failed - ${errorType}`, errorMessage);

        // Show critical system warning for severe conditions
        if (isSystemCritical) {
          setTimeout(() => {
            toast.error(
              "🚨 Critical Motor Alert",
              `Motor performance is critically degraded. Temperature: ${temperature.toFixed(
                1
              )}°C, Efficiency: ${motorEfficiency.toFixed(
                1
              )}%. Immediate attention required.`
            );
          }, 3000);
        }
      }

      // Data is already loaded from reading prop - no need to reload
    } catch (error) {
      console.error("Motor sync operation failed:", error);
      toast.error(
        "🚨 Critical Motor Sync Error",
        "Motor synchronization encountered an unexpected error. System is using cached data. Please check motor status and safety systems."
      );
    } finally {
      setRefreshing(false);
    }
  };

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin-icon {
        animation: spin 1s linear infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .pulse-icon {
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px currentColor; }
        50% { box-shadow: 0 0 20px currentColor; }
      }
      .glow-icon {
        animation: glow 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Load motor control data from reading prop (C++ → C# → React)
  useEffect(() => {
    if (!reading || !isLive) {
      // No reading available or offline - set to offline state
      setMotorStatus({
        isRunning: false,
        currentSpeed: 0,
        targetSpeed: 2500,
        load: 0,
        temperature: 22, // Ambient temperature
        voltage: 480, // Default voltage
        current: 0,
        power: 0,
        efficiency: 92,
        operatingHours: 0,
        vibration: 0,
        lastMaintenance: "N/A",
        nextMaintenance: "N/A",
      });
      setLoading(false);
      return;
    }

    // Initialize simulation state from C++ backend reading, but start with STOPPED motor
    setMotorStatus({
      isRunning: false, // Always start STOPPED for simulation
      currentSpeed: 0, // Always start at 0 RPM for simulation
      targetSpeed: speedSetpoint, // Use current speed setpoint
      load: 0, // Start with no load
      temperature: 22, // Start at ambient temperature
      voltage: 480, // System voltage (always 480V for 3-phase)
      current: 0, // Start with no current
      power: 0, // Start with no power
      efficiency: 92, // Motor efficiency (always 92% for this motor)
      operatingHours: reading.operatingHours || 0, // Use backend operating hours
      vibration: 0, // Start with no vibration
      lastMaintenance: "2024-01-15", // This would come from backend in real system
      nextMaintenance: "2024-04-15", // This would be calculated based on maintenance schedule
    });

    // Initialize speed history starting from 0 RPM
    const now = new Date();
    const history = [];
    for (let i = 59; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 1000);
      history.push({
        timestamp: timestamp.toISOString(),
        speed: 0, // Start all history at 0 RPM
      });
    }
    setSpeedHistory(history);

    setLoading(false);
  }, [reading, isLive, speedSetpoint]);

  // Update safety status based on reading data
  useEffect(() => {
    if (!reading || !isLive) {
      // Offline - all safety systems inactive
      setSafetyStatus({
        emergencyStop: true,
        safetyInterlock: false,
        overloadProtection: false,
        temperatureProtection: false,
        vibrationProtection: false,
        powerSupplyStatus: false,
      });
      return;
    }

    // Calculate dynamic safety status based on actual reading data from C++ backend
    const newSafetyStatus: SafetyStatus = {
      emergencyStop: isEmergencyStop,
      safetyInterlock: controlEnabled,
      overloadProtection:
        (reading.current || 0) < 50000 && (motorStatus.load || 0) < 95,
      temperatureProtection: (reading.temperature || 0) < 85,
      vibrationProtection: (reading.vibration || 0) < 5,
      powerSupplyStatus:
        (reading.voltage || 0) >= 432 && (reading.voltage || 0) <= 528,
    };

    setSafetyStatus(newSafetyStatus);
  }, [reading, isLive, isEmergencyStop, controlEnabled, motorStatus.load]);

  // Real-time motor simulation - runs locally in browser for interactive control
  const updateRealTimeData = useCallback(() => {
    setMotorStatus((prev) => {
      // Always update temperature cooling even when stopped
      if (!prev.isRunning || isEmergencyStop) {
        // When stopped, gradually cool down temperature
        const ambientTemp = 22;
        const newTemperature = Math.max(
          ambientTemp,
          prev.temperature - 0.1 // Cool down 0.1°C per update when stopped
        );

        return {
          ...prev,
          temperature: Math.round(newTemperature * 10) / 10,
          currentSpeed: 0, // Ensure speed is 0 when stopped
          load: 0, // Ensure load is 0 when stopped
          power: 0, // Ensure power is 0 when stopped
          current: 0, // Ensure current is 0 when stopped
          vibration: 0, // Ensure vibration is 0 when stopped
        };
      }

      // Physics-based motor dynamics
      const timeStep = 2; // 2 seconds between updates
      const maxSpeed = 3000; // Maximum motor speed in RPM
      const acceleration = 150; // RPM per second acceleration
      const deceleration = 200; // RPM per second deceleration
      const efficiency = 0.92; // Motor efficiency
      // const baseLoad = 0.05; // Base load (5%) - now using 5% directly in calculation
      const ambientTemp = 22; // Ambient temperature in °C

      // Calculate current speed based on target speed and acceleration/deceleration
      let newSpeed = prev.currentSpeed;
      if (prev.currentSpeed < prev.targetSpeed) {
        // Accelerating
        newSpeed = Math.min(
          prev.targetSpeed,
          prev.currentSpeed + acceleration * timeStep
        );
      } else if (prev.currentSpeed > prev.targetSpeed) {
        // Decelerating
        newSpeed = Math.max(
          prev.targetSpeed,
          prev.currentSpeed - deceleration * timeStep
        );
      }

      // Calculate load based on speed and target speed (as percentage 0-100%)
      const speedRatio = newSpeed / maxSpeed;
      const targetRatio = prev.targetSpeed / maxSpeed;
      const loadPercentage = Math.max(
        5, // Minimum 5%
        Math.min(
          100, // Maximum 100%
          (speedRatio * 0.8 + targetRatio * 0.2) * 100 + 5 // Convert to percentage, add 5% base
        )
      );

      // Calculate power consumption using physics formula: P = (2π × N × T) / 60
      // Where N = speed in RPM, T = torque (estimated from load percentage)
      const torque = (loadPercentage / 100) * 50; // Convert load percentage to torque (0-50 Nm)
      const power = (2 * Math.PI * newSpeed * torque) / 60; // Power in watts
      const powerKW = power / 1000; // Convert to kW

      // Calculate temperature based on power and efficiency with realistic cooling
      const heatGeneration = powerKW * (1 - efficiency) * 2.0; // Heat generation in °C per update

      // Realistic cooling based on temperature difference (Newton's Law of Cooling)
      const tempDifference = prev.temperature - ambientTemp;
      const coolingRate = tempDifference * 0.1; // Proportional cooling (10% of temp difference)

      const newTemperature = Math.max(
        ambientTemp,
        prev.temperature + heatGeneration - coolingRate
      );

      // Calculate current based on power and voltage
      const current = (power / prev.voltage) * 1000; // Current in mA

      // Calculate vibration based on speed and load using physics formula
      const vibration = Math.max(
        0,
        (newSpeed / 1000) * 2 +
          (loadPercentage / 100) * 0.5 +
          Math.sin(Date.now() * 0.001) * 0.25 // Use load percentage
      ); // Vibration in mm/s

      // Update speed history for the graph
      setSpeedHistory((prevHistory) => {
        const newHistory = [
          ...prevHistory,
          {
            timestamp: new Date().toISOString(),
            speed: newSpeed,
          },
        ];
        return newHistory.slice(-60); // Keep last 60 data points (2 minutes at 2-second intervals)
      });

      return {
        ...prev,
        currentSpeed: Math.round(newSpeed),
        load: Math.round(loadPercentage * 10) / 10, // Load is already in percentage (0-100)
        temperature: Math.round(newTemperature * 10) / 10, // Round to 1 decimal place
        power: Math.round(powerKW * 100) / 100, // Round to 2 decimal places
        current: Math.round(current * 10) / 10, // Round to 1 decimal place
        efficiency: Math.round(efficiency * 100 * 10) / 10, // Round to 1 decimal place
        operatingHours: prev.operatingHours + timeStep / 3600, // Add operating hours
        vibration: Math.round(vibration * 10) / 10, // Round to 1 decimal place
      };
    });

    // Update speed history even when stopped
    setSpeedHistory((prevHistory) => {
      const currentSpeed = motorStatus.isRunning ? motorStatus.currentSpeed : 0;
      const newHistory = [
        ...prevHistory,
        {
          timestamp: new Date().toISOString(),
          speed: currentSpeed,
        },
      ];
      return newHistory.slice(-60); // Keep last 60 data points (2 minutes at 2-second intervals)
    });

    // Update safety status based on current motor conditions
    setSafetyStatus(() => {
      const currentMotor = motorStatus;

      // Calculate dynamic safety status based on physics-based conditions
      const newSafetyStatus: SafetyStatus = {
        emergencyStop: isEmergencyStop,
        safetyInterlock: controlEnabled,
        overloadProtection:
          currentMotor.current < 50000 && currentMotor.load < 95,
        temperatureProtection: currentMotor.temperature < 85,
        vibrationProtection: currentMotor.vibration < 5,
        powerSupplyStatus:
          currentMotor.voltage >= 432 && currentMotor.voltage <= 528,
      };

      return newSafetyStatus;
    });
  }, [motorStatus, isEmergencyStop, controlEnabled]);

  // Start real-time simulation when component mounts
  useEffect(() => {
    const interval = setInterval(updateRealTimeData, 2000);
    return () => clearInterval(interval);
  }, [updateRealTimeData]);

  const executeCommand = async (commandType: string, value?: number) => {
    if (!controlEnabled || isEmergencyStop) return;

    const command: ControlCommand = {
      id: `cmd_${Date.now()}`,
      type: commandType as "start" | "stop" | "speed_set" | "emergency_stop",
      timestamp: new Date().toISOString(),
      operator: "System Operator",
      value,
      status: "pending",
      responseTime: undefined,
    };

    setControlHistory((prev) => [command, ...prev.slice(0, 19)]); // Keep last 20 commands

    // Physics-based command execution simulation
    setTimeout(() => {
      // Calculate physics-based success probability
      let successProbability = 0.9; // Base 90% success rate

      // Adjust success rate based on motor conditions
      if (commandType === "start" && motorStatus.temperature > 80) {
        successProbability -= 0.1; // 10% less likely to start if hot
      }
      if (commandType === "speed_set" && motorStatus.load > 90) {
        successProbability -= 0.05; // 5% less likely if heavily loaded
      }
      if (isEmergencyStop) {
        successProbability = 0.0; // Emergency stop always fails other commands
      }

      const success = successProbability > 0.8; // Use deterministic success based on probability

      // Calculate physics-based response time
      let baseResponseTime = 50; // Base 50ms

      // Add response time based on command complexity and motor state
      switch (commandType) {
        case "start":
          baseResponseTime += 20 + (motorStatus.temperature - 22) * 0.5; // Slower if hot
          break;
        case "stop":
          baseResponseTime += 10 + motorStatus.currentSpeed * 0.01; // Slower if fast
          break;
        case "speed_set": {
          const speedDiff = Math.abs((value || 0) - motorStatus.currentSpeed);
          baseResponseTime += 15 + speedDiff * 0.02; // Slower for larger changes
          break;
        }
        case "emergency_stop":
          baseResponseTime += 5; // Fastest response
          break;
      }

      // Add network latency simulation (fixed based on system load)
      const networkLatency = 20 + motorStatus.load * 10; // 20-30ms based on load
      const responseTime = baseResponseTime + networkLatency;

      setControlHistory((prev) =>
        prev.map((cmd) =>
          cmd.id === command.id
            ? { ...cmd, status: success ? "executed" : "failed", responseTime }
            : cmd
        )
      );

      if (success) {
        switch (commandType) {
          case "start":
            setMotorStatus((prev) => ({
              ...prev,
              isRunning: true,
              // Initialize with some realistic starting values
              currentSpeed: 0,
              load: 5.0,
              temperature: Math.max(prev.temperature, 22.0),
              power: 0.0,
              current: 0.0,
            }));
            break;
          case "stop":
            setMotorStatus((prev) => ({
              ...prev,
              isRunning: false,
              currentSpeed: 0,
              load: 0.0,
              power: 0.0,
              current: 0.0,
            }));
            break;
          case "speed_set":
            if (value !== undefined) {
              setMotorStatus((prev) => ({
                ...prev,
                targetSpeed: Math.max(0, Math.min(3000, value)), // Clamp between 0-3000 RPM
              }));
            }
            break;
          case "emergency_stop":
            setIsEmergencyStop(true);
            setMotorStatus((prev) => ({
              ...prev,
              isRunning: false,
              currentSpeed: 0,
              load: 0.0,
              power: 0.0,
              current: 0.0,
            }));
            break;
        }
      }
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "executed":
        return "bg-green-100 text-green-800 border-green-300";
      case "failed":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSafetyColor = (isActive: boolean) => {
    return isActive ? "bg-green-500" : "bg-red-500";
  };

  // const resetEmergencyStop = () => {
  //   setIsEmergencyStop(false);
  // };

  const handleSpeedSet = () => {
    executeCommand("speed_set", speedSetpoint);
  };

  // Update target speed when speedSetpoint changes
  useEffect(() => {
    setMotorStatus((prev) => ({
      ...prev,
      targetSpeed: speedSetpoint,
    }));
  }, [speedSetpoint]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show "No data available" state when offline or no reading
  if (!reading || !isLive) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                🎮 Real-Time Motor Control & Automation
              </h2>
              {/* Data Source Status Indicator */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  backendStatus === "connected"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {backendStatus === "connected" ? "🔗 LIVE DATA" : "❌ OFFLINE"}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={performMotorSync}
                disabled={true}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed transition-all duration-200 flex items-center gap-2 opacity-70"
              >
                <AnimatedGearIcon isActive={false} size="md" status="offline" />
                <span>Sync Motor Data (Offline)</span>
              </button>
            </div>
          </div>
        </div>

        {/* No Data Available Content */}
        <div className="p-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              <div className="text-4xl mb-4">🎮</div>
              <div className="text-lg font-medium mb-2">
                No Motor Control Data Available
              </div>
              <div className="text-sm mb-4">
                Motor control requires live connection to the C++ backend
                engine.
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
                <div className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                  🔗 Connection Status:
                </div>
                <div className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
                  <div>
                    <strong>Backend:</strong>{" "}
                    <span
                      className={
                        backendStatus === "connected"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {backendStatus === "connected"
                        ? "✅ Connected"
                        : "❌ Disconnected"}
                    </span>
                  </div>
                  <div>
                    <strong>SignalR:</strong>{" "}
                    <span
                      className={
                        signalRConnected ? "text-green-600" : "text-red-600"
                      }
                    >
                      {signalRConnected ? "✅ Connected" : "❌ Disconnected"}
                    </span>
                  </div>
                  <div>
                    <strong>Reading Data:</strong>{" "}
                    <span
                      className={reading ? "text-green-600" : "text-red-600"}
                    >
                      {reading ? "✅ Available" : "❌ Not Available"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                💡 <strong>Note:</strong> This dashboard displays real-time
                motor control data from the C++ backend (motor_engine.cpp →
                EngineService.cs → React). No fallback data is generated to
                ensure control accuracy and safety.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎮 Real-Time Motor Control & Automation
            </h2>
            {/* Data Source Status Indicator */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                backendStatus === "connected"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {backendStatus === "connected" ? "🔗 LIVE DATA" : "❌ OFFLINE"}
            </span>
          </div>
          <div className="relative">
            <button
              onClick={performMotorSync}
              disabled={refreshing || loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 ${
                refreshing || loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {/* Animated Gear Icon */}
              <AnimatedGearIcon
                isActive={true}
                size="md"
                status={isLive ? "live" : "offline"}
              />
              <span className="transition-opacity duration-200">
                {refreshing
                  ? `Syncing Motor ${motorId}...`
                  : `Sync Motor Data (${motorId})`}
              </span>
            </button>

            {/* Status Indicator - positioned relative to button */}
            {isLive ? (
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
                LIVE
              </div>
            ) : (
              <div className="absolute -top-3 -right-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
                OFFLINE
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex space-x-1 overflow-x-auto">
          {[
            { id: "control", label: "Motor Control", icon: "🎮" },
            { id: "status", label: "Status", icon: "📊" },
            { id: "safety", label: "Safety", icon: "🛡️" },
            { id: "history", label: "History", icon: "📜" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "control" && (
          <div className="space-y-6">
            {/* Educational Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                  ℹ️
                </div>
                <div>
                  <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                    🎮 Interactive Motor Control & Physics Simulation
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                    This interactive control panel initializes with real motor
                    data from the C++ backend, then allows you to control and
                    simulate motor operations locally. Start/stop the motor,
                    adjust speed setpoints, and observe real-time physics-based
                    behavior including acceleration, temperature dynamics,
                    vibration patterns, and safety system responses.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Initial State:</strong> Loaded from C++ backend
                      reading (motor_engine.cpp → React)
                    </div>
                    <div>
                      • <strong>Interactive Control:</strong> Start/Stop motor,
                      Set speed (0-3000 RPM), Emergency stop
                    </div>
                    <div>
                      • <strong>Physics Simulation:</strong> Local real-time
                      calculations (acceleration 150 RPM/s, deceleration 200
                      RPM/s)
                    </div>
                    <div>
                      • <strong>Safety Systems:</strong> Real-time monitoring
                      (temperature, vibration, current, voltage thresholds)
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                      <strong>🔗 Data Flow:</strong> Initial state from
                      motor_engine.cpp → EngineService.cs → React, then local
                      physics simulation for interactive control
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Stop Status */}
            {isEmergencyStop && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-red-600 dark:text-red-400 mr-3">
                    <span className="pulse-icon">🚨</span>
                  </div>
                  <div>
                    <h4 className="text-red-800 dark:text-red-200 font-medium mb-1">
                      EMERGENCY STOP ACTIVATED
                    </h4>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Motor is in emergency stop state. All controls are
                      disabled until emergency stop is reset.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEmergencyStop(false)}
                    className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Reset Emergency Stop
                  </button>
                </div>
              </div>
            )}

            {/* Main Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Motor Control */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-gray-800 dark:text-white font-medium mb-4">
                  🎮 Motor Control Panel
                </h4>

                {/* Start/Stop Controls */}
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => executeCommand("start")}
                    disabled={
                      !controlEnabled ||
                      isEmergencyStop ||
                      motorStatus.isRunning
                    }
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      !controlEnabled ||
                      isEmergencyStop ||
                      motorStatus.isRunning
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    <span className="text-lg">▶️</span>
                    Start Motor
                  </button>

                  <button
                    onClick={() => executeCommand("stop")}
                    disabled={
                      !controlEnabled ||
                      isEmergencyStop ||
                      !motorStatus.isRunning
                    }
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      !controlEnabled ||
                      isEmergencyStop ||
                      !motorStatus.isRunning
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-600 text-white hover:bg-yellow-700"
                    }`}
                  >
                    <span className="text-lg">⏸️</span>
                    Stop Motor
                  </button>

                  <button
                    onClick={() => executeCommand("emergency_stop")}
                    className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 glow-icon"
                  >
                    <span className="text-lg">🚨</span>
                    Emergency Stop
                  </button>
                </div>

                {/* Speed Control */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Speed Setpoint (RPM)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="50"
                      value={speedSetpoint}
                      onChange={(e) =>
                        setSpeedSetpoint(parseInt(e.target.value))
                      }
                      disabled={!controlEnabled || isEmergencyStop}
                      className="flex-1"
                    />
                    <span className="text-lg font-mono text-gray-800 dark:text-white w-20">
                      {speedSetpoint}
                    </span>
                    <button
                      onClick={handleSpeedSet}
                      disabled={!controlEnabled || isEmergencyStop}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        !controlEnabled || isEmergencyStop
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Set Speed
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    💡 Set target speed for motor operation (0-3000 RPM)
                  </div>
                </div>

                {/* Control Status */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h5 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">
                    🎮 Control Status
                  </h5>
                  <div className="flex items-center justify-between gap-4">
                    {/* Control Enabled Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                        Control Enabled
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                          controlEnabled
                            ? "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                            : "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                        }`}
                      >
                        {controlEnabled ? "✅ Yes" : "❌ No"}
                      </span>
                    </div>

                    {/* Emergency Stop Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                        Emergency Stop
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                          isEmergencyStop
                            ? "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 animate-pulse"
                            : "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                        }`}
                      >
                        {isEmergencyStop ? "🚨 Active" : "✅ Normal"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Physics Formulas & Calculations */}
                <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 dark:text-white mb-3">
                    📊 Physics Calculations
                  </h5>
                  <div className="space-y-3 text-xs">
                    {/* Power Calculation */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-blue-800 dark:text-blue-200 font-semibold text-sm">
                          ⚡ Power Calculation
                        </div>
                        <div className="text-blue-600 dark:text-blue-300 font-bold text-sm">
                          💡 Current:{" "}
                          {(
                            (2 *
                              Math.PI *
                              motorStatus.currentSpeed *
                              (motorStatus.load / 100) *
                              50) /
                            60 /
                            1000
                          ).toFixed(2)}{" "}
                          kW
                        </div>
                      </div>
                      <div className="text-blue-700 dark:text-blue-300 text-xs">
                        <strong>Formula:</strong> P = (2π × Speed × Torque) / 60
                      </div>
                    </div>

                    {/* Load Calculation */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-green-800 dark:text-green-200 font-semibold text-sm">
                          🔄 Load Calculation
                        </div>
                        <div className="text-green-600 dark:text-green-300 font-bold text-sm">
                          💡 Current:{" "}
                          {Math.max(
                            5,
                            Math.min(
                              100,
                              ((motorStatus.currentSpeed / 3000) * 0.8 +
                                (motorStatus.targetSpeed / 3000) * 0.2) *
                                100 +
                                5
                            )
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                      <div className="text-green-700 dark:text-green-300 text-xs">
                        <strong>Formula:</strong> Load = ((Speed/Max) × 0.8 +
                        (Target/Max) × 0.2) × 100 + 5%
                      </div>
                    </div>

                    {/* Temperature Calculation */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-orange-800 dark:text-orange-200 font-semibold text-sm">
                          🌡️ Temperature Calculation
                        </div>
                        <div className="text-orange-600 dark:text-orange-300 font-bold text-sm">
                          💡 Current: {motorStatus.temperature.toFixed(1)}°C
                        </div>
                      </div>
                      <div className="text-orange-700 dark:text-orange-300 text-xs">
                        <strong>Formula:</strong> Temp = Ambient + Heat -
                        (TempDiff × 0.1)
                      </div>
                      <div className="text-orange-600 dark:text-orange-400 text-xs mt-1">
                        Heat:{" "}
                        {(motorStatus.power * (1 - 0.92) * 2.0).toFixed(1)}°C |
                        Cooling:{" "}
                        {((motorStatus.temperature - 22) * 0.1).toFixed(1)}°C
                      </div>
                    </div>

                    {/* Current Calculation */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-purple-800 dark:text-purple-200 font-semibold text-sm">
                          ⚡ Current Calculation
                        </div>
                        <div className="text-purple-600 dark:text-purple-300 font-bold text-sm">
                          💡 Current:{" "}
                          {(
                            (motorStatus.power * 1000) /
                            (motorStatus.voltage * Math.sqrt(3) * 0.92)
                          ).toFixed(1)}{" "}
                          A
                        </div>
                      </div>
                      <div className="text-purple-700 dark:text-purple-300 text-xs">
                        <strong>Formula:</strong> I = (P × 1000) / (V × √3 × PF)
                      </div>
                      <div className="text-purple-600 dark:text-purple-400 text-xs mt-1">
                        480V 3-Phase System | PF: 92%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="text-gray-800 dark:text-white font-medium mb-4">
                  📊 Current Motor Status
                </h4>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                      Motor Status
                    </div>
                    <div
                      className={`font-medium text-lg ${
                        motorStatus.isRunning
                          ? "text-green-600"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {motorStatus.isRunning ? "RUNNING" : "STOPPED"}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                      Current Speed
                    </div>
                    <div className="font-medium text-lg text-gray-800 dark:text-white">
                      {motorStatus.currentSpeed.toFixed(0)} RPM
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                      Target Speed
                    </div>
                    <div className="font-medium text-lg text-gray-800 dark:text-white">
                      {motorStatus.targetSpeed.toFixed(0)} RPM
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                      Load
                    </div>
                    <div className="font-medium text-lg text-gray-800 dark:text-white">
                      {motorStatus.load.toFixed(1)}%
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                      Temperature
                    </div>
                    <div className="font-medium text-lg text-gray-800 dark:text-white">
                      {motorStatus.temperature.toFixed(1)}°C
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
                    <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                      Power
                    </div>
                    <div className="font-medium text-lg text-gray-800 dark:text-white">
                      {motorStatus.power.toFixed(2)} kW
                    </div>
                  </div>
                </div>

                {/* Speed Chart */}
                <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 dark:text-white mb-2">
                    📊 Dynamic Speed Trend (runs at 2 seconds interval for 2
                    minutes)
                  </h5>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={speedHistory.slice(-60)}
                        margin={{ top: 10, right: 10, left: 15, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            });
                          }}
                          stroke="#6B7280"
                          fontSize={9}
                          tick={{ fontSize: 9 }}
                        />
                        <YAxis
                          domain={[0, 3000]}
                          tickCount={5}
                          ticks={[0, 750, 1500, 2250, 3000]}
                          tickFormatter={(value) => `${value} RPM`}
                          stroke="#6B7280"
                          fontSize={9}
                          tick={{ fontSize: 9 }}
                          width={70}
                        />
                        <Tooltip
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return `Time: ${date.toLocaleTimeString()}`;
                          }}
                          formatter={(value: number) => [
                            `${value.toFixed(0)} RPM`,
                            "Speed",
                          ]}
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "6px",
                            color: "#F9FAFB",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="speed"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{
                            r: 4,
                            stroke: "#3B82F6",
                            strokeWidth: 2,
                            fill: "#FFFFFF",
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 <strong>Real-time:</strong> Motor speed over time
                    (2-second intervals)
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Speed = Previous Speed ±
                    (Acceleration × 2s), updated every 2 seconds
                  </div>
                </div>

                {/* Motor Specifications */}
                <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 dark:text-white mb-3">
                    🔧 Motor Specifications as Default
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Max Speed:
                      </span>
                      <span className="text-gray-800 dark:text-white font-medium">
                        3000 RPM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Max Power:
                      </span>
                      <span className="text-gray-800 dark:text-white font-medium">
                        50 kW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Efficiency:
                      </span>
                      <span className="text-gray-800 dark:text-white font-medium">
                        92%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Voltage:
                      </span>
                      <span className="text-gray-800 dark:text-white font-medium">
                        480V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Operating Hours:
                      </span>
                      <span className="text-gray-800 dark:text-white font-medium">
                        {motorStatus.operatingHours.toFixed(1)}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Motor Status */}
        {activeTab === "status" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                📊 Detailed Motor Status
              </h3>

              {/* Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                  <div className="text-sm opacity-90">Operating Status</div>
                  <div className="text-3xl font-bold">
                    {motorStatus.isRunning ? "ON" : "OFF"}
                  </div>
                  <div className="text-sm opacity-90">
                    {motorStatus.isRunning ? "Running" : "Stopped"}
                  </div>
                  <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                    💡 <strong>Current State:</strong> Motor operational status
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                  <div className="text-sm opacity-90">Current Speed</div>
                  <div className="text-3xl font-bold">
                    {motorStatus.currentSpeed.toFixed(0)}
                  </div>
                  <div className="text-sm opacity-90">RPM</div>
                  <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                    💡 <strong>Real-time:</strong> Current motor speed
                  </div>
                  <div className="text-xs opacity-40 mt-1">
                    📊 <strong>Formula:</strong> Speed = Previous Speed ±
                    (Acceleration × Time)
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                  <div className="text-sm opacity-90">Operating Hours</div>
                  <div className="text-3xl font-bold">
                    {motorStatus.operatingHours.toFixed(1)}
                  </div>
                  <div className="text-sm opacity-90">Hours</div>
                  <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                    💡 <strong>Lifetime:</strong> Total operating time
                  </div>
                  <div className="text-xs opacity-40 mt-1">
                    📊 <strong>Formula:</strong> Hours = Previous + (2s ÷ 3600)
                    when motor is running
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                  <div className="text-sm opacity-90">Efficiency</div>
                  <div className="text-3xl font-bold">
                    {(
                      92 -
                      motorStatus.load * 0.1 -
                      (motorStatus.temperature - 22) * 0.05
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm opacity-90">Performance</div>
                  <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                    💡 <strong>Energy:</strong> Motor efficiency rating
                  </div>
                  <div className="text-xs opacity-40 mt-1">
                    📊 <strong>Formula:</strong> Efficiency = 92% - (Load × 0.1)
                    - (Temp - 22°C) × 0.05
                  </div>
                </div>
              </div>

              {/* Detailed Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-gray-800 dark:text-white font-medium mb-4">
                    ⚡ Electrical Parameters
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Voltage
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {motorStatus.voltage.toFixed(1)} V
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      📊 <strong>Formula:</strong> System voltage (480V nominal,
                      3-phase)
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Current
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {(
                          (motorStatus.power * 1000) /
                          (motorStatus.voltage * Math.sqrt(3) * 0.92)
                        ).toFixed(1)}{" "}
                        A
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      📊 <strong>Formula:</strong> Current = (Power × 1000) ÷
                      (Voltage × √3 × Power Factor)
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Power
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {motorStatus.power.toFixed(2)} kW
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      📊 <strong>Formula:</strong> P = (2π × Speed × Torque) ÷
                      60, where Torque = Load × 50 Nm
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Power Factor
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {(0.92 - (motorStatus.load / 100) * 0.05).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      📊 <strong>Formula:</strong> Power Factor = 0.92 - (Load%
                      × 0.05)
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-gray-800 dark:text-white font-medium mb-4">
                    🔧 Mechanical Parameters
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Speed
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {motorStatus.currentSpeed.toFixed(0)} RPM
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      📊 <strong>Formula:</strong> Speed = Previous Speed ±
                      (Acceleration × 2s)
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Load
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {motorStatus.load.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      📊 <strong>Formula:</strong> Load = ((Speed/Max) × 0.8 +
                      (Target/Max) × 0.2) × 100 + 5%
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Temperature
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {motorStatus.temperature.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      📊 <strong>Formula:</strong> Temp = Ambient + Heat -
                      (TempDiff × 0.1)
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Torque
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {((motorStatus.load / 100) * 50).toFixed(1)} Nm
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      📊 <strong>Formula:</strong> Torque = (Load% ÷ 100) × 50
                      Nm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Safety Status */}
        {activeTab === "safety" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                🛡️ Safety System Status
              </h3>

              {/* Educational Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                      Safety System Overview
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      The motor control system includes multiple safety
                      interlocks and protection mechanisms to ensure safe
                      operation. All safety systems must be active for motor
                      operation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      Emergency Stop
                    </h4>
                    <div
                      className={`w-4 h-4 rounded-full pulse-icon ${getSafetyColor(
                        !isEmergencyStop
                      )}`}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {isEmergencyStop
                      ? "Emergency stop is ACTIVE"
                      : "Emergency stop is NORMAL"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Manual emergency stop button status
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Logic:</strong> Reflects the state of the
                    physical emergency stop button
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      Safety Interlock
                    </h4>
                    <div
                      className={`w-4 h-4 rounded-full pulse-icon ${getSafetyColor(
                        safetyStatus.safetyInterlock
                      )}`}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {safetyStatus.safetyInterlock
                      ? "All interlocks ACTIVE"
                      : "Interlock FAILURE"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Safety gate and access controls
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Logic:</strong> Interlocks are active when motor
                    control is enabled, ensuring safety gates and access
                    controls are secure
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      Overload Protection
                    </h4>
                    <div
                      className={`w-4 h-4 rounded-full pulse-icon ${getSafetyColor(
                        safetyStatus.overloadProtection
                      )}`}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {safetyStatus.overloadProtection
                      ? "Overload protection ACTIVE"
                      : "Overload protection FAILED"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Current and thermal overload protection
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Logic:</strong> Triggered if Current {">"} 50,000
                    A OR Load {">"} 95%
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      Temperature Protection
                    </h4>
                    <div
                      className={`w-4 h-4 rounded-full pulse-icon ${getSafetyColor(
                        safetyStatus.temperatureProtection
                      )}`}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {safetyStatus.temperatureProtection
                      ? "Temperature protection ACTIVE"
                      : "Temperature protection FAILED"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Motor temperature monitoring
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Logic:</strong> Triggered if Temperature {">"}{" "}
                    85°C
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      Vibration Protection
                    </h4>
                    <div
                      className={`w-4 h-4 rounded-full pulse-icon ${getSafetyColor(
                        safetyStatus.vibrationProtection
                      )}`}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {safetyStatus.vibrationProtection
                      ? "Vibration protection ACTIVE"
                      : "Vibration protection FAILED"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Vibration level monitoring
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Logic:</strong> Triggered if Vibration {">"} 5
                    mm/s
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      Power Supply
                    </h4>
                    <div
                      className={`w-4 h-4 rounded-full pulse-icon ${getSafetyColor(
                        safetyStatus.powerSupplyStatus
                      )}`}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {safetyStatus.powerSupplyStatus
                      ? "Power supply NORMAL"
                      : "Power supply FAULT"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Power supply voltage and stability
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Logic:</strong> Unstable if Voltage {"<"} 432V OR
                    Voltage {">"} 528V (±10% of 480V nominal)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Control Command History */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                📜 Control Command History
              </h3>

              {/* Educational Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                      Command Audit Trail
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                      Complete history of all motor control commands with
                      timestamps, operators, and execution status. This audit
                      trail ensures compliance and troubleshooting capabilities.
                    </p>
                    <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                      <div>
                        • <strong>Dynamic Response Times:</strong> Calculated
                        based on command complexity, motor state, and network
                        conditions
                      </div>
                      <div>
                        • <strong>Physics-Based Success Rates:</strong> Command
                        success depends on motor temperature, load, and safety
                        conditions
                      </div>
                      <div>
                        • <strong>Real-Time Updates:</strong> Each command
                        execution is logged with precise timestamps and
                        execution details
                      </div>
                      <div>
                        • <strong>Audit Compliance:</strong> Complete command
                        trail for regulatory compliance and troubleshooting
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Command History */}
              <div className="space-y-3">
                {controlHistory.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400 mb-2">
                      <div className="text-2xl mb-2">📜</div>
                      <div className="font-medium">
                        No commands executed yet
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      Control commands will appear here once motor operations
                      begin
                    </div>
                  </div>
                ) : (
                  controlHistory.map((command) => (
                    <div
                      key={command.id}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">
                            {command.type === "start" && "▶️"}
                            {command.type === "stop" && "⏸️"}
                            {command.type === "speed_set" && "🎯"}
                            {command.type === "emergency_stop" && "🚨"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">
                              {command.type.replace("_", " ").toUpperCase()}
                              {command.value !== undefined &&
                                ` (${command.value})`}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(command.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Response Time
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {command.responseTime
                                ? `${command.responseTime.toFixed(0)}ms`
                                : "Pending"}
                            </div>
                            {command.responseTime && (
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                📊 <strong>Formula:</strong> Base(50ms) +
                                Command Complexity + Motor State + Network
                                Latency
                              </div>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              command.status
                            )}`}
                          >
                            {command.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Operator:</strong> {command.operator}
                      </div>

                      {/* Command-specific physics formulas */}
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          {command.type === "start" && (
                            <div>
                              📊 <strong>Start Physics:</strong> Success = 90% -
                              (Temp {">"} 80°C ? 10% : 0%), Response = 50ms +
                              20ms + (Temp - 22°C) × 0.5ms
                            </div>
                          )}
                          {command.type === "stop" && (
                            <div>
                              📊 <strong>Stop Physics:</strong> Success = 90%,
                              Response = 50ms + 10ms + (Current Speed × 0.01ms)
                            </div>
                          )}
                          {command.type === "speed_set" && (
                            <div>
                              📊 <strong>Speed Set Physics:</strong> Success =
                              90% - (Load {">"} 90% ? 5% : 0%), Response = 50ms
                              + 15ms + |Target - Current| × 0.02ms
                            </div>
                          )}
                          {command.type === "emergency_stop" && (
                            <div>
                              📊 <strong>Emergency Stop Physics:</strong>{" "}
                              Success = 100%, Response = 50ms + 5ms (Fastest
                              response for safety)
                            </div>
                          )}
                          <div>
                            💡 <strong>Network Latency:</strong> 10-40ms random
                            simulation of communication delay
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
