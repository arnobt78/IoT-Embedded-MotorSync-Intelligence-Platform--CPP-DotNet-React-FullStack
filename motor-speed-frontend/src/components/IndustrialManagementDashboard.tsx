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
  const [machines, setMachines] = useState<IndustrialMachine[]>([]);
  const [facilityOverview, setFacilityOverview] = useState<FacilityOverview | null>(null);
  const [productionLineAnalysis, setProductionLineAnalysis] = useState<ProductionLineAnalysis | null>(null);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<MaintenanceSchedule | null>(null);
  const [qualityMetrics, setQualityMetrics] = useState<QualityControlMetrics | null>(null);
  const [supplyChain, setSupplyChain] = useState<SupplyChainOptimization | null>(null);

  useEffect(() => {
    loadIndustrialData();
  }, [facilityId]);

  const loadIndustrialData = async () => {
    try {
      setLoading(true);
      const [
        machinesResponse,
        overviewResponse,
        productionResponse,
        maintenanceResponse,
        qualityResponse,
        supplyResponse,
      ] = await Promise.all([
        axios.get<IndustrialMachine[]>(`${API_BASE_URL}/api/industrial/machines`),
        axios.get<FacilityOverview>(`${API_BASE_URL}/api/industrial/facility-overview/${facilityId}`),
        axios.get<ProductionLineAnalysis>(`${API_BASE_URL}/api/industrial/production-line/LINE-001/analysis`),
        axios.get<MaintenanceSchedule>(`${API_BASE_URL}/api/industrial/maintenance-schedule/${facilityId}`),
        axios.get<QualityControlMetrics>(`${API_BASE_URL}/api/industrial/quality-control/MOTOR-001`),
        axios.get<SupplyChainOptimization>(`${API_BASE_URL}/api/industrial/supply-chain/${facilityId}`),
      ]);

      setMachines(machinesResponse.data);
      setFacilityOverview(overviewResponse.data);
      setProductionLineAnalysis(productionResponse.data);
      setMaintenanceSchedule(maintenanceResponse.data);
      setQualityMetrics(qualityResponse.data);
      setSupplyChain(supplyResponse.data);
    } catch (error) {
      console.error("Failed to load industrial data:", error);
    } finally {
      setLoading(false);
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
        return "bg-green-100 text-green-800";
      case "low stock":
        return "bg-yellow-100 text-yellow-800";
      case "out of stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            onClick={loadIndustrialData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            🔄 Refresh
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
            {/* Facility Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Total Machines</div>
                <div className="text-3xl font-bold">{facilityOverview.totalMachines}</div>
                <div className="text-sm opacity-90">
                  {facilityOverview.onlineMachines} Online
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Overall Efficiency</div>
                <div className="text-3xl font-bold">
                  {facilityOverview.overallEfficiency.toFixed(1)}%
                </div>
                <div className="text-sm opacity-90">Facility Average</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Energy Consumption</div>
                <div className="text-3xl font-bold">
                  {facilityOverview.totalEnergyConsumption.toFixed(1)} kW
                </div>
                <div className="text-sm opacity-90">Total Usage</div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Operating Cost</div>
                <div className="text-3xl font-bold">
                  ${facilityOverview.totalOperatingCost.toFixed(0)}
                </div>
                <div className="text-sm opacity-90">Per Hour</div>
              </div>
            </div>

            {/* Production Lines & Departments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  📈 Production Lines
                </h3>
                <div className="space-y-2">
                  {facilityOverview.productionLines.length > 0 ? (
                    facilityOverview.productionLines.map((line, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
                      >
                        <span className="text-gray-700 dark:text-gray-200">{line}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Active</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No production lines configured</div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  🏢 Departments
                </h3>
                <div className="space-y-2">
                  {facilityOverview.departments.length > 0 ? (
                    facilityOverview.departments.map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
                      >
                        <span className="text-gray-700 dark:text-gray-200">{dept}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Operational</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No departments configured</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "machines" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              ⚙️ Industrial Machines
            </h3>
            {machines.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No machines configured
              </div>
            ) : (
              <div className="grid gap-4">
                {machines.map((machine) => (
                  <div
                    key={machine.id}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-800 dark:text-white">
                          {machine.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                            machine.status
                          )}`}
                        >
                          {machine.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(machine.lastSeen).toLocaleString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Type:</span>
                        <span className="ml-2 font-medium">{machine.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Efficiency:</span>
                        <span className="ml-2 font-medium">{machine.averageEfficiency.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Energy:</span>
                        <span className="ml-2 font-medium">{machine.energyConsumption.toFixed(1)} kW</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Cost:</span>
                        <span className="ml-2 font-medium">${machine.costPerHour.toFixed(2)}/h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "production" && productionLineAnalysis && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              📈 Production Line Analysis
            </h3>

            {/* Production Line Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Total Machines</div>
                <div className="text-3xl font-bold">{productionLineAnalysis.totalMachines}</div>
                <div className="text-sm opacity-90">
                  {productionLineAnalysis.onlineMachines} Online
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Line Efficiency</div>
                <div className="text-3xl font-bold">
                  {productionLineAnalysis.overallEfficiency.toFixed(1)}%
                </div>
                <div className="text-sm opacity-90">Overall Performance</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Energy Usage</div>
                <div className="text-3xl font-bold">
                  {productionLineAnalysis.totalEnergyConsumption.toFixed(1)} kW
                </div>
                <div className="text-sm opacity-90">Total Consumption</div>
              </div>
            </div>

            {/* Bottlenecks */}
            {productionLineAnalysis.bottlenecks.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
                  ⚠️ Production Bottlenecks
                </h4>
                <div className="space-y-2">
                  {productionLineAnalysis.bottlenecks.map((bottleneck, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white dark:bg-yellow-800 rounded-lg"
                    >
                      <span className="text-lg">•</span>
                      <span className="text-yellow-700 dark:text-yellow-200">
                        {bottleneck}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                💡 Recommendations
              </h4>
              <div className="space-y-2">
                {productionLineAnalysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg"
                  >
                    <span className="text-lg">•</span>
                    <span className="text-gray-700 dark:text-gray-200">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "maintenance" && maintenanceSchedule && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              🔧 Maintenance Schedule
            </h3>
            {maintenanceSchedule.scheduledTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No maintenance tasks scheduled
              </div>
            ) : (
              <div className="space-y-3">
                {maintenanceSchedule.scheduledTasks.map((task) => (
                  <div
                    key={task.taskId}
                    className={`p-4 rounded-lg border ${getPriorityColor(task.priority)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{task.machineName}</h4>
                      <span className="text-sm font-medium">{task.taskType}</span>
                    </div>
                    <p className="text-sm mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}</span>
                      <span>Duration: {task.estimatedDuration}h</span>
                      <span>Cost: ${task.estimatedCost.toFixed(0)}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        Skills: {task.requiredSkills.join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quality" && qualityMetrics && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              ✅ Quality Control Metrics
            </h3>

            {/* Quality Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Quality Score</div>
                <div className="text-3xl font-bold">{qualityMetrics.qualityScore.toFixed(1)}%</div>
                <div className="text-sm opacity-90">Overall Rating</div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Defect Rate</div>
                <div className="text-3xl font-bold">{qualityMetrics.defectRate.toFixed(1)}%</div>
                <div className="text-sm opacity-90">Failure Rate</div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Total Inspections</div>
                <div className="text-3xl font-bold">{qualityMetrics.totalInspections}</div>
                <div className="text-sm opacity-90">
                  {qualityMetrics.passedInspections} Passed
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Failed Inspections</div>
                <div className="text-3xl font-bold">{qualityMetrics.failedInspections}</div>
                <div className="text-sm opacity-90">Requires Attention</div>
              </div>
            </div>

            {/* Common Defects */}
            {qualityMetrics.commonDefects.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4">
                  🚨 Common Defects
                </h4>
                <div className="space-y-2">
                  {qualityMetrics.commonDefects.map((defect, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white dark:bg-red-800 rounded-lg"
                    >
                      <span className="text-lg">•</span>
                      <span className="text-red-700 dark:text-red-200">{defect}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Recommendations */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                💡 Quality Recommendations
              </h4>
              <div className="space-y-2">
                {qualityMetrics.qualityRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg"
                  >
                    <span className="text-lg">•</span>
                    <span className="text-gray-700 dark:text-gray-200">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "supply" && supplyChain && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              📦 Supply Chain Optimization
            </h3>

            {/* Supply Chain Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Inventory Turnover</div>
                <div className="text-3xl font-bold">{supplyChain.inventoryTurnover}</div>
                <div className="text-sm opacity-90">Times per Year</div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Inventory Value</div>
                <div className="text-3xl font-bold">
                  ${(supplyChain.inventoryValue / 1000).toFixed(0)}k
                </div>
                <div className="text-sm opacity-90">Total Value</div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Stockouts</div>
                <div className="text-3xl font-bold">{supplyChain.stockouts}</div>
                <div className="text-sm opacity-90">Critical Items</div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Overstock Items</div>
                <div className="text-3xl font-bold">{supplyChain.overstockItems}</div>
                <div className="text-sm opacity-90">Excess Inventory</div>
              </div>
            </div>

            {/* Critical Items */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                🚨 Critical Inventory Items
              </h4>
              <div className="space-y-3">
                {supplyChain.criticalItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="p-4 bg-white dark:bg-gray-600 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-800 dark:text-white">
                        {item.name}
                      </h5>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStockStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Current:</span>
                        <span className="ml-2 font-medium">{item.currentStock}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Min:</span>
                        <span className="ml-2 font-medium">{item.minimumStock}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Max:</span>
                        <span className="ml-2 font-medium">{item.maximumStock}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Cost:</span>
                        <span className="ml-2 font-medium">${item.unitCost.toFixed(2)}</span>
                      </div>
                    </div>
                    {item.nextRestockDate && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Next Restock: {new Date(item.nextRestockDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Recommendations */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                💡 Supply Chain Recommendations
              </h4>
              <div className="space-y-2">
                {supplyChain.optimizationRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg"
                  >
                    <span className="text-lg">•</span>
                    <span className="text-gray-700 dark:text-gray-200">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
