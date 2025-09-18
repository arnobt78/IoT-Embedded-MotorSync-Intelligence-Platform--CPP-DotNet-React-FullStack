import React, { useState, useEffect } from "react";
import type { MotorReading } from "../types/types";

interface DailyLifeApplicationsProps {
  reading: MotorReading | null;
}

export default function DailyLifeApplications({ reading }: DailyLifeApplicationsProps) {
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

  useEffect(() => {
    if (reading) {
      // Simulate home automation metrics based on motor readings
      setHomeAutomation({
        hvacEfficiency: Math.min(100, reading.efficiency || 0),
        energySavings: Math.min(100, (reading.efficiency || 0) * 0.8),
        comfortLevel: Math.min(100, 100 - (reading.temperature - 50) * 2),
        airQuality: Math.min(100, 100 - (reading.vibration || 0) * 10),
        smartDevices: Math.floor((reading.speed || 0) / 100),
      });

      // Simulate vehicle metrics
      setVehicleMetrics({
        fuelEfficiency: Math.min(100, (reading.efficiency || 0) * 1.2),
        engineHealth: Math.min(100, reading.systemHealth || 0),
        batteryLevel: Math.min(100, 100 - (reading.temperature - 30) * 2),
        tirePressure: Math.min(100, 100 - (reading.vibration || 0) * 15),
        maintenanceDue: (reading.maintenanceStatus || 0) > 1,
      });

      // Simulate recreation equipment
      setRecreationEquipment({
        boatEngine: {
          status: reading.status === "normal" ? "Good" : "Needs Attention",
          hours: Math.floor((reading.operatingHours || 0) / 10),
          efficiency: Math.min(100, reading.efficiency || 0),
        },
        lawnMower: {
          status: reading.status === "normal" ? "Good" : "Needs Maintenance",
          bladeSharpness: Math.min(100, 100 - (reading.vibration || 0) * 20),
          fuelLevel: Math.min(100, 100 - (reading.temperature - 40) * 3),
        },
        generator: {
          status: reading.status === "normal" ? "Ready" : "Check Required",
          powerOutput: Math.min(100, (reading.powerConsumption || 0) * 10),
          fuelEfficiency: Math.min(100, reading.efficiency || 0),
        },
        poolPump: {
          status: reading.status === "normal" ? "Running" : "Maintenance Needed",
          flowRate: Math.min(100, (reading.coolantFlowRate || 0) * 20),
          energyUsage: Math.min(100, (reading.powerConsumption || 0) * 15),
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

            {/* Home Automation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">HVAC Efficiency</div>
                <div className={`text-2xl font-bold ${getEfficiencyColor(homeAutomation.hvacEfficiency)}`}>
                  {homeAutomation.hvacEfficiency.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Heating/Cooling</div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Energy Savings</div>
                <div className={`text-2xl font-bold ${getEfficiencyColor(homeAutomation.energySavings)}`}>
                  {homeAutomation.energySavings.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Monthly Savings</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Comfort Level</div>
                <div className={`text-2xl font-bold ${getEfficiencyColor(homeAutomation.comfortLevel)}`}>
                  {homeAutomation.comfortLevel.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Temperature</div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Air Quality</div>
                <div className={`text-2xl font-bold ${getEfficiencyColor(homeAutomation.airQuality)}`}>
                  {homeAutomation.airQuality.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Clean Air</div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Smart Devices</div>
                <div className="text-2xl font-bold">{homeAutomation.smartDevices}</div>
                <div className="text-xs opacity-90">Connected</div>
              </div>
            </div>

            {/* Smart Home Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🌡️ Climate Control
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Thermostat</span>
                    <span className="font-medium">Smart Control Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Fan Speed</span>
                    <span className="font-medium">{reading?.speed || 0} RPM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Temperature</span>
                    <span className="font-medium">{reading?.temperature || 0}°C</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  💡 Energy Management
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Power Usage</span>
                    <span className="font-medium">{(reading?.powerConsumption || 0).toFixed(1)} kW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Efficiency</span>
                    <span className="font-medium">{(reading?.efficiency || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Cost Savings</span>
                    <span className="font-medium text-green-600">${(homeAutomation.energySavings * 0.5).toFixed(0)}/month</span>
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

            {/* Vehicle Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Fuel Efficiency</div>
                <div className={`text-2xl font-bold ${getEfficiencyColor(vehicleMetrics.fuelEfficiency)}`}>
                  {vehicleMetrics.fuelEfficiency.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">MPG Rating</div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Engine Health</div>
                <div className={`text-2xl font-bold ${getEfficiencyColor(vehicleMetrics.engineHealth)}`}>
                  {vehicleMetrics.engineHealth.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Overall Health</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Battery Level</div>
                <div className={`text-2xl font-bold ${getEfficiencyColor(vehicleMetrics.batteryLevel)}`}>
                  {vehicleMetrics.batteryLevel.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Charge Status</div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Tire Pressure</div>
                <div className={`text-2xl font-bold ${getEfficiencyColor(vehicleMetrics.tirePressure)}`}>
                  {vehicleMetrics.tirePressure.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Optimal Range</div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Maintenance</div>
                <div className="text-2xl font-bold">
                  {vehicleMetrics.maintenanceDue ? "⚠️" : "✅"}
                </div>
                <div className="text-xs opacity-90">
                  {vehicleMetrics.maintenanceDue ? "Due Soon" : "Up to Date"}
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🔧 Engine Diagnostics
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">RPM</span>
                    <span className="font-medium">{reading?.speed || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Engine Temp</span>
                    <span className="font-medium">{reading?.temperature || 0}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Vibration</span>
                    <span className="font-medium">{(reading?.vibration || 0).toFixed(2)} mm/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Oil Pressure</span>
                    <span className="font-medium">{(reading?.oilPressure || 0).toFixed(1)} bar</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  ⚡ Performance Metrics
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Power Output</span>
                    <span className="font-medium">{(reading?.powerConsumption || 0).toFixed(1)} kW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Efficiency</span>
                    <span className="font-medium">{(reading?.efficiency || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Operating Hours</div>
                    <span className="font-medium">{(reading?.operatingHours || 0).toFixed(0)}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">System Health</span>
                    <span className="font-medium">{(reading?.systemHealth || 0).toFixed(0)}%</span>
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

            {/* Recreation Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Boat Engine */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🚤 Boat Engine
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className={`font-medium ${getStatusColor(recreationEquipment.boatEngine.status)}`}>
                      {recreationEquipment.boatEngine.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Operating Hours</span>
                    <span className="font-medium">{recreationEquipment.boatEngine.hours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Efficiency</span>
                    <span className={`font-medium ${getEfficiencyColor(recreationEquipment.boatEngine.efficiency)}`}>
                      {recreationEquipment.boatEngine.efficiency.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Lawn Mower */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🌱 Lawn Mower
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className={`font-medium ${getStatusColor(recreationEquipment.lawnMower.status)}`}>
                      {recreationEquipment.lawnMower.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Blade Sharpness</span>
                    <span className={`font-medium ${getEfficiencyColor(recreationEquipment.lawnMower.bladeSharpness)}`}>
                      {recreationEquipment.lawnMower.bladeSharpness.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Fuel Level</span>
                    <span className={`font-medium ${getEfficiencyColor(recreationEquipment.lawnMower.fuelLevel)}`}>
                      {recreationEquipment.lawnMower.fuelLevel.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Generator */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  ⚡ Generator
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className={`font-medium ${getStatusColor(recreationEquipment.generator.status)}`}>
                      {recreationEquipment.generator.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Power Output</span>
                    <span className="font-medium">{recreationEquipment.generator.powerOutput.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Fuel Efficiency</span>
                    <span className={`font-medium ${getEfficiencyColor(recreationEquipment.generator.fuelEfficiency)}`}>
                      {recreationEquipment.generator.fuelEfficiency.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Pool Pump */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🏊 Pool Pump
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className={`font-medium ${getStatusColor(recreationEquipment.poolPump.status)}`}>
                      {recreationEquipment.poolPump.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Flow Rate</span>
                    <span className="font-medium">{recreationEquipment.poolPump.flowRate.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Energy Usage</span>
                    <span className="font-medium">{recreationEquipment.poolPump.energyUsage.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment Recommendations */}
            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">
                💡 Equipment Recommendations
              </h4>
              <div className="space-y-2">
                {recreationEquipment.boatEngine.status !== "Good" && (
                  <div className="flex items-start space-x-3 p-3 bg-white dark:bg-blue-800 rounded-lg">
                    <span className="text-lg">🚤</span>
                    <span className="text-blue-700 dark:text-blue-200">
                      Boat engine needs attention - schedule maintenance
                    </span>
                  </div>
                )}
                {recreationEquipment.lawnMower.bladeSharpness < 70 && (
                  <div className="flex items-start space-x-3 p-3 bg-white dark:bg-blue-800 rounded-lg">
                    <span className="text-lg">🌱</span>
                    <span className="text-blue-700 dark:text-blue-200">
                      Lawn mower blades need sharpening
                    </span>
                  </div>
                )}
                {recreationEquipment.generator.powerOutput < 80 && (
                  <div className="flex items-start space-x-3 p-3 bg-white dark:bg-blue-800 rounded-lg">
                    <span className="text-lg">⚡</span>
                    <span className="text-blue-700 dark:text-blue-200">
                      Generator power output below optimal
                    </span>
                  </div>
                )}
                {recreationEquipment.poolPump.flowRate < 75 && (
                  <div className="flex items-start space-x-3 p-3 bg-white dark:bg-blue-800 rounded-lg">
                    <span className="text-lg">🏊</span>
                    <span className="text-blue-700 dark:text-blue-200">
                      Pool pump flow rate needs adjustment
                    </span>
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

            {/* Smart Appliances Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🧺 Washing Machine
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className="font-medium text-green-600">Running</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Cycle</span>
                    <span className="font-medium">Normal Wash</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Energy Usage</span>
                    <span className="font-medium">{(reading?.powerConsumption || 0).toFixed(1)} kW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Efficiency</span>
                    <span className={`font-medium ${getEfficiencyColor(reading?.efficiency || 0)}`}>
                      {(reading?.efficiency || 0).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🍳 Dishwasher
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className="font-medium text-blue-600">Standby</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Water Usage</span>
                    <span className="font-medium">{(reading?.coolantFlowRate || 0).toFixed(1)} L/min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Temperature</span>
                    <span className="font-medium">{reading?.temperature || 0}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Cycle Time</span>
                    <span className="font-medium">45 min</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  ❄️ Refrigerator
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className="font-medium text-green-600">Cooling</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Temperature</span>
                    <span className="font-medium">{reading?.temperature || 0}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Compressor</span>
                    <span className="font-medium">{reading?.speed || 0} RPM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Energy Usage</span>
                    <span className="font-medium">{(reading?.powerConsumption || 0).toFixed(1)} kW</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appliance Efficiency Summary */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg">
              <h4 className="font-semibold mb-4">📊 Overall Appliance Efficiency</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm opacity-90">Total Energy Usage</div>
                  <div className="text-2xl font-bold">{(reading?.powerConsumption || 0).toFixed(1)} kW</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Average Efficiency</div>
                  <div className="text-2xl font-bold">{(reading?.efficiency || 0).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Monthly Savings</div>
                  <div className="text-2xl font-bold">${((reading?.efficiency || 0) * 0.3).toFixed(0)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
