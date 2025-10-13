import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "../hooks/useToast";
import NavBar from "./NavBar";
import AnimatedGearIcon from "./ui/AnimatedGearIcon";
import type { BusinessInsights } from "../types";
import { API_BASE_URL } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BusinessInsightsPageProps {
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}

export default function BusinessInsightsPage({
  signalRConnected = true,
  backendStatus = "connected",
}: BusinessInsightsPageProps) {
  const [insights, setInsights] = useState<BusinessInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("executive");
  const [dataSource, setDataSource] = useState<"backend" | "offline">(
    "backend"
  );
  const toast = useToast();
  const hasLoadedRef = useRef(false);

  // Determine data source status
  const getDataSourceStatus = useCallback(() => {
    if (signalRConnected && backendStatus === "connected") {
      return "backend";
    }
    return "offline";
  }, [signalRConnected, backendStatus]);

  // Load business insights
  const loadInsights = useCallback(
    async (showToast = false) => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/motor/business-insights`
        );

        if (response.ok) {
          const data = await response.json();
          setInsights(data);

          if (showToast) {
            toast.success(
              "📊 Business Insights Updated",
              `System Health: ${data.executive.systemHealthScore}%, Total Machines: ${data.executive.totalMachines}`
            );
          }
        } else {
          setInsights(null);
          if (showToast) {
            toast.error(
              "❌ Failed to Load",
              "Unable to fetch business insights"
            );
          }
        }
      } catch (error) {
        console.error("Failed to load business insights:", error);
        setInsights(null);
        if (showToast) {
          toast.error("❌ Connection Error", "Check backend connection");
        }
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Initial load and setup - using ref to prevent double call in React Strict Mode
  useEffect(() => {
    // Prevent double call in React Strict Mode (development)
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    // Update data source
    const currentDataSource = getDataSourceStatus();
    setDataSource(currentDataSource);

    // Load insights
    loadInsights(true);

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => loadInsights(false), 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array to run only once on mount

  // Update data source when dependencies change (but don't reload data)
  useEffect(() => {
    const currentDataSource = getDataSourceStatus();
    setDataSource(currentDataSource);
  }, [signalRConnected, backendStatus, getDataSourceStatus]);

  const tabs = [
    { id: "executive", label: "📊 Executive Summary", icon: "📊" },
    { id: "financial", label: "💰 Financial", icon: "💰" },
    { id: "operational", label: "⚙️ Operational KPIs", icon: "⚙️" },
    { id: "trends", label: "📈 Trends", icon: "📈" },
    { id: "comparative", label: "🔍 Comparative", icon: "🔍" },
    { id: "predictive", label: "🔮 Predictive", icon: "🔮" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <NavBar darkMode={false} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  💼 Business Intelligence Analytics
                </h1>
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

              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Comprehensive business metrics and strategic insights from
                real-time industrial data
              </p>
              {insights && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Last updated:{" "}
                  {new Date(insights.executive.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => loadInsights(true)}
                disabled={loading}
                className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-3 shadow-lg ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <AnimatedGearIcon
                  isActive={true}
                  size="md"
                  status={dataSource === "backend" ? "live" : "offline"}
                />
                <span>{loading ? "Refreshing..." : "Refresh Insights"}</span>
              </button>

              {/* Status Indicator - positioned relative to button */}
              {dataSource === "backend" ? (
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
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && !insights && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AnimatedGearIcon isActive={true} size="lg" status="live" />
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Loading business insights...
              </p>
            </div>
          </div>
        )}

        {/* Offline State */}
        {!loading && !insights && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              System Offline
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Business insights are currently unavailable. Please check your
              connection to the backend.
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && insights && (
          <div className="space-y-6">
            {/* Executive Summary Tab */}
            {activeTab === "executive" && (
              <ExecutiveSummarySection insights={insights} />
            )}

            {/* Financial Tab */}
            {activeTab === "financial" && (
              <FinancialSection insights={insights} />
            )}

            {/* Operational KPIs Tab */}
            {activeTab === "operational" && (
              <OperationalSection insights={insights} />
            )}

            {/* Trends Tab */}
            {activeTab === "trends" && <TrendsSection insights={insights} />}

            {/* Comparative Tab */}
            {activeTab === "comparative" && (
              <ComparativeSection insights={insights} />
            )}

            {/* Predictive Tab */}
            {activeTab === "predictive" && (
              <PredictiveSection insights={insights} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================================================
// EXECUTIVE SUMMARY SECTION
// ========================================================================
function ExecutiveSummarySection({ insights }: { insights: BusinessInsights }) {
  const { executive } = insights;

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 75) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getHealthBg = (score: number) => {
    if (score >= 90) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 75) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* System Health Score */}
        <div
          className={`${getHealthBg(
            executive.systemHealthScore
          )} rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
                System Health
              </p>
              <div className="flex items-center justify-between">
                <p
                  className={`text-4xl font-bold ${getHealthColor(
                    executive.systemHealthScore
                  )}`}
                >
                  {executive.systemHealthScore}
                </p>
                <div className="text-5xl">❤️</div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                out of 100
              </p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>📚 Industrial Standard:</strong> System health combines
              efficiency (40%), uptime (30%), and issue count (30%).
              <span className="block mt-1">
                🟢 90-100%: World-class performance | 🟡 75-89%: Good
                performance | 🔴 &lt;75%: Needs improvement
              </span>
            </p>
          </div>
        </div>

        {/* Total Uptime */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
                System Uptime
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {executive.totalUptime.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {executive.onlineMachines}/{executive.totalMachines} online
                  </p>
                </div>
                <div className="text-5xl">⚡</div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>📚 Industrial Standard:</strong> System uptime measures
              operational availability.
              <span className="block mt-1">
                🟢 95%+: Excellent | 🟡 85-95%: Good | 🔴 &lt;85%: Poor
                (consider redundancy)
              </span>
            </p>
          </div>
        </div>

        {/* Overall Efficiency */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
                Efficiency
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {executive.overallEfficiency.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    average across fleet
                  </p>
                </div>
                <div className="text-5xl">📊</div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>📚 Industrial Standard:</strong> Efficiency = (Useful
              Output Power / Input Power) × 100%
              <span className="block mt-1">
                🟢 90%+: Excellent | 🟡 80-90%: Good | 🔴 &lt;80%: Needs
                optimization
              </span>
            </p>
          </div>
        </div>

        {/* Critical Issues */}
        <div
          className={`${
            executive.criticalIssues > 0
              ? "bg-red-50 dark:bg-red-900/20"
              : "bg-green-50 dark:bg-green-900/20"
          } rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
                Critical Issues
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-4xl font-bold ${
                      executive.criticalIssues > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {executive.criticalIssues}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {executive.criticalIssues > 0
                      ? "require attention"
                      : "all systems normal"}
                  </p>
                </div>
                <div className="text-5xl">
                  {executive.criticalIssues > 0 ? "🚨" : "✅"}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>📚 Industrial Standard:</strong> Critical issues indicate
              immediate maintenance needs.
              <span className="block mt-1">
                🟢 0: Optimal | 🟡 1-2: Monitor | 🔴 3+: Immediate action
                required
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>💡</span> Top Strategic Recommendations
        </h3>
        <div className="space-y-3">
          {executive.topRecommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {index + 1}
              </span>
              <p className="text-gray-700 dark:text-gray-300 flex-1">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// FINANCIAL SECTION
// ========================================================================
function FinancialSection({ insights }: { insights: BusinessInsights }) {
  const { financial } = insights;

  return (
    <div className="space-y-6">
      {/* Energy Costs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              24 Hours
            </h3>
            <span className="text-3xl">⚡</span>
          </div>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            ${financial.totalEnergyCost24h.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Energy Cost
          </p>
          <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-xs text-orange-700 dark:text-orange-300">
              <strong>📚 Industrial Standard:</strong> Energy costs based on
              $0.12/kWh (standard industrial rate)
              <span className="block mt-1">
                Formula: Total Power (kW) × Hours × Rate
              </span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              7 Days
            </h3>
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            ${financial.totalEnergyCost7d.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Energy Cost
          </p>
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              <strong>📚 Industrial Standard:</strong> Weekly costs help track
              operational patterns
              <span className="block mt-1">
                Monitor for peak usage periods and efficiency trends
              </span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              30 Days
            </h3>
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${financial.totalEnergyCost30d.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Energy Cost
          </p>
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-300">
              <strong>📚 Industrial Standard:</strong> Monthly costs align with
              billing cycles
              <span className="block mt-1">
                Use for budget planning and cost optimization strategies
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Financial Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Cost/Machine"
          value={`$${financial.averageCostPerMachine.toFixed(2)}`}
          subtitle="per month"
          icon="🏭"
          color="blue"
        />
        <MetricCard
          title="Potential Savings"
          value={`$${financial.estimatedSavings.toFixed(2)}`}
          subtitle="through optimization"
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Maintenance Cost"
          value={`$${financial.maintenanceCost30d.toFixed(0)}`}
          subtitle="last 30 days"
          icon="🔧"
          color="orange"
        />
        <MetricCard
          title="ROI"
          value={`${financial.roi.toFixed(1)}%`}
          subtitle="return on investment"
          icon="📈"
          color="purple"
        />
      </div>

      {/* Power Consumption */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          ⚡ Power Consumption Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Total Power Draw
            </p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {financial.totalPowerConsumption.toFixed(2)} kW
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Cost per kWh
            </p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              ${financial.costPerKWh.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>📚 Industrial Physics:</strong> Power consumption follows P
            = V × I × PF (Power = Voltage × Current × Power Factor)
            <span className="block mt-2">
              <strong>🔬 Real-time Calculation:</strong> Based on actual motor
              readings from C++ physics engine including load variations,
              temperature effects, and efficiency losses
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// OPERATIONAL SECTION
// ========================================================================
function OperationalSection({ insights }: { insights: BusinessInsights }) {
  const { operational } = insights;

  return (
    <div className="space-y-6">
      {/* OEE Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Overall Equipment Effectiveness (OEE)
          </h3>
          <p className="text-6xl font-bold text-blue-600 dark:text-blue-400 my-4">
            {operational.oee.toFixed(1)}%
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Industry Standard: 85% | World Class: 90%+
          </p>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>📚 Industrial Standard:</strong> OEE = Availability ×
              Performance × Quality
              <span className="block mt-1">
                <strong>🔬 Physics Formula:</strong> Based on real-time machine
                efficiency, uptime, and quality metrics from C++ physics engine
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* OEE Components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Availability
          </h4>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            {operational.availability.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Uptime / Planned Production Time
          </p>
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-300">
              <strong>📚 Industrial Standard:</strong> Availability = (Operating
              Time / Planned Production Time) × 100%
              <span className="block mt-1">
                🟢 95%+: Excellent | 🟡 85-95%: Good | 🔴 &lt;85%: Poor
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚡ Performance
          </h4>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {operational.performance.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Actual Output / Ideal Output
          </p>
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>📚 Industrial Standard:</strong> Performance = (Actual
              Output / Ideal Output) × 100%
              <span className="block mt-1">
                <strong>🔬 Physics:</strong> Based on machine efficiency from
                C++ engine: 92% - (Bearing Wear × 5) - (Oil Degradation × 2.5)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ✅ Quality
          </h4>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            {operational.quality.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Good Units / Total Units
          </p>
          <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300">
              <strong>📚 Industrial Standard:</strong> Quality = (Good Units /
              Total Units) × 100%
              <span className="block mt-1">
                <strong>🔬 Physics:</strong> Based on machine health scores from
                C++ engine: (Efficiency × 40%) + (Vibration Health × 25%) +
                (Temperature Health × 20%)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* MTBF & MTTR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⏱️ Mean Time Between Failures (MTBF)
          </h4>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            {operational.mtbf.toFixed(1)} hrs
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Average operating time between failures
          </p>
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-300">
              <strong>📚 Industrial Standard:</strong> MTBF = Total Operating
              Time / Number of Failures
              <span className="block mt-1">
                <strong>🔬 Physics:</strong> Based on critical readings count
                from database: (Total Operating Time / Number of Failures) hrs
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔧 Mean Time To Repair (MTTR)
          </h4>
          <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
            {operational.mttr.toFixed(1)} hrs
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Average time to restore operation
          </p>
          <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-xs text-orange-700 dark:text-orange-300">
              <strong>📚 Industrial Standard:</strong> MTTR = Total Downtime /
              Number of Repairs
              <span className="block mt-1">
                <strong>🔬 Physics:</strong> Based on maintenance events: 2.5 +
                (machineAge × 0.1) hrs
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Downtime & Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⏸️ Downtime Analysis
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Planned Downtime
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {operational.plannedDowntime} min
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unplanned Downtime
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {operational.unplannedDowntime} min
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📦 Production Output
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Actual Output
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {operational.productionOutput.toFixed(0)} units
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Target Output
              </p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {operational.targetOutput.toFixed(0)} units
              </p>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Achievement Rate
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(
                  (operational.productionOutput / operational.targetOutput) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// TRENDS SECTION
// ========================================================================
function TrendsSection({ insights }: { insights: BusinessInsights }) {
  const { trends } = insights;

  return (
    <div className="space-y-6">
      {/* Efficiency Trend */}
      <TrendChart
        title="📊 Efficiency Trend (Last 30 Days)"
        data={trends.efficiencyTrend}
        color="blue"
        unit="%"
      />

      {/* Energy Cost Trend */}
      <TrendChart
        title="💰 Energy Cost Trend (Last 30 Days)"
        data={trends.energyCostTrend}
        color="green"
        unit="$"
      />

      {/* Uptime Trend */}
      <TrendChart
        title="⚡ Uptime Trend (Last 30 Days)"
        data={trends.uptimeTrend}
        color="purple"
        unit="%"
      />

      {/* Maintenance Trend */}
      <TrendChart
        title="🔧 Maintenance Events (Last 30 Days)"
        data={trends.maintenanceTrend}
        color="orange"
        unit=" events"
      />
    </div>
  );
}

// ========================================================================
// COMPARATIVE SECTION
// ========================================================================
function ComparativeSection({ insights }: { insights: BusinessInsights }) {
  const { comparative } = insights;

  return (
    <div className="space-y-6">
      {/* Best & Worst Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-lg border border-green-200 dark:border-green-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🏆</span> Best Performer
          </h3>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {comparative.bestPerformer.machineName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ID: {comparative.bestPerformer.machineId}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Efficiency
                </p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {comparative.bestPerformer.efficiency.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Uptime
                </p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {comparative.bestPerformer.uptime.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-700 dark:text-green-300">
                <strong>📚 Industrial Standard:</strong> Best performer selected
                by highest efficiency
                <span className="block mt-1">
                  <strong>🔬 Physics:</strong> Based on real-time C++ engine
                  calculations including bearing wear, oil degradation, and
                  temperature effects
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 shadow-lg border border-red-200 dark:border-red-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Needs Improvement
          </h3>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {comparative.worstPerformer.machineName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ID: {comparative.worstPerformer.machineId}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Efficiency
                </p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {comparative.worstPerformer.efficiency.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Uptime
                </p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {comparative.worstPerformer.uptime.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-xs text-red-700 dark:text-red-300">
                <strong>📚 Industrial Standard:</strong> Needs improvement
                machines require immediate attention
                <span className="block mt-1">
                  <strong>🔬 Physics:</strong> Lower efficiency may indicate
                  bearing wear, oil degradation, or temperature issues
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🏢 Department Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Production
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {comparative.departments.productionEfficiency.toFixed(1)}%
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Maintenance
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {comparative.departments.maintenanceEfficiency.toFixed(1)}%
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Warehouse
            </p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {comparative.departments.warehouseEfficiency.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Shift Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🌓 Shift Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              ☀️ Day Shift
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Efficiency:
                </span>
                <span className="font-bold text-yellow-600 dark:text-yellow-400">
                  {comparative.shifts.dayShiftEfficiency.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Uptime:
                </span>
                <span className="font-bold text-yellow-600 dark:text-yellow-400">
                  {comparative.shifts.dayShiftUptime.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              🌙 Night Shift
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Efficiency:
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {comparative.shifts.nightShiftEfficiency.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Uptime:
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {comparative.shifts.nightShiftUptime.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Machine Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📊 All Machines Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Machine
                </th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Efficiency
                </th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Uptime
                </th>
                <th className="text-right p-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Energy Cost
                </th>
                <th className="text-center p-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {comparative.machinePerformance
                .slice(0, 10)
                .map((machine, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-3 text-sm text-gray-900 dark:text-white">
                      <div>
                        <p className="font-medium">{machine.machineName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {machine.machineId}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {machine.efficiency.toFixed(1)}%
                    </td>
                    <td className="p-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {machine.uptime.toFixed(1)}%
                    </td>
                    <td className="p-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      ${machine.energyCost.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          machine.status === "online"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {machine.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// PREDICTIVE SECTION
// ========================================================================
function PredictiveSection({ insights }: { insights: BusinessInsights }) {
  const { predictive } = insights;

  return (
    <div className="space-y-6">
      {/* Forecasts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔧 Maintenance Cost
          </h4>
          <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
            ${predictive.forecastedMaintenanceCost30d.toFixed(0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Next 30 days forecast
          </p>
          <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-xs text-orange-700 dark:text-orange-300">
              <strong>📚 Industrial Standard:</strong> Maintenance cost =
              (Events × $500) × 1.1 (10% increase projection)
              <span className="block mt-1">
                <strong>🔬 Physics:</strong> Based on historical maintenance
                events from last 30 days database readings
              </span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⏸️ Downtime Events
          </h4>
          <p className="text-4xl font-bold text-red-600 dark:text-red-400">
            {predictive.expectedDowntimeEvents}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Expected in next 30 days
          </p>
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-300">
              <strong>📚 Industrial Standard:</strong> Downtime events = Count
              of critical readings from last 30 days
              <span className="block mt-1">
                <strong>🔬 Physics:</strong> Based on database readings with
                Status = "critical" from last 30 days
              </span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚡ Energy Projection
          </h4>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            ${predictive.energyProjection30d.toFixed(0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Next 30 days projection
          </p>
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-300">
              <strong>📚 Industrial Standard:</strong> Energy projection =
              Current Power × 24 × 30 × $0.12 × 1.05
              <span className="block mt-1">
                <strong>🔬 Physics:</strong> Based on current machine power
                consumption with 5% seasonal increase projection
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Capacity Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>💡</span> Capacity Planning Recommendations
        </h3>
        <div className="space-y-3">
          {predictive.capacityRecommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <span className="text-xl">📌</span>
              <p className="text-gray-700 dark:text-gray-300 flex-1">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Maintenance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🔮 Predicted Maintenance Schedule
        </h3>
        <div className="space-y-4">
          {predictive.upcomingMaintenance.map((maint, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                maint.maintenanceType === "Critical"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">
                      {maint.maintenanceType === "Critical" ? "🚨" : "🔧"}
                    </span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {maint.machineName}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        maint.maintenanceType === "Critical"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {maint.maintenanceType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    ID: {maint.machineId}
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Predicted Date
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(maint.predictedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Confidence
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {maint.confidence.toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Est. Cost
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${maint.estimatedCost.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>📚 Industrial Standard:</strong> Maintenance prediction
            based on health score algorithm
            <span className="block mt-2">
              <strong>🔬 Physics Formula:</strong> Predicted Date = Current Date
              + 7 days + (Health Score ÷ 10)
              <br />
              <strong>Confidence:</strong> 95% for Health Score &lt;70
              (Critical) | 75% for Health Score ≥70 (Preventive)
              <br />
              <strong>Cost:</strong> $1,500 for Critical maintenance | $500 for
              Preventive maintenance
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================================================
// HELPER COMPONENTS
// ========================================================================
function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  };

  return (
    <div
      className={`${
        colorClasses[color as keyof typeof colorClasses]
      } rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p
        className={`text-3xl font-bold ${
          colorClasses[color as keyof typeof colorClasses].split(" ")[2]
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {subtitle}
      </p>
    </div>
  );
}

// Helper function for trend educational notes
function getTrendNote(title: string): string {
  if (title.toLowerCase().includes("efficiency")) {
    return "Efficiency trends show motor performance over time. Based on real-time C++ calculations: 92% - (Bearing Wear × 5) - (Oil Degradation × 2.5)";
  } else if (title.toLowerCase().includes("energy")) {
    return "Energy cost trends reflect power consumption patterns. Formula: Power (kW) × Hours × $0.12/kWh rate";
  } else if (title.toLowerCase().includes("uptime")) {
    return "Uptime trends indicate operational availability. Shows percentage of time machines are running vs. planned production time";
  } else if (title.toLowerCase().includes("maintenance")) {
    return "Maintenance trends track service events over time. Based on database readings with MaintenanceStatus > 0";
  }
  return "Trend analysis based on historical data patterns and real-time physics calculations";
}

function TrendChart({
  title,
  data,
  color,
  unit,
}: {
  title: string;
  data: { date: string; value: number; label: string }[];
  color: string;
  unit: string;
}) {
  const colorConfig = {
    blue: { stroke: "#3b82f6", fill: "#dbeafe" },
    green: { stroke: "#10b981", fill: "#d1fae5" },
    orange: { stroke: "#f59e0b", fill: "#fef3c7" },
    purple: { stroke: "#8b5cf6", fill: "#e9d5ff" },
  };

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  // Special handling for uptime trend (should be 0-100%)
  const isUptimeTrend = title.toLowerCase().includes("uptime");
  const yAxisDomain = isUptimeTrend
    ? [0, 100]
    : [minValue * 0.9, maxValue * 1.1];

  // Transform data for Recharts
  const chartData = data.slice(-14).map((point) => ({
    date: point.label,
    value: point.value,
    fullDate: point.date,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>📚 Industrial Standard:</strong> Department efficiency =
          Average of all machines in department
          <span className="block mt-2">
            <strong>🔬 Physics:</strong> Production (Motors+Pumps) | Maintenance
            (Generators) | Warehouse (Conveyors+Mixers)
          </span>
        </p>
      </div>
      <div className="space-y-2">
        {/* Recharts Bar Chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                domain={yAxisDomain}
                tickFormatter={(value) => value.toFixed(1)}
                width={60}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {label}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {payload[0].value?.toFixed(1)}
                          {unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                fill={colorConfig[color as keyof typeof colorConfig].stroke}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {avgValue.toFixed(1)}
              {unit}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Min</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {minValue.toFixed(1)}
              {unit}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Max</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {maxValue.toFixed(1)}
              {unit}
            </p>
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>📚 Industrial Standard:</strong> {getTrendNote(title)}
            <span className="block mt-1">
              <strong>🔬 Physics:</strong> Based on daily aggregated data from
              C++ physics engine calculations
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
