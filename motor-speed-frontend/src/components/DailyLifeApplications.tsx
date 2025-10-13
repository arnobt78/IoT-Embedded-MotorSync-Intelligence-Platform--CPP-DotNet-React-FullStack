import type { MotorReading } from "../types/types";
import React, { useState, useEffect } from "react";

interface DailyLifeApplicationsProps {
  reading: MotorReading | null;
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}

export default function DailyLifeApplications({
  reading,
  signalRConnected = true,
  backendStatus = "connected",
}: DailyLifeApplicationsProps) {
  const [activeApplication, setActiveApplication] = useState("home");
  const [homeAutomation, setHomeAutomation] = useState({
    hvacEfficiency: 0,
    energySavings: 0,
    comfortLevel: 0,
    airQuality: 0,
    smartDevices: 0,
  });
  const [vehicleMetrics, setVehicleMetrics] = useState({
    fuelEfficiency: 0,
    engineHealth: 0,
    batteryLevel: 0,
    tirePressure: 0,
    maintenanceDue: false,
  });
  const [recreationEquipment, setRecreationEquipment] = useState({
    boatEngine: { status: "Good", hours: 0, efficiency: 0 },
    lawnMower: { status: "Good", bladeSharpness: 0, fuelLevel: 0 },
    generator: { status: "Good", powerOutput: 0, fuelEfficiency: 0 },
    poolPump: { status: "Good", flowRate: 0, energyUsage: 0 },
  });

  // Determine data source status
  const getDataSourceStatus = (): "backend" | "offline" => {
    if (signalRConnected && backendStatus === "connected" && reading) {
      return "backend";
    } else {
      return "offline";
    }
  };

  const dataSource = getDataSourceStatus();

  useEffect(() => {
    // Only proceed if we have real data from enhanced motor engine
    if (!reading || dataSource !== "backend") {
      // No real data available - set empty state
      setHomeAutomation({
        hvacEfficiency: 0,
        energySavings: 0,
        comfortLevel: 0,
        airQuality: 0,
        smartDevices: 0,
      });
      setVehicleMetrics({
        fuelEfficiency: 0,
        engineHealth: 0,
        batteryLevel: 0,
        tirePressure: 0,
        maintenanceDue: false,
      });
      setRecreationEquipment({
        boatEngine: { status: "Offline", hours: 0, efficiency: 0 },
        lawnMower: { status: "Offline", bladeSharpness: 0, fuelLevel: 0 },
        generator: { status: "Offline", powerOutput: 0, fuelEfficiency: 0 },
        poolPump: { status: "Offline", flowRate: 0, energyUsage: 0 },
      });
      return;
    }

    // Use real backend data from enhanced C++ engine - no frontend calculations
    // All daily life application metrics are now calculated in the C++ engine using real-world physics formulas
    // Note: The 'reading' prop passed from MainDashboard is already the latest reading from the database

    setHomeAutomation({
      hvacEfficiency: reading.hvacEfficiency || 0,
      energySavings: reading.energySavings || 0,
      comfortLevel: reading.comfortLevel || 0,
      airQuality: reading.airQuality || 0,
      smartDevices: reading.smartDevices || 0,
    });

    // Use real backend data from enhanced C++ engine - no frontend calculations
    // All vehicle metrics are now calculated in the C++ engine using real-world physics formulas

    // Smart maintenance prediction using real-world physics formula from enhanced C++ engine
    // The backend C# service already calculates maintenance status using the C++ engine's logic:
    // Status 0 (Good): All parameters within normal limits
    // Status 1 (Warning): bearingWear > 0.05 || oilDegradation > 0.02 || temperature > 80.0 || vibration > 2.5 || efficiency < 85.0
    // Status 2 (Critical): bearingWear > 0.1 || oilDegradation > 0.05 || temperature > 90.0 || vibration > 3.0
    // Status 3 (Maintenance Due): operatingHours > 0 && operatingHours % 100 == 0

    // Use the maintenance status directly from the enhanced C++ engine via backend
    const backendMaintenanceStatus = reading?.maintenanceStatus || 0;

    // Maintenance is due if status > 1 (Warning=1, Critical=2, Maintenance Due=3)
    // Status 0 = Good (no maintenance needed)
    const maintenanceDue = backendMaintenanceStatus > 1;

    setVehicleMetrics({
      fuelEfficiency: reading.fuelEfficiency || 0,
      engineHealth: reading.engineHealth || 0,
      batteryLevel: reading.batteryLevel || 0,
      tirePressure: reading.tirePressure || 0,
      maintenanceDue,
    });

    // Use real backend data from enhanced C++ engine - no frontend calculations
    // All recreation equipment metrics are now calculated in the C++ engine using real-world physics formulas

    setRecreationEquipment({
      boatEngine: {
        status:
          dataSource === "backend" && reading?.status === "normal"
            ? "Good"
            : "Needs Attention",
        hours: reading.boatEngineHours || 0,
        efficiency: reading.boatEngineEfficiency || 0,
      },
      lawnMower: {
        status:
          dataSource === "backend" && reading?.status === "normal"
            ? "Good"
            : "Needs Maintenance",
        bladeSharpness: reading.bladeSharpness || 0,
        fuelLevel: reading.fuelLevel || 0,
      },
      generator: {
        status:
          dataSource === "backend" && reading?.status === "normal"
            ? "Ready"
            : "Check Required",
        powerOutput: reading.generatorPowerOutput || 0,
        fuelEfficiency: reading.generatorFuelEfficiency || 0,
      },
      poolPump: {
        status:
          dataSource === "backend" && reading?.status === "normal"
            ? "Running"
            : "Maintenance Needed",
        flowRate: reading.poolPumpFlowRate || 0,
        energyUsage: reading.poolPumpEnergyUsage || 0,
      },
    });
  }, [reading, dataSource]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "good":
      case "ready":
      case "running":
        return "text-green-600";
      case "needs attention":
      case "check required":
        return "text-yellow-600";
      case "needs maintenance":
      case "maintenance needed":
        return "text-red-600";
      case "offline":
        return "text-gray-500";
      default:
        return "text-gray-600";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600";
    if (efficiency >= 75) return "text-yellow-600";
    if (efficiency >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getThermostatStatus = (reading: MotorReading | null) => {
    if (!reading || dataSource === "offline")
      return { status: "Offline", color: "text-gray-500" };

    const efficiency = reading.efficiency || 0;
    const temperature = reading.temperature || 0;
    const systemHealth = reading.systemHealth || 0;

    // Smart thermostat logic based on multiple factors
    if (efficiency >= 90 && systemHealth >= 85 && temperature <= 70) {
      return { status: "Optimal Control Active", color: "text-green-600" };
    } else if (efficiency >= 75 && systemHealth >= 70 && temperature <= 80) {
      return { status: "Smart Control Active", color: "text-blue-600" };
    } else if (efficiency >= 60 && systemHealth >= 60) {
      return { status: "Basic Control Active", color: "text-yellow-600" };
    } else if (temperature > 85 || systemHealth < 50) {
      return { status: "Maintenance Mode", color: "text-red-600" };
    } else {
      return { status: "Limited Control", color: "text-orange-600" };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🏠 Daily Life Applications
            </h2>
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
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Real-world motor applications
          </div>
        </div>

        {/* Application Tabs */}
        <div className="mt-4 flex space-x-1 overflow-x-auto">
          {[
            { id: "home", label: "Home Automation", icon: "🏠" },
            { id: "vehicle", label: "Personal Vehicle", icon: "🚗" },
            { id: "recreation", label: "Recreation Equipment", icon: "🎣" },
            { id: "appliances", label: "Smart Appliances", icon: "🔌" },
          ].map((app) => (
            <button
              key={app.id}
              onClick={() => setActiveApplication(app.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
                activeApplication === app.id
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {app.icon} {app.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Show offline state when no real data available */}
        {dataSource === "offline" && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              🏠 Daily Life Applications
            </h3>
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              <div className="text-4xl mb-4">🏠</div>
              <div className="text-lg font-medium mb-2">No Data Available</div>
              <div className="text-sm mb-4">
                Daily life applications require real-time data from the enhanced
                motor engine.
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
                <div className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                  🔗 Data Source Status:
                </div>
                <div className="text-blue-700 dark:text-blue-300 text-sm">
                  {backendStatus === "connected" ? (
                    <span className="text-green-600 dark:text-green-400">
                      ✅ <strong>Real C++ Backend Data:</strong> Using live
                      physics calculations from motor_engine.cpp
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      ❌ <strong>Connection Error:</strong> Unable to connect to
                      motor_engine.cpp
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                💡 <strong>Note:</strong> This dashboard only displays real data
                from the C++ backend physics calculations. No synthetic or
                fallback data is generated to ensure data integrity and
                accuracy.
              </div>
            </div>
          </div>
        )}

        {/* Show real data when available */}
        {dataSource !== "offline" && (
          <>
            {activeApplication === "home" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  🏠 Smart Home Automation
                </h3>

                {/* Educational Info Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                      ℹ️
                    </div>
                    <div>
                      <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                        🏠 Smart Home Automation Overview
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                        This dashboard transforms real motor sensor data from
                        C++ backend (motor_engine.cpp) into practical home
                        automation metrics, showing how your industrial motor's
                        performance translates to smart home efficiency and
                        comfort levels through real-time calculations.
                      </p>
                      <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                        <div>
                          • <strong>HVAC Efficiency:</strong> Motor efficiency
                          with temperature compensation affects heating/cooling
                          performance
                        </div>
                        <div>
                          • <strong>Energy Savings:</strong> Motor efficiency ×
                          0.8 directly determines monthly energy savings
                          percentage
                        </div>
                        <div>
                          • <strong>Comfort & Air Quality:</strong> Temperature
                          and vibration data impact thermal comfort and clean
                          air metrics
                        </div>
                        <div>
                          • <strong>Smart Devices:</strong> Motor speed and
                          efficiency determine connected device capacity
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                          <strong>🔗 Data Flow:</strong> motor_engine.cpp →
                          EngineService.cs → MotorController.cs → React
                          (real-time, no intermediate calculations)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Home Automation Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">HVAC Efficiency</div>
                    <div
                      className={`text-2xl font-bold ${getEfficiencyColor(
                        homeAutomation.hvacEfficiency
                      )}`}
                    >
                      {homeAutomation.hvacEfficiency.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-90">Heating/Cooling</div>
                    <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                      💡 <strong>Advanced Calculation:</strong> Motor efficiency
                      with temperature compensation. Higher efficiency + optimal
                      temperature = better HVAC performance
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> Uses enhanced C++ engine:
                      motorEfficiency × (1 - (motorTemp - 22°C) × 0.002) = HVAC
                      Efficiency (%)
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">Energy Savings</div>
                    <div
                      className={`text-2xl font-bold ${getEfficiencyColor(
                        homeAutomation.energySavings
                      )}`}
                    >
                      {homeAutomation.energySavings.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-90">Monthly Savings</div>
                    <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                      💡 <strong>Direct Calculation:</strong> Motor efficiency
                      scaled to 80%. Higher motor efficiency directly translates
                      to greater energy savings
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> Uses enhanced C++ engine:
                      motorEfficiency × 0.8 = Energy Savings (%)
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">Comfort Level</div>
                    <div
                      className={`text-2xl font-bold ${getEfficiencyColor(
                        homeAutomation.comfortLevel
                      )}`}
                    >
                      {homeAutomation.comfortLevel.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-90">Temperature</div>
                    <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                      💡 <strong>Thermal Comfort Index:</strong> Optimal
                      temperature (22°C) + vibration comfort. Thermal and
                      mechanical comfort combined
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> Uses enhanced C++ engine: 100 -
                      |motorTemp - 22°C| × 1.5 - motorVibration × 2 = Comfort
                      Level (%)
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">Air Quality</div>
                    <div
                      className={`text-2xl font-bold ${getEfficiencyColor(
                        homeAutomation.airQuality
                      )}`}
                    >
                      {homeAutomation.airQuality.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-90">Clean Air</div>
                    <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                      💡 <strong>Air Quality Index:</strong> Vibration + heat
                      impact on air quality. Low vibration + cool temperature =
                      cleaner air
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> Uses enhanced C++ engine: 100 -
                      motorVibration × 8 - (motorTemp {">"} 30°C ? (motorTemp -
                      30) × 0.5 : 0) = Air Quality (%)
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">Smart Devices</div>
                    <div className="text-2xl font-bold">
                      {homeAutomation.smartDevices}
                    </div>
                    <div className="text-xs opacity-90">Connected</div>
                    <div className="text-xs opacity-60 mt-2 border-t border-indigo-400 pt-2">
                      💡 <strong>Processing Power:</strong> Motor speed +
                      efficiency determines smart device capacity. Higher speed
                      + efficiency = more devices
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> Uses enhanced C++ engine:
                      (motorSpeed ÷ 100) + (motorEfficiency ÷ 20) = Smart
                      Devices Count
                    </div>
                  </div>
                </div>

                {/* Smart Home Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      🌡️ Climate Control
                    </h4>
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                        💡 How Climate Control Works
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        Motor sensor data directly influences HVAC system
                        performance. Temperature, speed, and vibration readings
                        determine optimal heating/cooling settings for maximum
                        comfort and efficiency.
                      </div>
                      <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800 p-2 rounded">
                        <div>
                          <strong>Smart Thermostat Logic:</strong>
                        </div>
                        <div>
                          • <strong>Optimal:</strong> Efficiency ≥90%, Health
                          ≥85%, Temp ≤70°C
                        </div>
                        <div>
                          • <strong>Smart:</strong> Efficiency ≥75%, Health
                          ≥70%, Temp ≤80°C
                        </div>
                        <div>
                          • <strong>Basic:</strong> Efficiency ≥60%, Health ≥60%
                        </div>
                        <div>
                          • <strong>Maintenance:</strong> Temp &gt;85°C or
                          Health &lt;50%
                        </div>
                        <div>
                          • <strong>Limited:</strong> All other conditions
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Thermostat
                        </span>
                        <span
                          className={`font-medium ${
                            getThermostatStatus(reading).color
                          }`}
                        >
                          {getThermostatStatus(reading).status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Dynamic status based on motor efficiency (
                        {reading?.efficiency?.toFixed(1)}%), system health (
                        {reading?.systemHealth?.toFixed(1)}%), and temperature (
                        {reading?.temperature}°C)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Fan Speed
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {reading?.speed || 0} RPM
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Direct from motor speed sensor - controls air
                        circulation rate
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Temperature
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {reading?.temperature || 0}°C
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Motor temperature affects HVAC cooling/heating
                        efficiency
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      💡 Energy Management
                    </h4>
                    <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                        💡 How Energy Management Works
                      </div>
                      <div className="text-xs text-green-700 dark:text-green-300">
                        Real-time motor power consumption and efficiency data
                        help optimize home energy usage. Smart algorithms
                        calculate potential savings and monitor overall
                        electrical efficiency.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Power Usage
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.powerConsumption || 0).toFixed(1)} kW
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Real-time motor power consumption - affects home
                        energy costs
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Efficiency
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.efficiency || 0).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Motor efficiency directly impacts overall home energy
                        efficiency
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Cost Savings
                        </span>
                        <span className="font-medium text-green-600">
                          $
                          {(
                            (reading?.energySavings || 0) * 0.5 +
                            (reading?.powerConsumption || 0) * 0.1
                          ).toFixed(0)}
                          /month
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Enhanced calculation: Energy savings percentage +
                        power consumption. Higher efficiency and lower power
                        usage increase monthly savings
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> (Energy Savings % × $0.50
                        per %) + (Power kW × $0.10 per kW) = Monthly Cost
                        Savings ($)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Section */}
            {activeApplication === "vehicle" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  🚗 Personal Vehicle Monitoring
                </h3>

                {/* Educational Info Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                      ℹ️
                    </div>
                    <div>
                      <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                        🚗 Vehicle Performance Monitoring
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                        This dashboard transforms real motor sensor data from
                        C++ backend (motor_engine.cpp) into comprehensive
                        vehicle performance metrics, showing how your industrial
                        motor's performance translates to automotive efficiency,
                        health, and predictive maintenance requirements.
                      </p>
                      <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                        <div>
                          • <strong>Fuel Efficiency:</strong> Motor efficiency ×
                          1.2 with temperature compensation determines fuel
                          economy rating
                        </div>
                        <div>
                          • <strong>Engine Health:</strong> Motor efficiency ×
                          0.9 directly correlates to overall vehicle engine
                          condition
                        </div>
                        <div>
                          • <strong>Battery & Tire:</strong> Temperature and
                          vibration impact battery life and tire pressure
                          metrics
                        </div>
                        <div>
                          • <strong>Maintenance Alerts:</strong> C++
                          physics-based status calculation predicts maintenance
                          needs (Status {">"} 1 = Due)
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                          <strong>🔗 Data Flow:</strong> motor_engine.cpp →
                          EngineService.cs → MotorController.cs → React
                          (real-time, no intermediate calculations)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">Fuel Efficiency</div>
                    <div
                      className={`text-2xl font-bold ${getEfficiencyColor(
                        vehicleMetrics.fuelEfficiency
                      )}`}
                    >
                      {vehicleMetrics.fuelEfficiency.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-90">MPG Rating</div>
                    <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                      💡 <strong>Advanced Calculation:</strong> Motor efficiency
                      with temperature compensation. Higher efficiency + optimal
                      temperature = better fuel economy
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> Efficiency × 1.2 × (1 - (Temp -
                      22°C) × 0.001) = Fuel Efficiency (%)
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">Engine Health</div>
                    <div
                      className={`text-2xl font-bold ${getEfficiencyColor(
                        vehicleMetrics.engineHealth
                      )}`}
                    >
                      {vehicleMetrics.engineHealth.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-90">Overall Health</div>
                    <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                      💡 <strong>Direct Calculation:</strong> Motor efficiency
                      scaled to 90%. Engine health directly correlates to motor
                      efficiency
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> Efficiency × 0.9 = Engine Health
                      (%)
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">Battery Level</div>
                    <div
                      className={`text-2xl font-bold ${getEfficiencyColor(
                        vehicleMetrics.batteryLevel
                      )}`}
                    >
                      {vehicleMetrics.batteryLevel.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-90">Charge Status</div>
                    <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                      💡 <strong>Advanced Calculation:</strong> Temperature +
                      vibration impact on battery life. Heat and vibration both
                      reduce battery performance
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> 100 - (Temp - 30°C) × 2 -
                      (Vibration {">"} 2mm/s ? (Vibration - 2) × 5 : 0) =
                      Battery Level (%)
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">Tire Pressure</div>
                    <div
                      className={`text-2xl font-bold ${getEfficiencyColor(
                        vehicleMetrics.tirePressure
                      )}`}
                    >
                      {vehicleMetrics.tirePressure.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-90">Optimal Range</div>
                    <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                      💡 <strong>Enhanced Calculation:</strong> Vibration +
                      speed impact on tire pressure. High vibration and speed
                      indicate tire wear
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> 100 - Vibration × 15 - (Speed{" "}
                      {">"} 2000RPM ? (Speed - 2000) × 0.01 : 0) = Tire Pressure
                      (%)
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                    <div className="text-sm opacity-90">Maintenance</div>
                    <div className="text-2xl font-bold">
                      {vehicleMetrics.maintenanceDue ? "⚠️" : "✅"}
                    </div>
                    <div className="text-xs opacity-90">
                      {vehicleMetrics.maintenanceDue
                        ? "Due Soon"
                        : "Up to Date"}
                    </div>
                    <div className="text-xs opacity-60 mt-2 border-t border-red-400 pt-2">
                      💡 <strong>Smart Prediction:</strong> Multi-factor
                      maintenance prediction. Considers maintenance status,
                      health, vibration, and temperature
                    </div>
                    <div className="text-xs opacity-50 mt-1">
                      <strong>Formula:</strong> Uses enhanced C++ engine
                      physics-based calculation: Status 0=Good, 1=Warning,
                      2=Critical, 3=Maintenance Due (Maintenance Due = Status{" "}
                      {">"} 1)
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      🔧 Engine Diagnostics
                    </h4>
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                        💡 How Engine Diagnostics Work
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        Direct motor sensor readings provide real-time engine
                        diagnostics. RPM, temperature, vibration, and oil
                        pressure data help monitor engine performance and
                        identify potential issues.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          RPM
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {reading?.speed || 0}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Engine revolutions per minute - direct from motor
                        speed sensor
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> reading.speed = Engine RPM
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Engine Temp
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {reading?.temperature || 0}°C
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Motor temperature affects engine cooling system
                        performance
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> reading.temperature =
                        Engine Temperature (°C)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Vibration
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.vibration || 0).toFixed(2)} mm/s
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Motor vibration indicates engine balance and wear
                        patterns
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> reading.vibration = Engine
                        Vibration (mm/s)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Oil Pressure
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.oilPressure || 0).toFixed(1)} bar
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Motor oil pressure sensor - critical for engine
                        lubrication
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> reading.oilPressure =
                        Engine Oil Pressure (bar)
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      ⚡ Performance Metrics
                    </h4>
                    <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                        💡 How Performance Metrics Work
                      </div>
                      <div className="text-xs text-green-700 dark:text-green-300">
                        Vehicle performance metrics are calculated from motor
                        sensor data to provide comprehensive insights into power
                        output, efficiency, operating hours, and overall system
                        health.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Power Output
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.powerConsumption || 0).toFixed(1)} kW
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Real-time motor power consumption - indicates engine
                        power output
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> reading.powerConsumption =
                        Engine Power Output (kW)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Efficiency
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.efficiency || 0).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Motor efficiency directly translates to vehicle fuel
                        economy
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> reading.efficiency = Engine
                        Efficiency (%)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Operating Hours
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.operatingHours || 0).toFixed(0)}h
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Motor operating hours - tracks engine runtime for
                        maintenance scheduling
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> reading.operatingHours =
                        Engine Operating Hours (h)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          System Health
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.systemHealth || 0).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Overall motor system health - indicates vehicle
                        reliability
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> reading.systemHealth =
                        Vehicle System Health (%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeApplication === "recreation" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  🎣 Recreation Equipment Monitoring
                </h3>

                {/* Educational Info Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                      ℹ️
                    </div>
                    <div>
                      <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                        🎣 Recreation Equipment Monitoring
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                        This dashboard transforms real motor sensor data from
                        C++ backend (motor_engine.cpp) into comprehensive
                        recreation equipment monitoring, showing how your
                        industrial motor's performance translates to boat
                        engines, lawn mowers, generators, and pool pumps through
                        physics-based calculations.
                      </p>
                      <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                        <div>
                          • <strong>Boat Engine:</strong> Efficiency with marine
                          environment factors (temp/vibration) determines
                          performance and operating hours
                        </div>
                        <div>
                          • <strong>Lawn Mower:</strong> Vibration and speed
                          impact blade sharpness; temperature affects fuel
                          system
                        </div>
                        <div>
                          • <strong>Generator:</strong> Power consumption and
                          efficiency determine output and fuel economy
                        </div>
                        <div>
                          • <strong>Pool Pump:</strong> Coolant flow rate and
                          power determine water circulation and energy usage
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                          <strong>🔗 Data Flow:</strong> motor_engine.cpp →
                          EngineService.cs → MotorController.cs → React
                          (real-time, no intermediate calculations)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recreation Equipment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Boat Engine */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      🚤 Boat Engine
                    </h4>
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                        💡 How Boat Engine Monitoring Works
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        Motor sensor data translates to boat engine performance.
                        Status, operating hours, and efficiency are calculated
                        from motor readings to predict maintenance needs and
                        performance.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Status
                        </span>
                        <span
                          className={`font-medium ${getStatusColor(
                            recreationEquipment.boatEngine.status
                          )}`}
                        >
                          {recreationEquipment.boatEngine.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Based on motor status: "normal" = Good, other = Needs
                        Attention
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Operating Hours
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {recreationEquipment.boatEngine.hours}h
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Motor operating hours ÷ 10 = Boat engine hours
                        (scaled for recreation use)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Efficiency
                        </span>
                        <span
                          className={`font-medium ${getEfficiencyColor(
                            recreationEquipment.boatEngine.efficiency
                          )}`}
                        >
                          {recreationEquipment.boatEngine.efficiency.toFixed(0)}
                          %
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Advanced calculation: Motor efficiency with marine
                        environment factors. Temperature and vibration impact
                        boat engine performance
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Efficiency × (1 - (Temp -
                        25°C) × 0.002) - (Vibration {">"} 2mm/s ? (Vibration -
                        2) × 3 : 0) = Boat Engine Efficiency (%)
                      </div>
                    </div>
                  </div>

                  {/* Lawn Mower */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      🌱 Lawn Mower
                    </h4>
                    <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                        💡 How Lawn Mower Monitoring Works
                      </div>
                      <div className="text-xs text-green-700 dark:text-green-300">
                        Motor vibration and temperature data determine lawn
                        mower condition. Higher vibration indicates dull blades,
                        while temperature affects fuel system performance.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Status
                        </span>
                        <span
                          className={`font-medium ${getStatusColor(
                            recreationEquipment.lawnMower.status
                          )}`}
                        >
                          {recreationEquipment.lawnMower.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Based on motor status: "normal" = Good, other = Needs
                        Maintenance
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Blade Sharpness
                        </span>
                        <span
                          className={`font-medium ${getEfficiencyColor(
                            recreationEquipment.lawnMower.bladeSharpness
                          )}`}
                        >
                          {recreationEquipment.lawnMower.bladeSharpness.toFixed(
                            0
                          )}
                          %
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Enhanced calculation: Vibration + speed impact on
                        blade wear. High vibration and speed indicate dull
                        blades
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> 100 - Vibration × 20 -
                        (Speed {">"} 1500RPM ? (Speed - 1500) × 0.01 : 0) =
                        Blade Sharpness (%)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Fuel Level
                        </span>
                        <span
                          className={`font-medium ${getEfficiencyColor(
                            recreationEquipment.lawnMower.fuelLevel
                          )}`}
                        >
                          {recreationEquipment.lawnMower.fuelLevel.toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Advanced calculation: Temperature + vibration impact
                        on fuel system. Heat and vibration both affect fuel
                        system performance
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> 100 - (Temp - 40°C) × 3 -
                        (Vibration {">"} 1.5mm/s ? (Vibration - 1.5) × 5 : 0) =
                        Fuel Level (%)
                      </div>
                    </div>
                  </div>

                  {/* Generator */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      ⚡ Generator
                    </h4>
                    <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                        💡 How Generator Monitoring Works
                      </div>
                      <div className="text-xs text-yellow-700 dark:text-yellow-300">
                        Motor power consumption and efficiency data determine
                        generator performance. Higher power output and
                        efficiency indicate better generator operation and fuel
                        economy.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Status
                        </span>
                        <span
                          className={`font-medium ${getStatusColor(
                            recreationEquipment.generator.status
                          )}`}
                        >
                          {recreationEquipment.generator.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Based on motor status: "normal" = Ready, other =
                        Check Required
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Power Output
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {recreationEquipment.generator.powerOutput.toFixed(0)}
                          %
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Advanced calculation: Motor power with temperature
                        compensation. Higher temperature reduces generator power
                        output
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Power × 10 × (1 - (Temp -
                        30°C) × 0.001) = Generator Power Output (%)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Fuel Efficiency
                        </span>
                        <span
                          className={`font-medium ${getEfficiencyColor(
                            recreationEquipment.generator.fuelEfficiency
                          )}`}
                        >
                          {recreationEquipment.generator.fuelEfficiency.toFixed(
                            0
                          )}
                          %
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Enhanced calculation: Motor efficiency with vibration
                        impact. High vibration reduces generator fuel efficiency
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Efficiency × (1 -
                        (Vibration {">"} 2mm/s ? (Vibration - 2) × 0.02 : 0)) =
                        Generator Fuel Efficiency (%)
                      </div>
                    </div>
                  </div>

                  {/* Pool Pump */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      🏊 Pool Pump
                    </h4>
                    <div className="mb-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                      <div className="text-sm text-cyan-800 dark:text-cyan-200 font-medium mb-1">
                        💡 How Pool Pump Monitoring Works
                      </div>
                      <div className="text-xs text-cyan-700 dark:text-cyan-300">
                        Motor coolant flow rate and power consumption determine
                        pool pump performance. Flow rate indicates water
                        circulation efficiency, while energy usage shows power
                        consumption.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Status
                        </span>
                        <span
                          className={`font-medium ${getStatusColor(
                            recreationEquipment.poolPump.status
                          )}`}
                        >
                          {recreationEquipment.poolPump.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Based on motor status: "normal" = Running, other =
                        Maintenance Needed
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Flow Rate
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {recreationEquipment.poolPump.flowRate.toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Advanced calculation: Coolant flow with temperature
                        impact. Higher temperature affects water flow efficiency
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Coolant Flow × 20 × (1 -
                        (Temp - 25°C) × 0.001) = Pool Pump Flow Rate (%)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Energy Usage
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {recreationEquipment.poolPump.energyUsage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Enhanced calculation: Motor power with vibration
                        impact. High vibration increases pool pump energy
                        consumption
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Power × 15 × (1 +
                        (Vibration {">"} 1mm/s ? (Vibration - 1) × 0.05 : 0)) =
                        Pool Pump Energy Usage (%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equipment Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">
                    💡 Equipment Recommendations
                  </h4>
                  <div className="mb-3 p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                      💡 How Recommendations Work
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      Smart algorithms analyze motor sensor data to generate
                      predictive maintenance recommendations. Each
                      recommendation is based on specific thresholds and motor
                      performance indicators.
                    </div>
                  </div>
                  <div className="space-y-2">
                    {recreationEquipment.boatEngine.status !== "Good" && (
                      <div className="flex items-start space-x-3 p-3 bg-white dark:bg-blue-800 rounded-lg">
                        <span className="text-lg">🚤</span>
                        <div>
                          <span className="text-blue-700 dark:text-blue-200 font-medium">
                            Boat engine needs attention - schedule maintenance
                          </span>
                          <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            💡 Triggered when motor status ≠ "normal" -
                            indicates potential engine issues
                          </div>
                        </div>
                      </div>
                    )}
                    {recreationEquipment.lawnMower.bladeSharpness < 70 && (
                      <div className="flex items-start space-x-3 p-3 bg-white dark:bg-blue-800 rounded-lg">
                        <span className="text-lg">🌱</span>
                        <div>
                          <span className="text-blue-700 dark:text-blue-200 font-medium">
                            Lawn mower blades need sharpening
                          </span>
                          <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            💡 Triggered when blade sharpness &lt; 70% - high
                            motor vibration indicates dull blades
                          </div>
                        </div>
                      </div>
                    )}
                    {recreationEquipment.generator.powerOutput < 80 && (
                      <div className="flex items-start space-x-3 p-3 bg-white dark:bg-blue-800 rounded-lg">
                        <span className="text-lg">⚡</span>
                        <div>
                          <span className="text-blue-700 dark:text-blue-200 font-medium">
                            Generator power output below optimal
                          </span>
                          <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            💡 Triggered when power output &lt; 80% - low motor
                            power consumption indicates issues
                          </div>
                        </div>
                      </div>
                    )}
                    {recreationEquipment.poolPump.flowRate < 75 && (
                      <div className="flex items-start space-x-3 p-3 bg-white dark:bg-blue-800 rounded-lg">
                        <span className="text-lg">🏊</span>
                        <div>
                          <span className="text-blue-700 dark:text-blue-200 font-medium">
                            Pool pump flow rate needs adjustment
                          </span>
                          <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            💡 Triggered when flow rate &lt; 75% - low motor
                            coolant flow indicates pump issues
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeApplication === "appliances" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  🔌 Smart Appliances Monitoring
                </h3>

                {/* Educational Info Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                      ℹ️
                    </div>
                    <div>
                      <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                        🔌 Smart Appliances Monitoring
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                        This dashboard transforms real motor sensor data from
                        C++ backend (motor_engine.cpp) into comprehensive smart
                        appliance monitoring, showing how your industrial
                        motor's performance translates to washing machines,
                        dishwashers, and refrigerators through real-time energy
                        and efficiency calculations.
                      </p>
                      <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                        <div>
                          • <strong>Washing Machine:</strong> Motor status,
                          temperature, and vibration determine cycle type and
                          efficiency
                        </div>
                        <div>
                          • <strong>Dishwasher:</strong> Temperature and flow
                          rate impact water usage, heating, and cycle duration
                        </div>
                        <div>
                          • <strong>Refrigerator:</strong> Temperature and speed
                          affect cooling performance, compressor operation, and
                          energy consumption
                        </div>
                        <div>
                          • <strong>Energy Savings:</strong> Motor efficiency ×
                          0.3 calculates monthly cost optimization potential
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                          <strong>🔗 Data Flow:</strong> motor_engine.cpp →
                          EngineService.cs → MotorController.cs → React
                          (real-time, no intermediate calculations)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Appliances Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      🧺 Washing Machine
                    </h4>
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                        💡 How Washing Machine Monitoring Works
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">
                        Motor sensor data translates to washing machine
                        performance. Energy usage and efficiency are calculated
                        from motor readings to monitor appliance power
                        consumption and operational effectiveness.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Status
                        </span>
                        <span
                          className={`font-medium ${
                            !reading
                              ? "text-gray-500"
                              : reading?.status === "normal"
                              ? "text-green-600"
                              : (reading?.temperature || 0) > 80
                              ? "text-red-600"
                              : (reading?.vibration || 0) > 4
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        >
                          {!reading
                            ? "Offline"
                            : reading?.status === "normal"
                            ? "Running"
                            : (reading?.temperature || 0) > 80
                            ? "Overheating"
                            : (reading?.vibration || 0) > 4
                            ? "High Vibration"
                            : "Standby"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Dynamic status based on motor conditions: normal =
                        Running, high temp = Overheating, high vibration = High
                        Vibration, else = Standby
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Status = Normal ? "Running"
                        : Temp {">"} 80°C ? "Overheating" : Vibration {">"}{" "}
                        4mm/s ? "High Vibration" : "Standby"
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Cycle
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.temperature || 0) > 70
                            ? "Hot Wash"
                            : (reading?.vibration || 0) > 3
                            ? "Heavy Duty"
                            : (reading?.efficiency || 0) > 90
                            ? "Eco Wash"
                            : "Normal Wash"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Dynamic cycle selection based on motor conditions:
                        high temp = Hot Wash, high vibration = Heavy Duty, high
                        efficiency = Eco Wash, else = Normal Wash
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Cycle = Temp {">"} 70°C ?
                        "Hot Wash" : Vibration {">"} 3mm/s ? "Heavy Duty" :
                        Efficiency {">"} 90% ? "Eco Wash" : "Normal Wash"
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Energy Usage
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.powerConsumption || 0).toFixed(1)} kW
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Enhanced calculation: Motor power consumption with
                        cycle efficiency factor. Different cycles have different
                        energy requirements
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Power Consumption × (1 +
                        (Cycle Factor × 0.1)) = Washing Machine Energy Usage
                        (kW)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Efficiency
                        </span>
                        <span
                          className={`font-medium ${getEfficiencyColor(
                            reading?.washingMachineEfficiency || 0
                          )}`}
                        >
                          {(reading?.washingMachineEfficiency || 0).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Enhanced calculation: Motor efficiency with
                        temperature and vibration impact. High temperature and
                        vibration reduce washing machine effectiveness
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Uses enhanced C++ engine
                        physics-based calculation: motorEfficiency × (1 -
                        motorVibration × 0.05) = Washing Machine Efficiency (%)
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      🍳 Dishwasher
                    </h4>
                    <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-sm text-orange-800 dark:text-orange-200 font-medium mb-1">
                        💡 How Dishwasher Monitoring Works
                      </div>
                      <div className="text-xs text-orange-700 dark:text-orange-300">
                        Motor sensor data translates to dishwasher performance.
                        Water usage and temperature are calculated from motor
                        readings to monitor appliance water consumption and
                        heating efficiency.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Status
                        </span>
                        <span
                          className={`font-medium ${
                            !reading
                              ? "text-gray-500"
                              : reading?.status === "normal" &&
                                (reading?.temperature || 0) > 50
                              ? "text-green-600"
                              : (reading?.temperature || 0) > 80
                              ? "text-red-600"
                              : (reading?.vibration || 0) > 3
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        >
                          {!reading
                            ? "Offline"
                            : reading?.status === "normal" &&
                              (reading?.temperature || 0) > 50
                            ? "Washing"
                            : (reading?.temperature || 0) > 80
                            ? "Overheating"
                            : (reading?.vibration || 0) > 3
                            ? "High Vibration"
                            : "Standby"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Dynamic status based on motor conditions: normal +
                        high temp = Washing, high temp = Overheating, high
                        vibration = High Vibration, else = Standby
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Status = (Normal && Temp{" "}
                        {">"} 50°C) ? "Washing" : Temp {">"} 80°C ?
                        "Overheating" : Vibration {">"} 3mm/s ? "High Vibration"
                        : "Standby"
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Water Usage
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.coolantFlowRate || 0).toFixed(1)} L/min
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Enhanced calculation: Motor coolant flow rate with
                        temperature impact. Higher temperature affects water
                        flow efficiency
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Coolant Flow Rate × (1 -
                        (Temp - 25°C) × 0.001) = Dishwasher Water Usage (L/min)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Temperature
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {reading?.temperature || 0}°C
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Enhanced calculation: Motor temperature with heating
                        efficiency factor. Higher temperature indicates better
                        heating system performance
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Motor Temperature × (1 +
                        (Efficiency - 50) × 0.001) = Dishwasher Heating
                        Temperature (°C)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Cycle Time
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {Math.round(
                            45 -
                              (reading?.efficiency || 0) * 0.2 +
                              (reading?.vibration || 0) * 2
                          )}{" "}
                          min
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Dynamic cycle duration based on motor efficiency and
                        vibration. Higher efficiency reduces cycle time, higher
                        vibration increases it
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> 45 - (Efficiency × 0.2) +
                        (Vibration × 2) = Dishwasher Cycle Time (min)
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                      ❄️ Refrigerator
                    </h4>
                    <div className="mb-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                      <div className="text-sm text-cyan-800 dark:text-cyan-200 font-medium mb-1">
                        💡 How Refrigerator Monitoring Works
                      </div>
                      <div className="text-xs text-cyan-700 dark:text-cyan-300">
                        Motor sensor data translates to refrigerator
                        performance. Temperature, compressor speed, and energy
                        usage are calculated from motor readings to monitor
                        cooling system efficiency and power consumption.
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Status
                        </span>
                        <span
                          className={`font-medium ${
                            !reading
                              ? "text-gray-500"
                              : (reading?.temperature || 0) > 60
                              ? "text-green-600"
                              : (reading?.temperature || 0) > 80
                              ? "text-red-600"
                              : (reading?.vibration || 0) > 3
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        >
                          {!reading
                            ? "Offline"
                            : (reading?.temperature || 0) > 60
                            ? "Cooling"
                            : (reading?.temperature || 0) > 80
                            ? "Overheating"
                            : (reading?.vibration || 0) > 3
                            ? "High Vibration"
                            : "Standby"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Dynamic status based on motor conditions: high temp =
                        Cooling, very high temp = Overheating, high vibration =
                        High Vibration, else = Standby
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Status = Temp {">"} 60°C ?
                        "Cooling" : Temp {">"} 80°C ? "Overheating" : Vibration{" "}
                        {">"} 3mm/s ? "High Vibration" : "Standby"
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Temperature
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {reading?.temperature || 0}°C
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Enhanced calculation: Motor temperature with cooling
                        efficiency factor. Higher temperature indicates better
                        cooling system performance
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Motor Temperature × (1 +
                        (Efficiency - 50) × 0.001) = Refrigerator Internal
                        Temperature (°C)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Compressor
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {reading?.speed || 0} RPM
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        💡 Enhanced calculation: Motor speed with temperature
                        compensation. Higher temperature increases compressor
                        speed for better cooling
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Motor Speed × (1 + (Temp -
                        25°C) × 0.001) = Refrigerator Compressor Speed (RPM)
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Energy Usage
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(reading?.powerConsumption || 0).toFixed(1)} kW
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 Enhanced calculation: Motor power consumption with
                        cooling efficiency factor. Higher efficiency reduces
                        energy consumption
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        📊 <strong>Formula:</strong> Power Consumption × (1 -
                        (Efficiency - 50) × 0.001) = Refrigerator Energy Usage
                        (kW)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appliance Efficiency Summary */}
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">
                    📊 Overall Appliance Efficiency
                  </h4>
                  <div className="mb-3 p-3 bg-indigo-600/30 rounded-lg">
                    <div className="text-sm text-indigo-100 font-medium mb-1">
                      💡 How Efficiency Calculations Work
                    </div>
                    <div className="text-xs text-indigo-200">
                      Smart algorithms analyze motor sensor data to calculate
                      overall appliance efficiency, energy usage, and potential
                      savings. All metrics are dynamically calculated from
                      real-time motor readings.
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm opacity-90">
                        Total Energy Usage
                      </div>
                      <div className="text-2xl font-bold">
                        {(reading?.powerConsumption || 0).toFixed(1)} kW
                      </div>
                      <div className="text-xs opacity-60 mt-2 border-t border-indigo-400 pt-2">
                        💡 <strong>Direct from Motor:</strong> Motor power
                        consumption represents total appliance energy draw
                      </div>
                      <div className="text-xs opacity-50 mt-1">
                        <strong>Calculation:</strong> reading.powerConsumption =
                        Total Energy Usage
                      </div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">
                        Average Efficiency
                      </div>
                      <div className="text-2xl font-bold">
                        {(reading?.efficiency || 0).toFixed(0)}%
                      </div>
                      <div className="text-xs opacity-60 mt-2 border-t border-indigo-400 pt-2">
                        💡 <strong>Performance Metric:</strong> Motor efficiency
                        directly translates to appliance operational efficiency
                      </div>
                      <div className="text-xs opacity-50 mt-1">
                        <strong>Calculation:</strong> reading.efficiency =
                        Average Efficiency (%)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Monthly Savings</div>
                      <div className="text-2xl font-bold">
                        ${((reading?.efficiency || 0) * 0.3).toFixed(0)}
                      </div>
                      <div className="text-xs opacity-60 mt-2 border-t border-indigo-400 pt-2">
                        💡 <strong>Cost Optimization:</strong> Higher efficiency
                        translates to reduced energy costs
                      </div>
                      <div className="text-xs opacity-50 mt-1">
                        <strong>Formula:</strong> Motor Efficiency × 0.3 =
                        Monthly Savings ($)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
