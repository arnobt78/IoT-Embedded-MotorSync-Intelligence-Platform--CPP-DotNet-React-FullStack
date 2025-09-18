import React, { useState, useEffect } from "react";
import type { MotorReading } from "../types/types";

interface IoTCloudIntegrationProps {
  reading: MotorReading | null;
}

export default function IoTCloudIntegration({ reading }: IoTCloudIntegrationProps) {
  const [activeTab, setActiveTab] = useState("cloud");
  const [cloudMetrics, setCloudMetrics] = useState({
    dataUploaded: 0,
    cloudStorage: 0,
    apiCalls: 0,
    syncStatus: "Connected",
    lastSync: new Date().toISOString(),
  });
  const [mlInsights, setMlInsights] = useState({
    predictionAccuracy: 0,
    anomalyScore: 0,
    trendAnalysis: "Stable",
    recommendations: [] as string[],
  });
  const [edgeComputing, setEdgeComputing] = useState({
    processingLatency: 0,
    localStorage: 0,
    edgeDevices: 0,
    offlineCapability: true,
  });

  useEffect(() => {
    if (reading) {
      // Simulate cloud metrics
      setCloudMetrics({
        dataUploaded: Math.floor((reading.speed || 0) * 0.1),
        cloudStorage: Math.floor((reading.temperature || 0) * 2),
        apiCalls: Math.floor((reading.efficiency || 0) * 0.5),
        syncStatus: reading.status === "normal" ? "Connected" : "Syncing",
        lastSync: new Date().toISOString(),
      });

      // Simulate ML insights
      const accuracy = Math.min(100, (reading.efficiency || 0) * 1.1);
      const anomalyScore = Math.min(100, (reading.vibration || 0) * 20);
      const trendAnalysis = reading.efficiency && reading.efficiency > 85 ? "Improving" : 
                           reading.efficiency && reading.efficiency < 70 ? "Declining" : "Stable";
      
      const recommendations = [];
      if (accuracy < 80) recommendations.push("🔮 Improve ML model training data");
      if (anomalyScore > 70) recommendations.push("⚠️ High anomaly detected - investigate");
      if (trendAnalysis === "Declining") recommendations.push("📉 Performance trend declining");
      if (reading.systemHealth && reading.systemHealth < 80) recommendations.push("🔧 System health needs attention");

      setMlInsights({
        predictionAccuracy: accuracy,
        anomalyScore: anomalyScore,
        trendAnalysis: trendAnalysis,
        recommendations: recommendations,
      });

      // Simulate edge computing metrics
      setEdgeComputing({
        processingLatency: Math.max(1, Math.floor((reading.vibration || 0) * 5)),
        localStorage: Math.floor((reading.operatingHours || 0) * 0.1),
        edgeDevices: Math.floor((reading.speed || 0) / 200),
        offlineCapability: reading.status !== "critical",
      });
    }
  }, [reading]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "connected":
        return "text-green-600";
      case "syncing":
        return "text-yellow-600";
      case "disconnected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      case "stable":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ☁️ Advanced IoT & Cloud Integration
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Next-generation IoT platform
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex space-x-1 overflow-x-auto">
          {[
            { id: "cloud", label: "Cloud Integration", icon: "☁️" },
            { id: "ml", label: "Machine Learning", icon: "🤖" },
            { id: "edge", label: "Edge Computing", icon: "⚡" },
            { id: "security", label: "IoT Security", icon: "🔒" },
            { id: "analytics", label: "Big Data Analytics", icon: "📊" },
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
        {activeTab === "cloud" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              ☁️ Cloud Integration & Data Management
            </h3>

            {/* Cloud Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Data Uploaded</div>
                <div className="text-2xl font-bold">{cloudMetrics.dataUploaded} MB</div>
                <div className="text-xs opacity-90">Last Hour</div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Cloud Storage</div>
                <div className="text-2xl font-bold">{cloudMetrics.cloudStorage} GB</div>
                <div className="text-xs opacity-90">Total Used</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">API Calls</div>
                <div className="text-2xl font-bold">{cloudMetrics.apiCalls}</div>
                <div className="text-xs opacity-90">Per Minute</div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Sync Status</div>
                <div className={`text-2xl font-bold ${getStatusColor(cloudMetrics.syncStatus)}`}>
                  {cloudMetrics.syncStatus === "Connected" ? "🟢" : "🟡"}
                </div>
                <div className="text-xs opacity-90">Real-time</div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Last Sync</div>
                <div className="text-lg font-bold">
                  {new Date(cloudMetrics.lastSync).toLocaleTimeString()}
                </div>
                <div className="text-xs opacity-90">UTC</div>
              </div>
            </div>

            {/* Cloud Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🌐 Cloud Services
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">AWS IoT Core</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Azure IoT Hub</span>
                    <span className="font-medium text-green-600">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Google Cloud IoT</span>
                    <span className="font-medium text-green-600">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Data Pipeline</span>
                    <span className="font-medium text-green-600">Processing</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  📊 Data Analytics
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Real-time Processing</span>
                    <span className="font-medium text-green-600">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Batch Processing</span>
                    <span className="font-medium text-green-600">Scheduled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Data Warehouse</span>
                    <span className="font-medium text-green-600">Synced</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Backup Status</span>
                    <span className="font-medium text-green-600">Current</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ml" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              🤖 Machine Learning & AI Insights
            </h3>

            {/* ML Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Prediction Accuracy</div>
                <div className="text-2xl font-bold">{mlInsights.predictionAccuracy.toFixed(0)}%</div>
                <div className="text-xs opacity-90">ML Model</div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Anomaly Score</div>
                <div className="text-2xl font-bold">{mlInsights.anomalyScore.toFixed(0)}%</div>
                <div className="text-xs opacity-90">Risk Level</div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Trend Analysis</div>
                <div className={`text-2xl font-bold ${getTrendColor(mlInsights.trendAnalysis)}`}>
                  {mlInsights.trendAnalysis}
                </div>
                <div className="text-xs opacity-90">Performance</div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Model Updates</div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-xs opacity-90">This Week</div>
              </div>
            </div>

            {/* ML Models */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🧠 Active ML Models
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Predictive Maintenance</span>
                    <span className="font-medium text-green-600">95.2% Accuracy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Anomaly Detection</span>
                    <span className="font-medium text-green-600">92.8% Accuracy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Energy Optimization</span>
                    <span className="font-medium text-green-600">89.5% Accuracy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Quality Prediction</span>
                    <span className="font-medium text-green-600">91.3% Accuracy</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🔮 AI Recommendations
                </h4>
                <div className="space-y-2">
                  {mlInsights.recommendations.length > 0 ? (
                    mlInsights.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg"
                      >
                        <span className="text-lg">•</span>
                        <span className="text-gray-700 dark:text-gray-200">{rec}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      All systems operating optimally
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "edge" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              ⚡ Edge Computing & Local Processing
            </h3>

            {/* Edge Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Processing Latency</div>
                <div className="text-2xl font-bold">{edgeComputing.processingLatency}ms</div>
                <div className="text-xs opacity-90">Local Processing</div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Local Storage</div>
                <div className="text-2xl font-bold">{edgeComputing.localStorage} GB</div>
                <div className="text-xs opacity-90">Edge Cache</div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Edge Devices</div>
                <div className="text-2xl font-bold">{edgeComputing.edgeDevices}</div>
                <div className="text-xs opacity-90">Connected</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Offline Mode</div>
                <div className="text-2xl font-bold">
                  {edgeComputing.offlineCapability ? "✅" : "❌"}
                </div>
                <div className="text-xs opacity-90">Capability</div>
              </div>
            </div>

            {/* Edge Computing Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🔧 Edge Processing
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Data Filtering</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Local Analytics</span>
                    <span className="font-medium text-green-600">Running</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Real-time Alerts</span>
                    <span className="font-medium text-green-600">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Data Compression</span>
                    <span className="font-medium text-green-600">85% Reduction</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🌐 Network Optimization
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Bandwidth Usage</span>
                    <span className="font-medium">{(reading?.powerConsumption || 0).toFixed(1)} Mbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Connection Quality</span>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Packet Loss</span>
                    <span className="font-medium text-green-600">0.01%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Latency</span>
                    <span className="font-medium">{edgeComputing.processingLatency}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              🔒 IoT Security & Compliance
            </h3>

            {/* Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Security Score</div>
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs opacity-90">Overall Rating</div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Encryption</div>
                <div className="text-2xl font-bold">AES-256</div>
                <div className="text-xs opacity-90">Data Protection</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Threats Blocked</div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-xs opacity-90">Last 24h</div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Compliance</div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs opacity-90">GDPR/ISO</div>
              </div>
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🛡️ Security Measures
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Device Authentication</span>
                    <span className="font-medium text-green-600">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Data Encryption</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Access Control</span>
                    <span className="font-medium text-green-600">RBAC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Audit Logging</span>
                    <span className="font-medium text-green-600">Complete</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🔍 Monitoring & Alerts
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Intrusion Detection</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Anomaly Detection</span>
                    <span className="font-medium text-green-600">ML-Powered</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Threat Intelligence</span>
                    <span className="font-medium text-green-600">Updated</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Incident Response</span>
                    <span className="font-medium text-green-600">Automated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              📊 Big Data Analytics & Insights
            </h3>

            {/* Analytics Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Data Points</div>
                <div className="text-2xl font-bold">2.4M</div>
                <div className="text-xs opacity-90">Processed Today</div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Processing Speed</div>
                <div className="text-2xl font-bold">1.2TB/h</div>
                <div className="text-xs opacity-90">Throughput</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Insights Generated</div>
                <div className="text-2xl font-bold">847</div>
                <div className="text-xs opacity-90">This Week</div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-sm opacity-90">Data Quality</div>
                <div className="text-2xl font-bold">99.7%</div>
                <div className="text-xs opacity-90">Accuracy</div>
              </div>
            </div>

            {/* Analytics Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  📈 Analytics Pipeline
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Data Ingestion</span>
                    <span className="font-medium text-green-600">Real-time</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Data Processing</span>
                    <span className="font-medium text-green-600">Streaming</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Data Storage</span>
                    <span className="font-medium text-green-600">Distributed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Visualization</span>
                    <span className="font-medium text-green-600">Interactive</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🎯 Business Intelligence
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Predictive Models</span>
                    <span className="font-medium text-green-600">12 Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Dashboard Updates</span>
                    <span className="font-medium text-green-600">Live</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Report Generation</span>
                    <span className="font-medium text-green-600">Automated</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Alert System</span>
                    <span className="font-medium text-green-600">ML-Powered</span>
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
