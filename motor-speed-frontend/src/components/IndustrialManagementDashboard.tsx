import React, { useState, useEffect } from "react";
import type {
  IndustrialMachine,
  ProductionLineAnalysis,
  FacilityOverview,
  MaintenanceSchedule,
  QualityControlMetrics,
  SupplyChainOptimization,
} from "../types/types";
import { API_BASE_URL } from "../services/api";
import axios from "axios";

interface IndustrialManagementDashboardProps {
  facilityId?: string;
}

export default function IndustrialManagementDashboard({
  facilityId = "FACILITY-001",
}: IndustrialManagementDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [machines, setMachines] = useState<IndustrialMachine[]>([]);
  const [facilityOverview, setFacilityOverview] =
    useState<FacilityOverview | null>(null);
  const [productionLineAnalysis, setProductionLineAnalysis] =
    useState<ProductionLineAnalysis | null>(null);
  const [maintenanceSchedule, setMaintenanceSchedule] =
    useState<MaintenanceSchedule | null>(null);
  const [qualityMetrics, setQualityMetrics] =
    useState<QualityControlMetrics | null>(null);
  const [supplyChain, setSupplyChain] =
    useState<SupplyChainOptimization | null>(null);

  // Add CSS for spin animation
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
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    loadIndustrialData();
  }, [facilityId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadIndustrialData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Add minimum delay for refresh to show animation
      const startTime = Date.now();
      const minDelay = isRefresh ? 1000 : 0; // 1 second minimum for refresh
      const [
        machinesResponse,
        overviewResponse,
        productionResponse,
        maintenanceResponse,
        qualityResponse,
        supplyResponse,
      ] = await Promise.all([
        axios.get<IndustrialMachine[]>(
          `${API_BASE_URL}/api/industrial/machines`
        ),
        axios.get<FacilityOverview>(
          `${API_BASE_URL}/api/industrial/facility-overview/${facilityId}`
        ),
        axios.get<ProductionLineAnalysis>(
          `${API_BASE_URL}/api/industrial/production-line/LINE-001/analysis`
        ),
        axios.get<MaintenanceSchedule>(
          `${API_BASE_URL}/api/industrial/maintenance-schedule/${facilityId}`
        ),
        axios.get<QualityControlMetrics>(
          `${API_BASE_URL}/api/industrial/quality-control/MOTOR-001`
        ),
        axios.get<SupplyChainOptimization>(
          `${API_BASE_URL}/api/industrial/supply-chain/${facilityId}`
        ),
      ]);

      setMachines(machinesResponse.data);
      setFacilityOverview(overviewResponse.data);
      setProductionLineAnalysis(productionResponse.data);
      setMaintenanceSchedule(maintenanceResponse.data);
      setQualityMetrics(qualityResponse.data);
      setSupplyChain(supplyResponse.data);

      // Ensure minimum delay for refresh animation
      if (isRefresh) {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsed);
        if (remainingDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        }
      }
    } catch (error) {
      console.error("Failed to load industrial data:", error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-100 text-green-800 border-green-300";
      case "offline":
        return "bg-red-100 text-red-800 border-red-300";
      case "maintenance":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "error":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "bg-green-100 text-green-800 border-green-300";
      case "low stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "out of stock":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🏭 Industrial Management Dashboard
          </h2>
          <button
            onClick={() => loadIndustrialData(true)}
            disabled={refreshing || loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 ${
              refreshing || loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <div className="relative">
              <span
                className={`text-lg inline-block ${
                  refreshing ? "spin-icon" : ""
                }`}
              >
                🔄
              </span>
            </div>
            <span className="transition-opacity duration-200">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex space-x-1 overflow-x-auto">
          {[
            { id: "overview", label: "Facility Overview", icon: "🏢" },
            { id: "machines", label: "Machines", icon: "⚙️" },
            { id: "production", label: "Production Lines", icon: "📈" },
            { id: "maintenance", label: "Maintenance", icon: "🔧" },
            { id: "quality", label: "Quality Control", icon: "✅" },
            { id: "supply", label: "Supply Chain", icon: "📦" },
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
        {activeTab === "overview" && facilityOverview && (
          <div className="space-y-6">
            {/* Main Educational Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                  ℹ️
                </div>
                <div>
                  <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                    🏢 Facility Overview Dashboard
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                    This is your facility's central command center, providing a
                    high-level view of all industrial operations, equipment
                    performance, and resource utilization across your entire
                    manufacturing facility.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Real-time Monitoring:</strong> Live data from
                      all connected machines and systems
                    </div>
                    <div>
                      • <strong>Performance Analytics:</strong> Efficiency
                      metrics and operational insights
                    </div>
                    <div>
                      • <strong>Resource Management:</strong> Energy consumption
                      and cost tracking
                    </div>
                    <div>
                      • <strong>Operational Status:</strong> Overall facility
                      health and productivity indicators
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status Explanation */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-yellow-600 dark:text-yellow-400 mr-3 mt-1">
                  ⚠️
                </div>
                <div>
                  <h4 className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                    Current Dashboard Status
                  </h4>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    <strong>Default Values Displayed:</strong> The dashboard
                    currently shows baseline values (zeros) because no
                    industrial machines have been configured yet. This is normal
                    for a new facility setup. Once you add machines and
                    production lines, these metrics will automatically populate
                    with real-time data.
                  </p>
                </div>
              </div>
            </div>
            {/* Metric Cards Explanation */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-800 dark:text-white font-medium mb-3">
                📊 Key Performance Indicators (KPIs)
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                These four metrics provide the essential overview of your
                facility's operational health and performance:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-300">
                <div>
                  <strong>🔵 Total Machines:</strong> Complete inventory of all
                  industrial equipment
                </div>
                <div>
                  <strong>🟢 Overall Efficiency:</strong> Average performance
                  across all operational machines
                </div>
                <div>
                  <strong>🟣 Energy Consumption:</strong> Real-time power usage
                  for cost optimization
                </div>
                <div>
                  <strong>🟠 Operating Cost:</strong> Total facility expenses
                  per hour for budget planning
                </div>
              </div>
            </div>

            {/* Facility Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Total Machines</div>
                <div className="text-3xl font-bold">
                  {facilityOverview.totalMachines}
                </div>
                <div className="text-sm opacity-90">
                  {facilityOverview.onlineMachines} Online
                </div>
                <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                  💡 <strong>Equipment Inventory:</strong> Complete count of all
                  registered industrial machines in your facility. Includes
                  motors, pumps, conveyors, and other production equipment.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Online Status:</strong> Machines currently connected
                  and reporting real-time data
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Overall Efficiency</div>
                <div className="text-3xl font-bold">
                  {facilityOverview.overallEfficiency.toFixed(1)}%
                </div>
                <div className="text-sm opacity-90">Facility Average</div>
                <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                  💡 <strong>Performance Metric:</strong> Weighted average of
                  all machines' efficiency ratings. Measures how well your
                  equipment performs compared to optimal specifications.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Calculation:</strong> (Sum of all machine
                  efficiencies) ÷ (Total number of machines)
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Energy Consumption</div>
                <div className="text-3xl font-bold">
                  {facilityOverview.totalEnergyConsumption.toFixed(1)} kW
                </div>
                <div className="text-sm opacity-90">Total Usage</div>
                <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                  💡 <strong>Power Monitoring:</strong> Real-time total power
                  consumption from all active machines. Critical for energy cost
                  management and sustainability goals.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Tracking:</strong> Continuous monitoring helps
                  identify energy-intensive operations and optimization
                  opportunities
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Operating Cost</div>
                <div className="text-3xl font-bold">
                  ${facilityOverview.totalOperatingCost.toFixed(0)}
                </div>
                <div className="text-sm opacity-90">Per Hour</div>
                <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                  💡 <strong>Cost Analysis:</strong> Total facility operational
                  expenses per hour, including energy, maintenance, labor, and
                  overhead costs.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Purpose:</strong> Budget planning, profitability
                  analysis, and cost optimization decisions
                </div>
              </div>
            </div>

            {/* Organizational Structure Explanation */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-indigo-600 dark:text-indigo-400 mr-3 mt-1">
                  🏗️
                </div>
                <div>
                  <h4 className="text-indigo-800 dark:text-indigo-200 font-medium mb-2">
                    Facility Organizational Structure
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    Your facility is organized into production lines and
                    departments to optimize workflow, resource allocation, and
                    operational efficiency.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-indigo-700 dark:text-indigo-300">
                    <div>
                      <strong>📈 Production Lines:</strong> Sequential workflows
                      where machines work together to manufacture products
                    </div>
                    <div>
                      <strong>🏢 Departments:</strong> Functional units
                      responsible for specific aspects of operations
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Lines & Departments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  📈 Production Lines
                </h3>
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                    What are Production Lines?
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    Sequential workflows where multiple machines work together
                    to transform raw materials into finished products. Each line
                    is optimized for specific manufacturing processes.
                  </div>
                </div>
                <div className="space-y-2">
                  {facilityOverview.productionLines.length > 0 ? (
                    facilityOverview.productionLines.map((line, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                      >
                        <div>
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {line}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Production Line {index + 1}
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Active
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-gray-500 dark:text-gray-400 mb-2">
                        <div className="text-2xl mb-2">📈</div>
                        <div className="font-medium">
                          No production lines configured
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
                        <strong>Setup Required:</strong> Production lines need
                        to be defined and machines assigned to create efficient
                        manufacturing workflows.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  🏢 Departments
                </h3>
                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                    What are Departments?
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    Functional organizational units within the facility, each
                    responsible for specific operations like manufacturing,
                    quality control, maintenance, or logistics.
                  </div>
                </div>
                <div className="space-y-2">
                  {facilityOverview.departments.length > 0 ? (
                    facilityOverview.departments.map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                      >
                        <div>
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {dept}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Department {index + 1}
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Operational
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-gray-500 dark:text-gray-400 mb-2">
                        <div className="text-2xl mb-2">🏢</div>
                        <div className="font-medium">
                          No departments configured
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
                        <strong>Organization Needed:</strong> Define departments
                        to organize your facility's operations and assign
                        machines to appropriate functional units.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "machines" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                ⚙️ Industrial Machines
              </h3>

              {/* Educational Info Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                      Industrial Machine Management
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                      This section manages all industrial equipment in your
                      facility. Each machine is monitored for performance,
                      efficiency, and operational costs.
                    </p>
                    <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                      <div>
                        • <strong>Machine Types:</strong> Different equipment
                        categories (motors, pumps, conveyors, etc.)
                      </div>
                      <div>
                        • <strong>Status Monitoring:</strong> Real-time
                        operational status (Online, Offline, Maintenance, Error)
                      </div>
                      <div>
                        • <strong>Efficiency Tracking:</strong> Performance
                        metrics to optimize operations
                      </div>
                      <div>
                        • <strong>Energy Management:</strong> Power consumption
                        monitoring for cost optimization
                      </div>
                      <div>
                        • <strong>Cost Analysis:</strong> Operational expenses
                        per hour to track profitability
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Machine Status Legend */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-gray-800 dark:text-white font-medium mb-3">
                  🏷️ Machine Status Legend
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Online:</strong> Operational and reporting data
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Offline:</strong> Not connected or powered down
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Maintenance:</strong> Scheduled or active
                      maintenance
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Error:</strong> Fault detected, requires attention
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {machines.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <div className="text-4xl mb-2">⚙️</div>
                  <div className="text-lg font-medium">
                    No machines configured
                  </div>
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500 max-w-md mx-auto">
                  <p className="mb-2">
                    <strong>Getting Started:</strong> Industrial machines need
                    to be added to your facility before they can be monitored.
                  </p>
                  <p className="mb-3">
                    This dashboard will show individual machine details
                    including:
                  </p>
                  <ul className="text-left space-y-1 text-xs">
                    <li>
                      • Real-time operational status and last seen timestamp
                    </li>
                    <li>• Machine type classification and specifications</li>
                    <li>
                      • Efficiency percentage based on optimal performance
                    </li>
                    <li>• Energy consumption in kilowatts (kW)</li>
                    <li>• Operating cost per hour for budget planning</li>
                    <li>• Location and department assignments</li>
                    <li>• Maintenance schedules and history</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-700 dark:text-gray-300 font-medium">
                    Registered Machines ({machines.length})
                  </h4>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    💡 Click on any machine card to view detailed specifications
                  </div>
                </div>

                <div className="grid gap-4">
                  {machines.map((machine) => (
                    <div
                      key={machine.id}
                      className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">⚙️</div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white text-lg">
                              {machine.name}
                            </h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {machine.machineId} • {machine.location}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              machine.status
                            )}`}
                          >
                            {machine.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Last Seen
                          </div>
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {new Date(machine.lastSeen).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                            Machine Type
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {machine.type}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            💡 Equipment category and function
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                            Efficiency
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {machine.averageEfficiency.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            💡 Performance vs. optimal baseline
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                            Energy Usage
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {machine.energyConsumption.toFixed(1)} kW
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            💡 Power consumption rate
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                            Operating Cost
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            ${machine.costPerHour.toFixed(2)}/h
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            💡 Total operational expenses per hour
                          </div>
                        </div>
                      </div>

                      {/* Additional Machine Details */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="font-medium">Manufacturer:</span>{" "}
                            {machine.manufacturer}
                          </div>
                          <div>
                            <span className="font-medium">Model:</span>{" "}
                            {machine.model}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span>{" "}
                            {machine.department || "Unassigned"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "production" && productionLineAnalysis && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                📈 Production Line Analysis
              </h3>

              {/* Educational Info Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                      📈 Production Line Management
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                      Production lines are sequential workflows where multiple
                      machines work together to transform raw materials into
                      finished products. This analysis provides insights into
                      line performance, bottlenecks, and optimization
                      opportunities.
                    </p>
                    <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                      <div>
                        • <strong>Line Performance:</strong> Overall efficiency
                        and throughput of the entire production sequence
                      </div>
                      <div>
                        • <strong>Machine Coordination:</strong> How well
                        machines work together in the production flow
                      </div>
                      <div>
                        • <strong>Bottleneck Identification:</strong>{" "}
                        Pinpointing machines or processes that limit overall
                        output
                      </div>
                      <div>
                        • <strong>Resource Optimization:</strong> Energy usage
                        and cost analysis for line efficiency
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status Explanation */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-yellow-600 dark:text-yellow-400 mr-3 mt-1">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                      Production Line Status
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      <strong>No Production Lines Configured:</strong> The
                      analysis currently shows baseline values because no
                      production lines have been set up yet. Production lines
                      need to be defined and machines assigned to them before
                      meaningful analysis can be performed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Overview Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-800 dark:text-white font-medium mb-3">
                📊 Production Line Key Performance Indicators
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                These three metrics provide essential insights into your
                production line's operational health and performance:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-300">
                <div>
                  <strong>🔵 Total Machines:</strong> Complete count of
                  equipment assigned to this production line
                </div>
                <div>
                  <strong>🟢 Line Efficiency:</strong> Overall performance
                  rating of the entire production sequence
                </div>
                <div>
                  <strong>🟣 Energy Usage:</strong> Total power consumption from
                  all machines in the line
                </div>
              </div>
            </div>

            {/* Production Line Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Total Machines</div>
                <div className="text-3xl font-bold">
                  {productionLineAnalysis.totalMachines}
                </div>
                <div className="text-sm opacity-90">
                  {productionLineAnalysis.onlineMachines} Online
                </div>
                <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                  💡 <strong>Equipment Count:</strong> Total number of machines
                  assigned to this specific production line. Includes all
                  equipment types working together in the manufacturing
                  sequence.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Online Status:</strong> Machines currently connected
                  and reporting real-time operational data
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Line Efficiency</div>
                <div className="text-3xl font-bold">
                  {productionLineAnalysis.overallEfficiency.toFixed(1)}%
                </div>
                <div className="text-sm opacity-90">Overall Performance</div>
                <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                  💡 <strong>Line Performance:</strong> Weighted average
                  efficiency of all machines in the production line. Measures
                  how well the entire sequence performs compared to optimal
                  output.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Calculation:</strong> Considers availability,
                  performance, and quality across all line machines
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Energy Usage</div>
                <div className="text-3xl font-bold">
                  {productionLineAnalysis.totalEnergyConsumption.toFixed(1)} kW
                </div>
                <div className="text-sm opacity-90">Total Consumption</div>
                <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                  💡 <strong>Power Monitoring:</strong> Combined energy
                  consumption from all machines in the production line. Critical
                  for cost optimization and sustainability tracking.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Purpose:</strong> Energy cost analysis and identifying
                  power-intensive processes in the line
                </div>
              </div>
            </div>

            {/* Bottlenecks Section */}
            {productionLineAnalysis.bottlenecks.length > 0 ? (
              <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <div className="text-yellow-600 dark:text-yellow-400 mr-3 mt-1">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Production Bottlenecks Detected
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      <strong>What are bottlenecks?</strong> Bottlenecks are
                      machines or processes in your production line that limit
                      overall output. They're the slowest or most problematic
                      parts of your workflow that prevent maximum efficiency.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {productionLineAnalysis.bottlenecks.map(
                    (bottleneck, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-white dark:bg-yellow-800 rounded-lg border border-yellow-200 dark:border-yellow-700"
                      >
                        <span className="text-lg text-yellow-600 dark:text-yellow-400">
                          •
                        </span>
                        <div>
                          <span className="text-yellow-700 dark:text-yellow-200 font-medium">
                            {bottleneck}
                          </span>
                          <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                            💡 This bottleneck is limiting your production
                            line's overall throughput and efficiency
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-green-600 dark:text-green-400 mr-3 mt-1">
                    ✅
                  </div>
                  <div>
                    <h4 className="text-green-800 dark:text-green-200 font-medium mb-1">
                      No Bottlenecks Detected
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      <strong>Good News!</strong> No production bottlenecks have
                      been identified in your current setup. This means your
                      production line is operating smoothly without any major
                      constraints limiting output.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="text-gray-600 dark:text-gray-400 mr-3 mt-1">
                  💡
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Production Line Recommendations
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    <strong>What are recommendations?</strong> These are
                    AI-generated suggestions based on your production line's
                    current performance data. They help optimize efficiency,
                    reduce costs, and improve overall output quality.
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                    <strong>Analysis includes:</strong> Machine performance
                    trends, energy consumption patterns, maintenance schedules,
                    and production output quality metrics.
                  </div>
                </div>
              </div>

              {productionLineAnalysis.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {productionLineAnalysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {rec}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 This recommendation is based on current production
                          line performance analysis
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white dark:bg-gray-600 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                    <div className="text-2xl mb-2">💡</div>
                    <div className="font-medium">
                      No machines found in production line
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                    <strong>Setup Required:</strong> Add machines to your
                    production line to receive personalized optimization
                    recommendations based on real performance data.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "maintenance" && maintenanceSchedule && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                🔧 Maintenance Schedule
              </h3>

              {/* Educational Info Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                      🔧 Industrial Maintenance Management
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                      This section manages all maintenance activities for your
                      industrial equipment. Effective maintenance planning is
                      crucial for maximizing equipment uptime, preventing costly
                      breakdowns, and ensuring optimal performance throughout
                      your facility's lifecycle.
                    </p>
                    <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                      <div>
                        • <strong>Preventive Maintenance:</strong> Scheduled
                        maintenance to prevent failures before they occur
                      </div>
                      <div>
                        • <strong>Predictive Maintenance:</strong> Data-driven
                        maintenance based on equipment condition monitoring
                      </div>
                      <div>
                        • <strong>Corrective Maintenance:</strong> Emergency
                        repairs when equipment fails unexpectedly
                      </div>
                      <div>
                        • <strong>Resource Planning:</strong> Skill
                        requirements, duration estimates, and cost optimization
                      </div>
                      <div>
                        • <strong>Priority Management:</strong> Critical vs.
                        routine maintenance scheduling based on business impact
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance Priority Legend */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-gray-800 dark:text-white font-medium mb-3">
                  🏷️ Maintenance Priority Levels
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Critical:</strong> Safety hazards or production
                      stoppage
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>High:</strong> Performance degradation or imminent
                      failure
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Medium:</strong> Scheduled preventive maintenance
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Low:</strong> Routine inspection or minor
                      adjustments
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Status Explanation */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-yellow-600 dark:text-yellow-400 mr-3 mt-1">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                      Maintenance Schedule Status
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      <strong>No Maintenance Tasks Scheduled:</strong> The
                      maintenance schedule currently shows no scheduled tasks
                      because no industrial machines have been configured yet.
                      Once machines are added to your facility, maintenance
                      schedules will automatically populate based on
                      manufacturer recommendations, usage patterns, and
                      predictive analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {maintenanceSchedule.scheduledTasks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <div className="text-4xl mb-2">🔧</div>
                  <div className="text-lg font-medium">
                    No maintenance tasks scheduled
                  </div>
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500 max-w-md mx-auto">
                  <p className="mb-2">
                    <strong>Getting Started:</strong> Industrial machines need
                    to be added to your facility before maintenance schedules
                    can be generated.
                  </p>
                  <p className="mb-3">
                    This dashboard will show detailed maintenance information
                    including:
                  </p>
                  <ul className="text-left space-y-1 text-xs">
                    <li>
                      • Scheduled maintenance tasks with priority levels and
                      descriptions
                    </li>
                    <li>
                      • Estimated duration and cost for each maintenance
                      activity
                    </li>
                    <li>
                      • Required skills and technician qualifications for each
                      task
                    </li>
                    <li>
                      • Machine-specific maintenance schedules and intervals
                    </li>
                    <li>
                      • Preventive vs. corrective maintenance categorization
                    </li>
                    <li>• Maintenance history and performance tracking</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-700 dark:text-gray-300 font-medium">
                    Scheduled Maintenance Tasks (
                    {maintenanceSchedule.scheduledTasks.length})
                  </h4>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    💡 Click on any task to view detailed maintenance procedures
                  </div>
                </div>

                <div className="space-y-3">
                  {maintenanceSchedule.scheduledTasks.map((task) => (
                    <div
                      key={task.taskId}
                      className={`p-6 rounded-lg border hover:shadow-md transition-all duration-200 ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">🔧</div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                              {task.machineName}
                            </h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Task ID: {task.taskId}
                            </div>
                          </div>
                          <span className="text-sm font-medium px-2 py-1 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border">
                            {task.taskType}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Scheduled Date
                          </div>
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {new Date(task.scheduledDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                          <strong>Description:</strong>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-600 p-3 rounded-lg">
                          {task.description}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 This task is scheduled to maintain optimal
                          equipment performance and prevent unexpected failures
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                            Estimated Duration
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {task.estimatedDuration} hours
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            💡 Time required for complete maintenance task
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                            Estimated Cost
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            ${task.estimatedCost.toFixed(0)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            💡 Includes labor, parts, and overhead costs
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                            Priority Level
                          </div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {task.priority.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            💡 Determines scheduling urgency and resource
                            allocation
                          </div>
                        </div>
                      </div>

                      {/* Required Skills Section */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                          <strong>Required Skills:</strong>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {task.requiredSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          💡 Technician qualifications needed to safely and
                          effectively perform this maintenance task
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Maintenance Benefits Section */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="text-green-600 dark:text-green-400 mr-3 mt-1">
                      ✅
                    </div>
                    <div>
                      <h4 className="text-green-800 dark:text-green-200 font-medium mb-2">
                        Benefits of Proactive Maintenance
                      </h4>
                      <div className="text-green-700 dark:text-green-300 text-sm space-y-1">
                        <div>
                          • <strong>Increased Uptime:</strong> Prevents
                          unexpected equipment failures and production stoppages
                        </div>
                        <div>
                          • <strong>Cost Reduction:</strong> Preventive
                          maintenance is 5-10x cheaper than emergency repairs
                        </div>
                        <div>
                          • <strong>Extended Equipment Life:</strong> Regular
                          maintenance can extend equipment lifespan by 20-30%
                        </div>
                        <div>
                          • <strong>Improved Safety:</strong> Regular
                          inspections identify and address safety hazards early
                        </div>
                        <div>
                          • <strong>Optimized Performance:</strong>{" "}
                          Well-maintained equipment operates more efficiently
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "quality" && qualityMetrics && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                ✅ Quality Control Metrics
              </h3>

              {/* Educational Info Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                      ✅ Quality Control Management
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                      This section monitors the quality of your production
                      processes and outputs. Quality control ensures that
                      products meet specifications, identifies defects early,
                      and provides actionable insights to improve manufacturing
                      quality and reduce waste.
                    </p>
                    <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                      <div>
                        • <strong>Quality Monitoring:</strong> Continuous
                        assessment of product quality against defined standards
                      </div>
                      <div>
                        • <strong>Defect Detection:</strong> Early
                        identification of quality issues to prevent waste and
                        rework
                      </div>
                      <div>
                        • <strong>Statistical Analysis:</strong> Data-driven
                        insights into quality trends and patterns
                      </div>
                      <div>
                        • <strong>Process Improvement:</strong> Recommendations
                        to enhance quality and reduce defects
                      </div>
                      <div>
                        • <strong>Compliance Tracking:</strong> Monitoring
                        adherence to quality standards and regulations
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Metrics Explanation */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-gray-800 dark:text-white font-medium mb-3">
                  📊 Quality Control Key Performance Indicators
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  These four metrics provide essential insights into your
                  facility's quality performance:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-300">
                  <div>
                    <strong>🟢 Quality Score:</strong> Overall health rating of
                    production processes
                  </div>
                  <div>
                    <strong>🔴 Defect Rate:</strong> Percentage of products
                    failing quality standards
                  </div>
                  <div>
                    <strong>🔵 Total Inspections:</strong> Number of quality
                    checks performed
                  </div>
                  <div>
                    <strong>🟠 Failed Inspections:</strong> Count of quality
                    issues requiring attention
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Quality Score</div>
                <div className="text-3xl font-bold">
                  {qualityMetrics.qualityScore.toFixed(1)}%
                </div>
                <div className="text-sm opacity-90">Overall Rating</div>
                <div className="text-xs opacity-60 mt-2 border-t border-emerald-300 pt-2">
                  💡 <strong>Quality Health:</strong> Composite score based on
                  defect rates, inspection results, and process stability.
                  Higher scores indicate better quality performance and fewer
                  issues.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Calculation:</strong> Based on passed inspections,
                  defect frequency, and process consistency
                </div>
              </div>

              <div className="bg-gradient-to-r from-rose-400 to-rose-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Defect Rate</div>
                <div className="text-3xl font-bold">
                  {qualityMetrics.defectRate.toFixed(1)}%
                </div>
                <div className="text-sm opacity-90">Failure Rate</div>
                <div className="text-xs opacity-60 mt-2 border-t border-rose-300 pt-2">
                  💡 <strong>Quality Issues:</strong> Percentage of products or
                  processes that fail quality standards. Lower rates indicate
                  better quality control and fewer manufacturing problems.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Impact:</strong> Higher defect rates lead to increased
                  waste, rework, and customer complaints
                </div>
              </div>

              <div className="bg-gradient-to-r from-sky-400 to-sky-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Total Inspections</div>
                <div className="text-3xl font-bold">
                  {qualityMetrics.totalInspections}
                </div>
                <div className="text-sm opacity-90">
                  {qualityMetrics.passedInspections} Passed
                </div>
                <div className="text-xs opacity-60 mt-2 border-t border-sky-300 pt-2">
                  💡 <strong>Quality Checks:</strong> Total number of quality
                  inspections performed on products and processes. Regular
                  inspections help identify issues early and maintain consistent
                  quality standards.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Success Rate:</strong>{" "}
                  {(
                    (qualityMetrics.passedInspections /
                      qualityMetrics.totalInspections) *
                    100
                  ).toFixed(1)}
                  % of inspections passed
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Failed Inspections</div>
                <div className="text-3xl font-bold">
                  {qualityMetrics.failedInspections}
                </div>
                <div className="text-sm opacity-90">Requires Attention</div>
                <div className="text-xs opacity-60 mt-2 border-t border-amber-300 pt-2">
                  💡 <strong>Quality Issues:</strong> Number of inspections that
                  identified defects or non-conformities. These require
                  immediate attention to prevent further quality problems and
                  customer impact.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Action Required:</strong> Root cause analysis and
                  corrective actions needed
                </div>
              </div>
            </div>

            {/* Common Defects */}
            {qualityMetrics.commonDefects.length > 0 && (
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6 rounded-lg">
                <div className="flex items-start mb-4">
                  <div className="text-rose-600 dark:text-rose-400 mr-3 mt-1">
                    🚨
                  </div>
                  <div>
                    <h4 className="font-semibold text-rose-800 dark:text-rose-200 mb-2">
                      Common Quality Defects Identified
                    </h4>
                    <p className="text-rose-700 dark:text-rose-300 text-sm">
                      <strong>What are defects?</strong> Quality defects are
                      deviations from specifications that affect product
                      functionality, appearance, or performance. Identifying
                      common defects helps focus improvement efforts on the most
                      frequent issues.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {qualityMetrics.commonDefects.map((defect, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-white dark:bg-rose-800 rounded-lg border border-rose-200 dark:border-rose-700"
                    >
                      <div className="bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-rose-700 dark:text-rose-200 font-medium">
                          {defect}
                        </span>
                        <div className="text-xs text-rose-600 dark:text-rose-300 mt-1">
                          💡 This defect type has been identified multiple times
                          and requires attention
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-rose-100 dark:bg-rose-800 rounded-lg">
                  <div className="text-xs text-rose-700 dark:text-rose-200">
                    <strong>💡 Defect Analysis:</strong> Focus improvement
                    efforts on these common issues to achieve the greatest
                    impact on overall quality performance.
                  </div>
                </div>
              </div>
            )}

            {/* Quality Recommendations */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="text-gray-600 dark:text-gray-400 mr-3 mt-1">
                  💡
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Quality Improvement Recommendations
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    <strong>What are quality recommendations?</strong> These are
                    data-driven suggestions based on your quality metrics,
                    defect patterns, and inspection results. They help optimize
                    processes, reduce defects, and improve overall product
                    quality.
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                    <strong>Analysis includes:</strong> Defect frequency
                    patterns, inspection trends, process stability, and quality
                    performance benchmarks.
                  </div>
                </div>
              </div>

              {qualityMetrics.qualityRecommendations.length > 0 ? (
                <div className="space-y-3">
                  {qualityMetrics.qualityRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {rec}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 This recommendation is based on current quality
                          metrics and defect analysis
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white dark:bg-gray-600 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                    <div className="text-2xl mb-2">💡</div>
                    <div className="font-medium">
                      No specific recommendations available
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                    <strong>Good Quality Performance:</strong> Your quality
                    metrics are within acceptable ranges. Continue monitoring
                    and maintain current quality control practices.
                  </div>
                </div>
              )}
            </div>

            {/* Quality Benefits Section */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-emerald-600 dark:text-emerald-400 mr-3 mt-1">
                  ✅
                </div>
                <div>
                  <h4 className="text-emerald-800 dark:text-emerald-200 font-medium mb-2">
                    Benefits of Effective Quality Control
                  </h4>
                  <div className="text-emerald-700 dark:text-emerald-300 text-sm space-y-1">
                    <div>
                      • <strong>Reduced Waste:</strong> Early defect detection
                      prevents production of faulty products
                    </div>
                    <div>
                      • <strong>Customer Satisfaction:</strong> Consistent
                      quality improves customer experience and loyalty
                    </div>
                    <div>
                      • <strong>Cost Savings:</strong> Quality control reduces
                      rework, returns, and warranty claims
                    </div>
                    <div>
                      • <strong>Process Optimization:</strong> Quality data
                      helps identify and fix process inefficiencies
                    </div>
                    <div>
                      • <strong>Competitive Advantage:</strong> High-quality
                      products differentiate your business in the market
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "supply" && supplyChain && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                📦 Supply Chain Optimization
              </h3>

              {/* Educational Info Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                      📦 Supply Chain Management
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                      This section manages your facility's inventory, supplier
                      relationships, and logistics operations. Effective supply
                      chain management ensures optimal stock levels, reduces
                      costs, and prevents production disruptions while
                      maintaining efficient material flow throughout your
                      operations.
                    </p>
                    <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                      <div>
                        • <strong>Inventory Management:</strong> Optimal stock
                        levels to prevent shortages and overstocking
                      </div>
                      <div>
                        • <strong>Supplier Performance:</strong> Tracking
                        delivery times, quality, and reliability
                      </div>
                      <div>
                        • <strong>Cost Optimization:</strong> Reducing inventory
                        holding costs and procurement expenses
                      </div>
                      <div>
                        • <strong>Risk Management:</strong> Identifying and
                        mitigating supply chain disruptions
                      </div>
                      <div>
                        • <strong>Demand Forecasting:</strong> Predicting
                        material needs based on production schedules
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supply Chain Metrics Explanation */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-gray-800 dark:text-white font-medium mb-3">
                  📊 Supply Chain Key Performance Indicators
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  These four metrics provide essential insights into your
                  facility's supply chain performance:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-300">
                  <div>
                    <strong>🔵 Inventory Turnover:</strong> How efficiently
                    inventory is being used
                  </div>
                  <div>
                    <strong>🟢 Inventory Value:</strong> Total monetary value of
                    current stock
                  </div>
                  <div>
                    <strong>🔴 Stockouts:</strong> Critical items that are out
                    of stock
                  </div>
                  <div>
                    <strong>🟠 Overstock Items:</strong> Items with excessive
                    inventory levels
                  </div>
                </div>
              </div>
            </div>

            {/* Supply Chain Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-sky-400 to-sky-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Inventory Turnover</div>
                <div className="text-3xl font-bold">
                  {supplyChain.inventoryTurnover}
                </div>
                <div className="text-sm opacity-90">Times per Year</div>
                <div className="text-xs opacity-60 mt-2 border-t border-sky-300 pt-2">
                  💡 <strong>Efficiency Metric:</strong> Measures how many times
                  your inventory is sold or used per year. Higher turnover
                  indicates better inventory management and reduced holding
                  costs.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Calculation:</strong> Cost of goods sold ÷ Average
                  inventory value
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Inventory Value</div>
                <div className="text-3xl font-bold">
                  ${(supplyChain.inventoryValue / 1000).toFixed(0)}k
                </div>
                <div className="text-sm opacity-90">Total Value</div>
                <div className="text-xs opacity-60 mt-2 border-t border-emerald-300 pt-2">
                  💡 <strong>Financial Impact:</strong> Total monetary value of
                  all inventory currently held. This represents capital tied up
                  in stock and affects cash flow and working capital
                  requirements.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Purpose:</strong> Budget planning and working capital
                  management
                </div>
              </div>

              <div className="bg-gradient-to-r from-rose-400 to-rose-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Stockouts</div>
                <div className="text-3xl font-bold">
                  {supplyChain.stockouts}
                </div>
                <div className="text-sm opacity-90">Critical Items</div>
                <div className="text-xs opacity-60 mt-2 border-t border-rose-300 pt-2">
                  💡 <strong>Risk Indicator:</strong> Number of critical items
                  currently out of stock. Stockouts can cause production delays,
                  missed deadlines, and customer dissatisfaction.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Impact:</strong> Immediate reordering and supplier
                  coordination required
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Overstock Items</div>
                <div className="text-3xl font-bold">
                  {supplyChain.overstockItems}
                </div>
                <div className="text-sm opacity-90">Excess Inventory</div>
                <div className="text-xs opacity-60 mt-2 border-t border-amber-300 pt-2">
                  💡 <strong>Cost Indicator:</strong> Number of items with
                  inventory levels exceeding maximum thresholds. Overstocking
                  ties up capital and increases holding costs and obsolescence
                  risk.
                </div>
                <div className="text-xs opacity-50 mt-1">
                  <strong>Action:</strong> Review ordering patterns and adjust
                  procurement strategies
                </div>
              </div>
            </div>

            {/* Critical Items */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="text-gray-600 dark:text-gray-400 mr-3 mt-1">
                  🚨
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Critical Inventory Items
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    <strong>What are critical items?</strong> These are
                    essential components and materials that are vital for your
                    production processes. Monitoring their stock levels helps
                    prevent production disruptions and ensures continuous
                    operations.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {supplyChain.criticalItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-semibold text-gray-800 dark:text-white text-lg">
                          {item.name}
                        </h5>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Item ID: {item.itemId}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStockStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                          Current Stock
                        </div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {item.currentStock}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 Quantity available now
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                          Minimum Level
                        </div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {item.minimumStock}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 Reorder trigger point
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                          Maximum Level
                        </div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {item.maximumStock}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 Optimal storage capacity
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">
                          Unit Cost
                        </div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          ${item.unitCost.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 Cost per individual unit
                        </div>
                      </div>
                    </div>

                    {item.nextRestockDate && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-500">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Next Restock Date:</strong>{" "}
                          <span className="font-medium">
                            {new Date(
                              item.nextRestockDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 Scheduled delivery date for this item
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Recommendations */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="text-gray-600 dark:text-gray-400 mr-3 mt-1">
                  💡
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Supply Chain Optimization Recommendations
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    <strong>What are supply chain recommendations?</strong>{" "}
                    These are data-driven suggestions based on your inventory
                    patterns, supplier performance, and demand forecasting. They
                    help optimize stock levels, reduce costs, and improve supply
                    chain efficiency.
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                    <strong>Analysis includes:</strong> Inventory turnover
                    rates, stockout frequency, overstock patterns, supplier lead
                    times, and demand variability.
                  </div>
                </div>
              </div>

              {supplyChain.optimizationRecommendations.length > 0 ? (
                <div className="space-y-3">
                  {supplyChain.optimizationRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {rec}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          💡 This recommendation is based on current supply
                          chain performance analysis
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white dark:bg-gray-600 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                    <div className="text-2xl mb-2">💡</div>
                    <div className="font-medium">
                      No specific recommendations available
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                    <strong>Good Supply Chain Performance:</strong> Your supply
                    chain metrics are within acceptable ranges. Continue
                    monitoring and maintain current optimization practices.
                  </div>
                </div>
              )}
            </div>

            {/* Supply Chain Benefits Section */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-emerald-600 dark:text-emerald-400 mr-3 mt-1">
                  ✅
                </div>
                <div>
                  <h4 className="text-emerald-800 dark:text-emerald-200 font-medium mb-2">
                    Benefits of Effective Supply Chain Management
                  </h4>
                  <div className="text-emerald-700 dark:text-emerald-300 text-sm space-y-1">
                    <div>
                      • <strong>Cost Reduction:</strong> Optimized inventory
                      levels reduce holding costs and waste
                    </div>
                    <div>
                      • <strong>Improved Cash Flow:</strong> Better inventory
                      turnover frees up working capital
                    </div>
                    <div>
                      • <strong>Reduced Risk:</strong> Proactive monitoring
                      prevents stockouts and production delays
                    </div>
                    <div>
                      • <strong>Enhanced Efficiency:</strong> Streamlined
                      procurement and logistics processes
                    </div>
                    <div>
                      • <strong>Better Planning:</strong> Data-driven
                      forecasting improves demand planning accuracy
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
