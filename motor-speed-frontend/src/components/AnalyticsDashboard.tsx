import React, { useState, useEffect } from "react";
import type { PredictiveAnalysis, OEEAnalysis } from "../types/types";
import { API_BASE_URL } from "../services/api";
import axios from "axios";

interface AnalyticsDashboardProps {
  machineId?: string;
}

export default function AnalyticsDashboard({
  machineId = "MOTOR-001",
}: AnalyticsDashboardProps) {
  const [predictiveAnalysis, setPredictiveAnalysis] =
    useState<PredictiveAnalysis | null>(null);
  const [oeeAnalysis, setOeeAnalysis] = useState<OEEAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadAnalytics();
  }, [machineId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [predictiveResponse, oeeResponse] = await Promise.all([
        axios.get<PredictiveAnalysis>(
          `${API_BASE_URL}/api/predictive/analysis/${machineId}`
        ),
        axios.get<OEEAnalysis>(
          `${API_BASE_URL}/api/predictive/oee/${machineId}`
        ),
      ]);

      setPredictiveAnalysis(predictiveResponse.data);
      setOeeAnalysis(oeeResponse.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-600";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
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
            Advanced Analytics Dashboard
          </h2>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex space-x-1">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "predictions", label: "Predictions", icon: "🔮" },
            { id: "trends", label: "Trends", icon: "📈" },
            { id: "anomalies", label: "Anomalies", icon: "⚠️" },
            { id: "oee", label: "OEE Analysis", icon: "⚡" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
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
        {activeTab === "overview" && predictiveAnalysis && (
          <div className="space-y-6">
            {/* Health Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Overall Health Score</div>
                <div
                  className={`text-4xl font-bold ${getHealthColor(
                    predictiveAnalysis.overallHealthScore
                  )}`}
                >
                  {predictiveAnalysis.overallHealthScore.toFixed(1)}%
                </div>
                <div className="text-sm opacity-90 mt-2">
                  {predictiveAnalysis.analysisTimestamp &&
                    new Date(
                      predictiveAnalysis.analysisTimestamp
                    ).toLocaleString()}
                </div>
                <div className="text-xs opacity-75 mt-2 border-t border-blue-400 pt-2">
                  📊 Based on temperature, vibration, efficiency, bearing
                  health, and system metrics. 90%+ is excellent, 70-89% is good,
                  &lt;70% needs attention.
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Risk Level</div>
                <div className="text-4xl font-bold">
                  {predictiveAnalysis.riskLevel}
                </div>
                <div className="text-sm opacity-90 mt-2">
                  {predictiveAnalysis.predictions.length} Active Predictions
                </div>
                <div className="text-xs opacity-75 mt-2 border-t border-purple-400 pt-2">
                  ⚠️ Risk assessment based on health score and critical
                  readings. Critical = &lt;40% health or &gt;5 critical
                  readings. Low = &gt;80% health.
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">Anomalies Detected</div>
                <div className="text-4xl font-bold">
                  {predictiveAnalysis.anomalyDetection.length}
                </div>
                <div className="text-sm opacity-90 mt-2">Last 24 Hours</div>
                <div className="text-xs opacity-75 mt-2 border-t border-green-400 pt-2">
                  🔍 Statistical analysis detects unusual patterns in sensor
                  data. Anomalies are readings that fall outside normal ranges
                  (mean ± 2 standard deviations).
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                💡 Recommendations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Actionable insights generated based on current motor
                performance, detected anomalies, and predictive analysis.
              </p>
              <div className="space-y-2">
                {predictiveAnalysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg"
                  >
                    <span className="text-lg">•</span>
                    <span className="text-gray-700 dark:text-gray-200">
                      {rec}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "predictions" && predictiveAnalysis && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              🔮 Maintenance Predictions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              AI-powered predictions based on sensor trends and anomaly
              patterns. Predictions appear when specific conditions are
              detected.
            </p>
            {predictiveAnalysis.predictions.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="text-center py-4">
                  <div className="text-4xl mb-4">🔮</div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    No Active Predictions
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Currently no maintenance predictions are active. This is
                    good news - it means your motor is operating within normal
                    parameters!
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-left">
                    <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      💡 Predictions are generated when:
                    </h5>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Temperature trend rises above 0.5°C/hour</li>
                      <li>• Vibration trend increases above 0.1 mm/s/hour</li>
                      <li>• Efficiency declines below -0.1% per hour</li>
                      <li>• Critical sensor readings exceed thresholds</li>
                      <li>• Multiple anomalies are detected in sequence</li>
                    </ul>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
                      Keep generating readings to build data patterns.
                      Predictions will appear when concerning trends are
                      detected.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {predictiveAnalysis.predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getSeverityColor(
                      prediction.severity
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{prediction.component}</h4>
                      <span className="text-sm font-medium">
                        {prediction.confidence.toFixed(0)}% Confidence
                      </span>
                    </div>
                    <p className="text-sm mb-2">{prediction.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Issue: {prediction.issue}</span>
                      <span>
                        Predicted:{" "}
                        {new Date(
                          prediction.predictedFailureTime
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "trends" && predictiveAnalysis && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              📈 Trend Analysis (
              {predictiveAnalysis.trendAnalysis.analysisPeriod})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Temperature Trend
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Rate of change in temperature over the last 24 hours. Positive
                  values indicate heating, negative values indicate cooling.
                </p>
                <div
                  className={`text-2xl font-bold ${
                    predictiveAnalysis.trendAnalysis.temperatureTrend > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {predictiveAnalysis.trendAnalysis.temperatureTrend > 0
                    ? "↗"
                    : "↘"}{" "}
                  {Math.abs(
                    predictiveAnalysis.trendAnalysis.temperatureTrend
                  ).toFixed(2)}
                  °C/h
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Vibration Trend
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Rate of change in vibration over the last 24 hours. Increasing
                  vibration often indicates wear or imbalance.
                </p>
                <div
                  className={`text-2xl font-bold ${
                    predictiveAnalysis.trendAnalysis.vibrationTrend > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {predictiveAnalysis.trendAnalysis.vibrationTrend > 0
                    ? "↗"
                    : "↘"}{" "}
                  {Math.abs(
                    predictiveAnalysis.trendAnalysis.vibrationTrend
                  ).toFixed(3)}
                  mm/s/h
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Efficiency Trend
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Rate of change in efficiency over the last 24 hours. Declining
                  efficiency can indicate increased energy consumption or wear.
                </p>
                <div
                  className={`text-2xl font-bold ${
                    predictiveAnalysis.trendAnalysis.efficiencyTrend > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {predictiveAnalysis.trendAnalysis.efficiencyTrend > 0
                    ? "↗"
                    : "↘"}{" "}
                  {Math.abs(
                    predictiveAnalysis.trendAnalysis.efficiencyTrend
                  ).toFixed(2)}
                  %/h
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Power Trend
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Rate of change in power consumption over the last 24 hours.
                  Increasing power trend can indicate inefficiency or increased
                  load.
                </p>
                <div
                  className={`text-2xl font-bold ${
                    predictiveAnalysis.trendAnalysis.powerTrend > 0
                      ? "text-orange-600"
                      : "text-blue-600"
                  }`}
                >
                  {predictiveAnalysis.trendAnalysis.powerTrend > 0 ? "↗" : "↘"}{" "}
                  {Math.abs(
                    predictiveAnalysis.trendAnalysis.powerTrend
                  ).toFixed(2)}
                  kW/h
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "anomalies" && predictiveAnalysis && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              ⚠️ Anomaly Detection
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Statistical analysis detects unusual patterns in sensor data.
              Anomalies are readings that fall outside normal ranges (mean ± 2
              standard deviations).
            </p>
            {predictiveAnalysis.anomalyDetection.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">✅</div>
                <h4 className="text-lg font-semibold mb-2">
                  No Anomalies Detected
                </h4>
                <p>
                  No anomalies detected in the last 24 hours. Your motor is
                  operating smoothly!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {predictiveAnalysis.anomalyDetection.map((anomaly, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      anomaly.severity === "High"
                        ? "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700"
                        : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {anomaly.sensorType}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          anomaly.severity === "High"
                            ? "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                        }`}
                      >
                        {anomaly.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-3 text-gray-700 dark:text-gray-200">
                      {anomaly.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-white dark:bg-gray-600 px-3 py-2 rounded border">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Detected Value
                        </div>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {anomaly.value}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-600 px-3 py-2 rounded border">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Expected Range
                        </div>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {anomaly.expectedRange}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-600 px-3 py-2 rounded border">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Detected At
                        </div>
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {new Date(anomaly.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900 rounded text-xs text-blue-700 dark:text-blue-300">
                      <strong>💡 What this means:</strong> This sensor reading
                      deviated significantly from the normal operating range.
                      {anomaly.severity === "High"
                        ? " Immediate attention may be required."
                        : " Monitor closely for patterns."}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "oee" && oeeAnalysis && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              ⚡ Overall Equipment Effectiveness (OEE)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              OEE measures how effectively equipment is being utilized. It's
              calculated as Availability × Performance × Quality. World-class
              OEE is typically 85% or higher.
            </p>

            {/* OEE Score */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg">
              <div className="text-sm opacity-90">Overall OEE Score</div>
              <div className="text-4xl font-bold">
                {oeeAnalysis.overallOEE.toFixed(1)}%
              </div>
              <div className="text-sm opacity-90 mt-2">
                Analysis Period: {oeeAnalysis.analysisPeriod}
              </div>
              <div className="text-xs opacity-75 mt-2 border-t border-indigo-400 pt-2">
                📊 Calculated from: Availability (
                {oeeAnalysis.availability.toFixed(1)}%) × Performance (
                {oeeAnalysis.performance.toFixed(1)}%) × Quality (
                {oeeAnalysis.quality.toFixed(1)}%)
                {oeeAnalysis.overallOEE >= 85
                  ? " - Excellent performance!"
                  : oeeAnalysis.overallOEE >= 70
                  ? " - Good performance"
                  : oeeAnalysis.overallOEE >= 50
                  ? " - Average performance"
                  : " - Needs improvement"}
              </div>
            </div>

            {/* OEE Components */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  📈 Availability
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {oeeAnalysis.availability.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  Uptime / Planned Production Time
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 p-2 rounded">
                  💡 Measures equipment uptime vs planned operation time. Based
                  on readings with non-critical status vs total readings in the
                  last 7 days.
                  {oeeAnalysis.availability >= 90
                    ? " Excellent uptime!"
                    : oeeAnalysis.availability >= 80
                    ? " Good uptime"
                    : " Consider reducing downtime"}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  ⚡ Performance
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {oeeAnalysis.performance.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  Actual Speed / Ideal Speed
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 p-2 rounded">
                  💡 Compares average motor speed vs ideal speed (2500 RPM).
                  Higher values indicate better performance.
                  {oeeAnalysis.performance >= 95
                    ? " Outstanding performance!"
                    : oeeAnalysis.performance >= 85
                    ? " Good performance"
                    : " Consider optimizing speed settings"}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  ✅ Quality
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {oeeAnalysis.quality.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  Good Readings / Total Readings
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 p-2 rounded">
                  💡 Percentage of readings with normal status and efficiency
                  &gt;85%. Measures output quality.
                  {oeeAnalysis.quality >= 95
                    ? " Excellent quality!"
                    : oeeAnalysis.quality >= 85
                    ? " Good quality"
                    : " Review process parameters"}
                </div>
              </div>
            </div>

            {/* OEE Recommendations */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                💡 OEE Improvement Recommendations
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                AI-generated recommendations based on current OEE performance
                across all three factors (Availability, Performance, Quality).
              </p>
              <div className="space-y-2">
                {oeeAnalysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                  >
                    <span className="text-lg">•</span>
                    <span className="text-gray-700 dark:text-gray-200">
                      {rec}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>📊 How OEE is calculated:</strong> OEE = (Availability
                  × Performance × Quality) ÷ 10000
                  <br />
                  <strong>🎯 Target benchmarks:</strong> World-class = 85%+,
                  Excellent = 70-84%, Good = 50-69%, Needs improvement = &lt;50%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
