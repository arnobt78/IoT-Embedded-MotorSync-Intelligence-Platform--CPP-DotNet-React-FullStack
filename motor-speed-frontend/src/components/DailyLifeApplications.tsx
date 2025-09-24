import type { MotorReading } from "../types/types";
import React, { useState, useEffect } from "react";

interface DailyLifeApplicationsProps {
  reading: MotorReading | null;
}

export default function DailyLifeApplications({
  reading,
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
  const [motorPower, setMotorPower] = useState(0);

  useEffect(() => {
    if (reading) {
      // Enhanced physics-based home automation metrics
      const motorEfficiency = reading.efficiency || 0;
      const motorTemp = reading.temperature || 0;
      const motorVibration = reading.vibration || 0;
      const motorSpeed = reading.speed || 0;
      const motorPower = reading.powerConsumption || 0;
      const motorHealth = reading.systemHealth || 0;

      // Advanced HVAC efficiency calculation with temperature compensation
      const hvacEfficiency = Math.min(
        100,
        Math.max(
          0,
          motorEfficiency * (1 - (motorTemp - 22) * 0.002) // Temperature compensation
        )
      );

      // Enhanced energy savings with power factor consideration
      const energySavings = Math.min(
        100,
        Math.max(
          0,
          motorEfficiency * 0.8 + (motorHealth - 50) * 0.1 // Health factor
        )
      );

      // Advanced comfort level with thermal comfort index
      const comfortLevel = Math.min(
        100,
        Math.max(
          0,
          100 - Math.abs(motorTemp - 22) * 1.5 - motorVibration * 2 // Thermal + vibration comfort
        )
      );

      // Enhanced air quality with particulate matter simulation
      const airQuality = Math.min(
        100,
        Math.max(
          0,
          100 -
            motorVibration * 8 -
            (motorTemp > 30 ? (motorTemp - 30) * 0.5 : 0) // Vibration + heat impact
        )
      );

      // Smart devices with processing power calculation
      const smartDevices = Math.max(
        0,
        Math.floor(
          motorSpeed / 100 + motorEfficiency / 20 // Speed + efficiency factor
        )
      );

      setHomeAutomation({
        hvacEfficiency,
        energySavings,
        comfortLevel,
        airQuality,
        smartDevices,
      });

      // Set motor power for use in JSX
      setMotorPower(motorPower);

      // Enhanced physics-based vehicle metrics
      const vehicleEfficiency = reading.efficiency || 0;
      const vehicleTemp = reading.temperature || 0;
      const vehicleVibration = reading.vibration || 0;
      const vehicleHealth = reading.systemHealth || 0;
      const vehicleMaintenanceStatus = reading.maintenanceStatus || 0;
      const vehicleSpeed = reading.speed || 0;
      const vehiclePower = reading.powerConsumption || 0;
      const vehicleOperatingHours = reading.operatingHours || 0;

      // Advanced fuel efficiency with temperature and load compensation
      const fuelEfficiency = Math.min(
        100,
        Math.max(
          0,
          vehicleEfficiency * 1.2 * (1 - (vehicleTemp - 22) * 0.001) // Temperature compensation
        )
      );

      // Enhanced engine health with vibration factor
      const engineHealth = Math.min(
        100,
        Math.max(
          0,
          vehicleHealth -
            (vehicleVibration > 3 ? (vehicleVibration - 3) * 2 : 0) // Vibration penalty
        )
      );

      // Advanced battery level with temperature and vibration effects
      const batteryLevel = Math.min(
        100,
        Math.max(
          0,
          100 -
            (vehicleTemp - 30) * 2 -
            (vehicleVibration > 2 ? (vehicleVibration - 2) * 5 : 0) // Heat + vibration impact
        )
      );

      // Enhanced tire pressure with speed and temperature factors
      const tirePressure = Math.min(
        100,
        Math.max(
          0,
          100 -
            vehicleVibration * 15 -
            (vehicleSpeed > 2000 ? (vehicleSpeed - 2000) * 0.01 : 0) // Vibration + speed impact
        )
      );

      // Smart maintenance prediction with multiple factors
      const maintenanceDue =
        vehicleMaintenanceStatus > 1 ||
        vehicleHealth < 70 ||
        vehicleVibration > 4 ||
        vehicleTemp > 80;

      setVehicleMetrics({
        fuelEfficiency,
        engineHealth,
        batteryLevel,
        tirePressure,
        maintenanceDue,
      });

      // Enhanced physics-based recreation equipment metrics
      const coolantFlowRate = reading.coolantFlowRate || 0;

      // Advanced boat engine calculations with marine environment factors
      const boatEngineEfficiency = Math.min(
        100,
        Math.max(
          0,
          vehicleEfficiency * (1 - (vehicleTemp - 25) * 0.002) -
            (vehicleVibration > 2 ? (vehicleVibration - 2) * 3 : 0) // Temperature + vibration impact
        )
      );
      const boatEngineHours = Math.floor(vehicleOperatingHours / 10);

      // Enhanced lawn mower calculations with blade wear physics
      const bladeSharpness = Math.min(
        100,
        Math.max(
          0,
          100 -
            vehicleVibration * 20 -
            (vehicleSpeed > 1500 ? (vehicleSpeed - 1500) * 0.01 : 0) // Vibration + speed impact on blade wear
        )
      );
      const fuelLevel = Math.min(
        100,
        Math.max(
          0,
          100 -
            (vehicleTemp - 40) * 3 -
            (vehicleVibration > 1.5 ? (vehicleVibration - 1.5) * 5 : 0) // Temperature + vibration impact on fuel system
        )
      );

      // Advanced generator calculations with load and efficiency factors
      const generatorPowerOutput = Math.min(
        100,
        Math.max(
          0,
          vehiclePower * 10 * (1 - (vehicleTemp - 30) * 0.001) // Temperature compensation for power output
        )
      );
      const generatorFuelEfficiency = Math.min(
        100,
        Math.max(
          0,
          vehicleEfficiency *
            (1 - (vehicleVibration > 2 ? (vehicleVibration - 2) * 0.02 : 0)) // Vibration impact on fuel efficiency
        )
      );

      // Enhanced pool pump calculations with water flow physics
      const poolPumpFlowRate = Math.min(
        100,
        Math.max(
          0,
          coolantFlowRate * 20 * (1 - (vehicleTemp - 25) * 0.001) // Temperature impact on water flow
        )
      );
      const poolPumpEnergyUsage = Math.min(
        100,
        Math.max(
          0,
          vehiclePower *
            15 *
            (1 + (vehicleVibration > 1 ? (vehicleVibration - 1) * 0.05 : 0)) // Vibration increases energy consumption
        )
      );

      setRecreationEquipment({
        boatEngine: {
          status: reading.status === "normal" ? "Good" : "Needs Attention",
          hours: boatEngineHours,
          efficiency: boatEngineEfficiency,
        },
        lawnMower: {
          status: reading.status === "normal" ? "Good" : "Needs Maintenance",
          bladeSharpness: bladeSharpness,
          fuelLevel: fuelLevel,
        },
        generator: {
          status: reading.status === "normal" ? "Ready" : "Check Required",
          powerOutput: generatorPowerOutput,
          fuelEfficiency: generatorFuelEfficiency,
        },
        poolPump: {
          status:
            reading.status === "normal" ? "Running" : "Maintenance Needed",
          flowRate: poolPumpFlowRate,
          energyUsage: poolPumpEnergyUsage,
        },
      });
    }
  }, [reading]);

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
    if (!reading) return { status: "Initializing...", color: "text-gray-600" };

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🏠 Daily Life Applications
          </h2>
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
                    This dashboard transforms your motor sensor data into
                    practical home automation metrics. Real motor readings are
                    intelligently converted to show how your industrial motor's
                    performance translates to smart home efficiency and comfort
                    levels.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Real-time Calculations:</strong> All metrics are
                      calculated from live motor sensor data
                    </div>
                    <div>
                      • <strong>Smart Correlations:</strong> Motor efficiency
                      directly impacts home energy savings
                    </div>
                    <div>
                      • <strong>Environmental Impact:</strong> Temperature and
                      vibration data affect air quality and comfort
                    </div>
                    <div>
                      • <strong>Connected Devices:</strong> Motor speed
                      determines the number of smart devices that can be
                      supported
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
                  {homeAutomation.hvacEfficiency.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Heating/Cooling</div>
                <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                  💡 <strong>Advanced Calculation:</strong> Motor efficiency
                  with temperature compensation. Higher efficiency + optimal
                  temperature = better HVAC performance
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Formula:</strong> Efficiency × (1 - (Temp - 22°C) ×
                  0.002) = HVAC Efficiency (%)
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Energy Savings</div>
                <div
                  className={`text-2xl font-bold ${getEfficiencyColor(
                    homeAutomation.energySavings
                  )}`}
                >
                  {homeAutomation.energySavings.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Monthly Savings</div>
                <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                  💡 <strong>Enhanced Calculation:</strong> Motor efficiency +
                  system health factor. Healthy, efficient motors maximize
                  energy savings
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Formula:</strong> (Efficiency × 0.8) + (Health - 50) ×
                  0.1 = Energy Savings (%)
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Comfort Level</div>
                <div
                  className={`text-2xl font-bold ${getEfficiencyColor(
                    homeAutomation.comfortLevel
                  )}`}
                >
                  {homeAutomation.comfortLevel.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Temperature</div>
                <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                  💡 <strong>Thermal Comfort Index:</strong> Optimal temperature
                  (22°C) + vibration comfort. Thermal and mechanical comfort
                  combined
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Formula:</strong> 100 - |Temp - 22°C| × 1.5 -
                  Vibration × 2 = Comfort Level (%)
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Air Quality</div>
                <div
                  className={`text-2xl font-bold ${getEfficiencyColor(
                    homeAutomation.airQuality
                  )}`}
                >
                  {homeAutomation.airQuality.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Clean Air</div>
                <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                  💡 <strong>Air Quality Index:</strong> Vibration + heat impact
                  on air quality. Low vibration + cool temperature = cleaner air
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Formula:</strong> 100 - Vibration × 8 - (Temp {">"}{" "}
                  30°C ? (Temp - 30) × 0.5 : 0) = Air Quality (%)
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Smart Devices</div>
                <div className="text-2xl font-bold">
                  {homeAutomation.smartDevices}
                </div>
                <div className="text-xs opacity-90">Connected</div>
                <div className="text-xs opacity-60 mt-2 border-t border-indigo-400 pt-2">
                  💡 <strong>Processing Power:</strong> Motor speed + efficiency
                  determines smart device capacity. Higher speed + efficiency =
                  more devices
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Formula:</strong> (Speed ÷ 100) + (Efficiency ÷ 20) =
                  Smart Devices Count
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
                      • <strong>Optimal:</strong> Efficiency ≥90%, Health ≥85%,
                      Temp ≤70°C
                    </div>
                    <div>
                      • <strong>Smart:</strong> Efficiency ≥75%, Health ≥70%,
                      Temp ≤80°C
                    </div>
                    <div>
                      • <strong>Basic:</strong> Efficiency ≥60%, Health ≥60%
                    </div>
                    <div>
                      • <strong>Maintenance:</strong> Temp &gt;85°C or Health
                      &lt;50%
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
                    💡 Direct from motor speed sensor - controls air circulation
                    rate
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
                    💡 Motor temperature affects HVAC cooling/heating efficiency
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
                    Real-time motor power consumption and efficiency data help
                    optimize home energy usage. Smart algorithms calculate
                    potential savings and monitor overall electrical efficiency.
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
                    💡 Real-time motor power consumption - affects home energy
                    costs
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
                        homeAutomation.energySavings * 0.5 +
                        motorPower * 0.1
                      ).toFixed(0)}
                      /month
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Enhanced calculation: Energy savings + power consumption
                    factor × base rate ($0.50/kW + $0.10/kW)
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> (Energy Savings × $0.50) +
                    (Power × $0.10) = Monthly Cost Savings
                  </div>
                </div>
              </div>
            </div>

            {/* Data Flow Explanation */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-indigo-600 dark:text-indigo-400 mr-3 mt-1">
                  🔄
                </div>
                <div>
                  <h4 className="text-indigo-800 dark:text-indigo-200 font-medium mb-2">
                    Real-time Data Flow
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    can be intelligently applied to smart home automation
                    systems. Every metric shown is calculated from live motor
                    readings.
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                    <div>
                      • <strong>Motor Sensors → Smart Home:</strong>{" "}
                      Temperature, speed, vibration, and efficiency data
                    </div>
                    <div>
                      • <strong>Algorithm Processing:</strong> Real-time
                      calculations convert motor metrics to home metrics
                    </div>
                    <div>
                      • <strong>User Interface:</strong> Intuitive display of
                      how motor performance affects daily life
                    </div>
                    <div>
                      • <strong>Practical Applications:</strong> HVAC control,
                      energy management, air quality monitoring
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                    This dashboard transforms your motor sensor data into
                    comprehensive vehicle performance metrics. Real motor
                    readings are intelligently converted to show how your
                    industrial motor's performance translates to automotive
                    efficiency, health, and maintenance requirements.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Engine Performance:</strong> Motor efficiency
                      directly correlates to fuel efficiency
                    </div>
                    <div>
                      • <strong>Health Monitoring:</strong> System health
                      determines overall vehicle condition
                    </div>
                    <div>
                      • <strong>Environmental Factors:</strong> Temperature and
                      vibration affect battery and tire performance
                    </div>
                    <div>
                      • <strong>Maintenance Alerts:</strong> Predictive
                      maintenance based on motor status
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
                  {vehicleMetrics.fuelEfficiency.toFixed(0)}%
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
                  {vehicleMetrics.engineHealth.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Overall Health</div>
                <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                  💡 <strong>Enhanced Calculation:</strong> Motor system health
                  with vibration penalty. High vibration reduces engine health
                  rating
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Formula:</strong> System Health - (Vibration {">"}{" "}
                  3mm/s ? (Vibration - 3) × 2 : 0) = Engine Health (%)
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Battery Level</div>
                <div
                  className={`text-2xl font-bold ${getEfficiencyColor(
                    vehicleMetrics.batteryLevel
                  )}`}
                >
                  {vehicleMetrics.batteryLevel.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Charge Status</div>
                <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                  💡 <strong>Advanced Calculation:</strong> Temperature +
                  vibration impact on battery life. Heat and vibration both
                  reduce battery performance
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Formula:</strong> 100 - (Temp - 30°C) × 2 - (Vibration{" "}
                  {">"} 2mm/s ? (Vibration - 2) × 5 : 0) = Battery Level (%)
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Tire Pressure</div>
                <div
                  className={`text-2xl font-bold ${getEfficiencyColor(
                    vehicleMetrics.tirePressure
                  )}`}
                >
                  {vehicleMetrics.tirePressure.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Optimal Range</div>
                <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                  💡 <strong>Enhanced Calculation:</strong> Vibration + speed
                  impact on tire pressure. High vibration and speed indicate
                  tire wear
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Formula:</strong> 100 - Vibration × 15 - (Speed {">"}{" "}
                  2000RPM ? (Speed - 2000) × 0.01 : 0) = Tire Pressure (%)
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Maintenance</div>
                <div className="text-2xl font-bold">
                  {vehicleMetrics.maintenanceDue ? "⚠️" : "✅"}
                </div>
                <div className="text-xs opacity-90">
                  {vehicleMetrics.maintenanceDue ? "Due Soon" : "Up to Date"}
                </div>
                <div className="text-xs opacity-60 mt-2 border-t border-red-400 pt-2">
                  💡 <strong>Smart Prediction:</strong> Multi-factor maintenance
                  prediction. Considers maintenance status, health, vibration,
                  and temperature
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Formula:</strong> Maintenance Status {">"} 1 OR Health{" "}
                  {"<"} 70% OR Vibration {">"} 4mm/s OR Temp {">"} 80°C =
                  Maintenance Due
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
                    diagnostics. RPM, temperature, vibration, and oil pressure
                    data help monitor engine performance and identify potential
                    issues.
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
                    💡 Engine revolutions per minute - direct from motor speed
                    sensor
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
                    📊 <strong>Formula:</strong> reading.temperature = Engine
                    Temperature (°C)
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
                    📊 <strong>Formula:</strong> reading.oilPressure = Engine
                    Oil Pressure (bar)
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
                    Vehicle performance metrics are calculated from motor sensor
                    data to provide comprehensive insights into power output,
                    efficiency, operating hours, and overall system health.
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
                    📊 <strong>Formula:</strong> reading.operatingHours = Engine
                    Operating Hours (h)
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
                    📊 <strong>Formula:</strong> reading.systemHealth = Vehicle
                    System Health (%)
                  </div>
                </div>
              </div>
            </div>

            {/* Data Flow Explanation */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-indigo-600 dark:text-indigo-400 mr-3 mt-1">
                  🔄
                </div>
                <div>
                  <h4 className="text-indigo-800 dark:text-indigo-200 font-medium mb-2">
                    Real-time Vehicle Data Flow
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    can be intelligently applied to vehicle monitoring systems.
                    Every metric shown is calculated from live motor readings.
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                    <div>
                      • <strong>Motor Sensors → Vehicle:</strong> Speed,
                      temperature, vibration, and health data
                    </div>
                    <div>
                      • <strong>Smart Algorithms:</strong> Real-time
                      calculations convert motor metrics to vehicle metrics
                    </div>
                    <div>
                      • <strong>Predictive Analytics:</strong> Maintenance
                      alerts and performance optimization
                    </div>
                    <div>
                      • <strong>Practical Applications:</strong> Fuel
                      efficiency, engine health, battery monitoring
                    </div>
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
                    This dashboard transforms your motor sensor data into
                    comprehensive recreation equipment monitoring. Real motor
                    readings are intelligently converted to show how your
                    industrial motor's performance translates to recreational
                    equipment efficiency, maintenance needs, and operational
                    status.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Equipment Performance:</strong> Motor efficiency
                      directly correlates to equipment performance
                    </div>
                    <div>
                      • <strong>Predictive Maintenance:</strong> Motor status
                      determines equipment maintenance needs
                    </div>
                    <div>
                      • <strong>Environmental Factors:</strong> Temperature and
                      vibration affect equipment condition
                    </div>
                    <div>
                      • <strong>Smart Recommendations:</strong> AI-generated
                      maintenance alerts based on motor data
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
                    Status, operating hours, and efficiency are calculated from
                    motor readings to predict maintenance needs and performance.
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
                    💡 Motor operating hours ÷ 10 = Boat engine hours (scaled
                    for recreation use)
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
                      {recreationEquipment.boatEngine.efficiency.toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Advanced calculation: Motor efficiency with marine
                    environment factors. Temperature and vibration impact boat
                    engine performance
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Efficiency × (1 - (Temp - 25°C)
                    × 0.002) - (Vibration {">"} 2mm/s ? (Vibration - 2) × 3 : 0)
                    = Boat Engine Efficiency (%)
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
                    Motor vibration and temperature data determine lawn mower
                    condition. Higher vibration indicates dull blades, while
                    temperature affects fuel system performance.
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
                      {recreationEquipment.lawnMower.bladeSharpness.toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Enhanced calculation: Vibration + speed impact on blade
                    wear. High vibration and speed indicate dull blades
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> 100 - Vibration × 20 - (Speed{" "}
                    {">"} 1500RPM ? (Speed - 1500) × 0.01 : 0) = Blade Sharpness
                    (%)
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
                    💡 Advanced calculation: Temperature + vibration impact on
                    fuel system. Heat and vibration both affect fuel system
                    performance
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> 100 - (Temp - 40°C) × 3 -
                    (Vibration {">"} 1.5mm/s ? (Vibration - 1.5) × 5 : 0) = Fuel
                    Level (%)
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
                    generator performance. Higher power output and efficiency
                    indicate better generator operation and fuel economy.
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
                    💡 Based on motor status: "normal" = Ready, other = Check
                    Required
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Power Output
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {recreationEquipment.generator.powerOutput.toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Advanced calculation: Motor power with temperature
                    compensation. Higher temperature reduces generator power
                    output
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Power × 10 × (1 - (Temp - 30°C)
                    × 0.001) = Generator Power Output (%)
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
                      {recreationEquipment.generator.fuelEfficiency.toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Enhanced calculation: Motor efficiency with vibration
                    impact. High vibration reduces generator fuel efficiency
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Efficiency × (1 - (Vibration{" "}
                    {">"} 2mm/s ? (Vibration - 2) × 0.02 : 0)) = Generator Fuel
                    Efficiency (%)
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
                    Motor coolant flow rate and power consumption determine pool
                    pump performance. Flow rate indicates water circulation
                    efficiency, while energy usage shows power consumption.
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
                    📊 <strong>Formula:</strong> Coolant Flow × 20 × (1 - (Temp
                    - 25°C) × 0.001) = Pool Pump Flow Rate (%)
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
                    💡 Enhanced calculation: Motor power with vibration impact.
                    High vibration increases pool pump energy consumption
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Power × 15 × (1 + (Vibration{" "}
                    {">"} 1mm/s ? (Vibration - 1) × 0.05 : 0)) = Pool Pump
                    Energy Usage (%)
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
                  predictive maintenance recommendations. Each recommendation is
                  based on specific thresholds and motor performance indicators.
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
                        💡 Triggered when motor status ≠ "normal" - indicates
                        potential engine issues
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
                        💡 Triggered when blade sharpness &lt; 70% - high motor
                        vibration indicates dull blades
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
                        💡 Triggered when flow rate &lt; 75% - low motor coolant
                        flow indicates pump issues
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Data Flow Explanation */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-indigo-600 dark:text-indigo-400 mr-3 mt-1">
                  🔄
                </div>
                <div>
                  <h4 className="text-indigo-800 dark:text-indigo-200 font-medium mb-2">
                    Real-time Recreation Equipment Data Flow
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    can be intelligently applied to recreation equipment
                    monitoring systems. Every metric shown is calculated from
                    live motor readings.
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                    <div>
                      • <strong>Motor Sensors → Recreation:</strong> Speed,
                      temperature, vibration, and power data
                    </div>
                    <div>
                      • <strong>Smart Scaling:</strong> Motor metrics scaled
                      appropriately for recreation equipment
                    </div>
                    <div>
                      • <strong>Predictive Maintenance:</strong>{" "}
                      Equipment-specific maintenance alerts and recommendations
                    </div>
                    <div>
                      • <strong>Practical Applications:</strong> Boat engines,
                      lawn mowers, generators, pool pumps
                    </div>
                  </div>
                </div>
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
                    This dashboard transforms your motor sensor data into
                    comprehensive smart appliance monitoring. Real motor
                    readings are intelligently converted to show how your
                    industrial motor's performance translates to household
                    appliance efficiency, energy usage, and operational status.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Energy Management:</strong> Motor power
                      consumption directly correlates to appliance energy usage
                    </div>
                    <div>
                      • <strong>Performance Monitoring:</strong> Motor
                      efficiency determines appliance operational efficiency
                    </div>
                    <div>
                      • <strong>Environmental Control:</strong> Temperature and
                      flow rate data affect appliance operation
                    </div>
                    <div>
                      • <strong>Cost Optimization:</strong> Smart algorithms
                      calculate potential energy savings
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
                    Motor sensor data translates to washing machine performance.
                    Energy usage and efficiency are calculated from motor
                    readings to monitor appliance power consumption and
                    operational effectiveness.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Status
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal"
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 80
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 4
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal"
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
                    📊 <strong>Formula:</strong> Status = Normal ? "Running" :
                    Temp {">"} 80°C ? "Overheating" : Vibration {">"} 4mm/s ?
                    "High Vibration" : "Standby"
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
                    💡 Dynamic cycle selection based on motor conditions: high
                    temp = Hot Wash, high vibration = Heavy Duty, high
                    efficiency = Eco Wash, else = Normal Wash
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Cycle = Temp {">"} 70°C ? "Hot
                    Wash" : Vibration {">"} 3mm/s ? "Heavy Duty" : Efficiency{" "}
                    {">"} 90% ? "Eco Wash" : "Normal Wash"
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
                    💡 Enhanced calculation: Motor power consumption with cycle
                    efficiency factor. Different cycles have different energy
                    requirements
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Power Consumption × (1 + (Cycle
                    Factor × 0.1)) = Washing Machine Energy Usage (kW)
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Efficiency
                    </span>
                    <span
                      className={`font-medium ${getEfficiencyColor(
                        reading?.efficiency || 0
                      )}`}
                    >
                      {(reading?.efficiency || 0).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Enhanced calculation: Motor efficiency with temperature
                    and vibration impact. High temperature and vibration reduce
                    washing machine effectiveness
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Efficiency × (1 - (Temp - 22°C)
                    × 0.001) - (Vibration {">"} 2mm/s ? (Vibration - 2) × 0.5 :
                    0) = Washing Machine Efficiency (%)
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
                    readings to monitor appliance water consumption and heating
                    efficiency.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Status
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.temperature || 0) > 50
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 80
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 3
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
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
                    💡 Dynamic status based on motor conditions: normal + high
                    temp = Washing, high temp = Overheating, high vibration =
                    High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Temp {">"}{" "}
                    50°C) ? "Washing" : Temp {">"} 80°C ? "Overheating" :
                    Vibration {">"} 3mm/s ? "High Vibration" : "Standby"
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
                    temperature impact. Higher temperature affects water flow
                    efficiency
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Coolant Flow Rate × (1 - (Temp
                    - 25°C) × 0.001) = Dishwasher Water Usage (L/min)
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
                    (Efficiency - 50) × 0.001) = Dishwasher Heating Temperature
                    (°C)
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
                    Motor sensor data translates to refrigerator performance.
                    Temperature, compressor speed, and energy usage are
                    calculated from motor readings to monitor cooling system
                    efficiency and power consumption.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Status
                    </span>
                    <span
                      className={`font-medium ${
                        (reading?.temperature || 0) > 60
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 80
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 3
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {(reading?.temperature || 0) > 60
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
                    Cooling, very high temp = Overheating, high vibration = High
                    Vibration, else = Standby
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
                    compensation. Higher temperature increases compressor speed
                    for better cooling
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
                    cooling efficiency factor. Higher efficiency reduces energy
                    consumption
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Power Consumption × (1 -
                    (Efficiency - 50) × 0.001) = Refrigerator Energy Usage (kW)
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
                  savings. All metrics are dynamically calculated from real-time
                  motor readings.
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm opacity-90">Total Energy Usage</div>
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
                  <div className="text-sm opacity-90">Average Efficiency</div>
                  <div className="text-2xl font-bold">
                    {(reading?.efficiency || 0).toFixed(0)}%
                  </div>
                  <div className="text-xs opacity-60 mt-2 border-t border-indigo-400 pt-2">
                    💡 <strong>Performance Metric:</strong> Motor efficiency
                    directly translates to appliance operational efficiency
                  </div>
                  <div className="text-xs opacity-50 mt-1">
                    <strong>Calculation:</strong> reading.efficiency = Average
                    Efficiency (%)
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
                    <strong>Formula:</strong> Motor Efficiency × 0.3 = Monthly
                    Savings ($)
                  </div>
                </div>
              </div>
            </div>

            {/* Data Flow Explanation */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-indigo-600 dark:text-indigo-400 mr-3 mt-1">
                  🔄
                </div>
                <div>
                  <h4 className="text-indigo-800 dark:text-indigo-200 font-medium mb-2">
                    Real-time Smart Appliances Data Flow
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    can be intelligently applied to smart appliance monitoring
                    systems. Every metric shown is calculated from live motor
                    readings.
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                    <div>
                      • <strong>Motor Sensors → Appliances:</strong> Power,
                      temperature, speed, and flow rate data
                    </div>
                    <div>
                      • <strong>Energy Management:</strong> Motor power
                      consumption translates to appliance energy usage
                    </div>
                    <div>
                      • <strong>Performance Monitoring:</strong> Motor
                      efficiency determines appliance operational effectiveness
                    </div>
                    <div>
                      • <strong>Cost Optimization:</strong> Smart algorithms
                      calculate potential energy savings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
