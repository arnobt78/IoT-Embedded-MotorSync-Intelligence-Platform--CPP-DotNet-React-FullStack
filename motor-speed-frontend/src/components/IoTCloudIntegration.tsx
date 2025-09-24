import React, { useState, useEffect } from "react";
import type { MotorReading } from "../types/types";

interface IoTCloudIntegrationProps {
  reading: MotorReading | null;
}

export default function IoTCloudIntegration({
  reading,
}: IoTCloudIntegrationProps) {
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
  const [securityMetrics, setSecurityMetrics] = useState({
    securityScore: 98,
    encryptionLevel: "AES-256",
    threatsBlocked: 1247,
    complianceScore: 100,
  });
  const [analyticsMetrics, setAnalyticsMetrics] = useState({
    dataPoints: 2400000,
    processingSpeed: 1.2,
    insightsGenerated: 847,
    dataQuality: 99.7,
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
      const trendAnalysis =
        reading.efficiency && reading.efficiency > 85
          ? "Improving"
          : reading.efficiency && reading.efficiency < 70
          ? "Declining"
          : "Stable";

      const recommendations = [];
      if (accuracy < 80)
        recommendations.push("🔮 Improve ML model training data");
      if (anomalyScore > 70)
        recommendations.push("⚠️ High anomaly detected - investigate");
      if (trendAnalysis === "Declining")
        recommendations.push("📉 Performance trend declining");
      if (reading.systemHealth && reading.systemHealth < 80)
        recommendations.push("🔧 System health needs attention");

      setMlInsights({
        predictionAccuracy: accuracy,
        anomalyScore: anomalyScore,
        trendAnalysis: trendAnalysis,
        recommendations: recommendations,
      });

      // Simulate edge computing metrics
      setEdgeComputing({
        processingLatency: Math.max(
          1,
          Math.floor((reading.vibration || 0) * 5)
        ),
        localStorage: Math.floor((reading.operatingHours || 0) * 0.1),
        edgeDevices: Math.floor((reading.speed || 0) / 200),
        offlineCapability: reading.status !== "critical",
      });

      // Simulate security metrics
      const baseSecurityScore = 95; // Base security score
      const efficiencyBonus = Math.min(5, (reading.efficiency || 0) * 0.05); // Up to 5% bonus for high efficiency
      const temperaturePenalty =
        reading.temperature && reading.temperature > 80 ? -2 : 0; // Penalty for high temp
      const vibrationPenalty =
        reading.vibration && reading.vibration > 5 ? -1 : 0; // Penalty for high vibration
      const statusBonus = reading.status === "normal" ? 2 : 0; // Bonus for normal status

      const calculatedSecurityScore = Math.max(
        85,
        Math.min(
          100,
          baseSecurityScore +
            efficiencyBonus +
            temperaturePenalty +
            vibrationPenalty +
            statusBonus
        )
      );

      // Dynamic threats blocked based on motor activity
      const baseThreats = 1200;
      const activityMultiplier = Math.floor((reading.speed || 0) / 100); // More speed = more threats
      const systemHealthFactor = reading.systemHealth
        ? Math.floor(reading.systemHealth / 20)
        : 0;

      const calculatedThreatsBlocked =
        baseThreats + activityMultiplier + systemHealthFactor;

      // Dynamic compliance based on motor health
      const compliancePenalty =
        reading.systemHealth && reading.systemHealth < 70 ? -5 : 0;
      const calculatedCompliance = Math.max(90, 100 + compliancePenalty);

      setSecurityMetrics({
        securityScore: Math.round(calculatedSecurityScore),
        encryptionLevel:
          reading.efficiency && reading.efficiency > 90 ? "AES-256" : "AES-128",
        threatsBlocked: calculatedThreatsBlocked,
        complianceScore: calculatedCompliance,
      });

      // Simulate analytics metrics
      const baseDataPoints = 2000000; // Base 2M data points
      const speedMultiplier = Math.floor((reading.speed || 0) * 1000); // Speed affects data volume
      const efficiencyMultiplier = Math.floor((reading.efficiency || 0) * 1000); // Efficiency affects data quality
      const temperatureMultiplier = Math.floor(
        (reading.temperature || 0) * 500
      ); // Temperature affects sensor readings

      const calculatedDataPoints =
        baseDataPoints +
        speedMultiplier +
        efficiencyMultiplier +
        temperatureMultiplier;

      // Dynamic processing speed based on motor performance
      const baseProcessingSpeed = 1.0; // Base 1.0 TB/h
      const speedBonus = (reading.speed || 0) * 0.01; // Speed increases processing
      const processingEfficiencyBonus = (reading.efficiency || 0) * 0.005; // Efficiency improves throughput
      const systemHealthBonus = reading.systemHealth
        ? (reading.systemHealth - 80) * 0.01
        : 0; // Health affects performance

      const calculatedProcessingSpeed = Math.max(
        0.5,
        Math.min(
          2.0,
          baseProcessingSpeed +
            speedBonus +
            processingEfficiencyBonus +
            systemHealthBonus
        )
      );

      // Dynamic insights based on motor complexity and performance
      const baseInsights = 800;
      const vibrationInsights = Math.floor((reading.vibration || 0) * 10); // Vibration patterns generate insights
      const operatingHoursInsights = Math.floor(
        (reading.operatingHours || 0) * 2
      ); // Operating hours create patterns
      const statusInsights =
        reading.status === "normal"
          ? 50
          : reading.status === "warning"
          ? 100
          : 150; // Status changes generate insights

      const calculatedInsights =
        baseInsights +
        vibrationInsights +
        operatingHoursInsights +
        statusInsights;

      // Dynamic data quality based on motor health and performance
      const baseDataQuality = 99.5;
      const efficiencyQualityBonus = (reading.efficiency || 0) * 0.002; // Higher efficiency = better data quality
      const temperatureQualityPenalty =
        reading.temperature && reading.temperature > 85 ? -0.5 : 0; // High temp affects sensors
      const vibrationQualityPenalty =
        reading.vibration && reading.vibration > 6 ? -0.3 : 0; // High vibration affects accuracy
      const systemHealthQualityBonus = reading.systemHealth
        ? (reading.systemHealth - 90) * 0.01
        : 0; // Health affects quality

      const calculatedDataQuality = Math.max(
        95.0,
        Math.min(
          99.9,
          baseDataQuality +
            efficiencyQualityBonus +
            systemHealthQualityBonus +
            temperatureQualityPenalty +
            vibrationQualityPenalty
        )
      );

      setAnalyticsMetrics({
        dataPoints: calculatedDataPoints,
        processingSpeed: Math.round(calculatedProcessingSpeed * 10) / 10, // Round to 1 decimal
        insightsGenerated: calculatedInsights,
        dataQuality: Math.round(calculatedDataQuality * 10) / 10, // Round to 1 decimal
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

            {/* Educational Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                  ℹ️
                </div>
                <div>
                  <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                    ☁️ Cloud Integration & Data Management
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                    This dashboard transforms your motor sensor data into
                    comprehensive cloud integration metrics. Real motor readings
                    are intelligently converted to show how your industrial
                    motor's performance translates to cloud data management,
                    storage usage, and API activity.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Data Upload:</strong> Motor speed correlates to
                      data upload volume
                    </div>
                    <div>
                      • <strong>Storage Management:</strong> Motor temperature
                      affects cloud storage usage
                    </div>
                    <div>
                      • <strong>API Activity:</strong> Motor efficiency
                      determines API call frequency
                    </div>
                    <div>
                      • <strong>Sync Status:</strong> Motor status directly
                      affects cloud synchronization
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Data Uploaded</div>
                <div className="text-2xl font-bold">
                  {cloudMetrics.dataUploaded} MB
                </div>
                <div className="text-xs opacity-90">Last Hour</div>
                <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Speed × 0.1 = Data Uploaded
                  (MB)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher motor speed = more data generated and uploaded
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Cloud Storage</div>
                <div className="text-2xl font-bold">
                  {cloudMetrics.cloudStorage} GB
                </div>
                <div className="text-xs opacity-90">Total Used</div>
                <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Temperature × 2 = Cloud
                  Storage (GB)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher temperature = more data stored for analysis
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">API Calls</div>
                <div className="text-2xl font-bold">
                  {cloudMetrics.apiCalls}
                </div>
                <div className="text-xs opacity-90">Per Minute</div>
                <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Efficiency × 0.5 = API
                  Calls (per minute)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher efficiency = more API interactions for optimization
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Sync Status</div>
                <div
                  className={`text-2xl font-bold ${getStatusColor(
                    cloudMetrics.syncStatus
                  )}`}
                >
                  {cloudMetrics.syncStatus === "Connected" ? "🟢" : "🟡"}
                </div>
                <div className="text-xs opacity-90">Real-time</div>
                <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Status = "normal" →
                  "Connected", other → "Syncing"
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Motor status directly affects cloud synchronization state
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Last Sync</div>
                <div className="text-lg font-bold">
                  {new Date(cloudMetrics.lastSync).toLocaleTimeString()}
                </div>
                <div className="text-xs opacity-90">UTC</div>
                <div className="text-xs opacity-60 mt-2 border-t border-indigo-400 pt-2">
                  💡 <strong>Dynamic:</strong> Current timestamp updated in
                  real-time
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Shows exact time of last successful data synchronization
                </div>
              </div>
            </div>

            {/* Cloud Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🌐 Cloud Services
                </h4>
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                    💡 How Cloud Services Work
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    These represent the major cloud platforms integrated with
                    your IoT system. Status indicators show the operational
                    state of each service for data processing and device
                    management.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      AWS IoT Core
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal"
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 80
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 5
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal"
                        ? "Active"
                        : (reading?.temperature || 0) > 80
                        ? "Overheating"
                        : (reading?.vibration || 0) > 5
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal =
                    Active, high temp = Overheating, high vibration = High
                    Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = Normal ? "Active" :
                    Temp {">"} 80°C ? "Overheating" : Vibration {">"} 5mm/s ?
                    "High Vibration" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Azure IoT Hub
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 80
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 85
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 4
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 80
                        ? "Connected"
                        : (reading?.temperature || 0) > 85
                        ? "Overheating"
                        : (reading?.vibration || 0) > 4
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal + high
                    efficiency = Connected, high temp = Overheating, high
                    vibration = High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Efficiency{" "}
                    {">"} 80%) ? "Connected" : Temp {">"} 85°C ? "Overheating" :
                    Vibration {">"} 4mm/s ? "High Vibration" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Google Cloud IoT
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.systemHealth || 0) > 85
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 90
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 6
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.systemHealth || 0) > 85
                        ? "Online"
                        : (reading?.temperature || 0) > 90
                        ? "Overheating"
                        : (reading?.vibration || 0) > 6
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal + high
                    health = Online, high temp = Overheating, high vibration =
                    High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Health{" "}
                    {">"} 85%) ? "Online" : Temp {">"} 90°C ? "Overheating" :
                    Vibration {">"} 6mm/s ? "High Vibration" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Data Pipeline
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.speed || 0) > 1000
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 95
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 7
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.speed || 0) > 1000
                        ? "Processing"
                        : (reading?.temperature || 0) > 95
                        ? "Overheating"
                        : (reading?.vibration || 0) > 7
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Dynamic status based on motor conditions: normal + high
                    speed = Processing, high temp = Overheating, high vibration
                    = High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Speed {">"}{" "}
                    1000RPM) ? "Processing" : Temp {">"} 95°C ? "Overheating" :
                    Vibration {">"} 7mm/s ? "High Vibration" : "Standby"
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  📊 Data Analytics
                </h4>
                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                    💡 How Data Analytics Work
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    These represent the data processing and analytics
                    capabilities of your cloud infrastructure. Status indicators
                    show the operational state of each analytics service for
                    motor data processing.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Real-time Processing
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 75
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 85
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 5
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 75
                        ? "Enabled"
                        : (reading?.temperature || 0) > 85
                        ? "Overheating"
                        : (reading?.vibration || 0) > 5
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal + high
                    efficiency = Enabled, high temp = Overheating, high
                    vibration = High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Efficiency{" "}
                    {">"} 75%) ? "Enabled" : Temp {">"} 85°C ? "Overheating" :
                    Vibration {">"} 5mm/s ? "High Vibration" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Batch Processing
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.operatingHours || 0) > 10
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 90
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 6
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.operatingHours || 0) > 10
                        ? "Scheduled"
                        : (reading?.temperature || 0) > 90
                        ? "Overheating"
                        : (reading?.vibration || 0) > 6
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal + high
                    operating hours = Scheduled, high temp = Overheating, high
                    vibration = High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Operating
                    Hours {">"} 10h) ? "Scheduled" : Temp {">"} 90°C ?
                    "Overheating" : Vibration {">"} 6mm/s ? "High Vibration" :
                    "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Data Warehouse
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.systemHealth || 0) > 80
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 95
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 8
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.systemHealth || 0) > 80
                        ? "Synced"
                        : (reading?.temperature || 0) > 95
                        ? "Overheating"
                        : (reading?.vibration || 0) > 8
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal + high
                    health = Synced, high temp = Overheating, high vibration =
                    High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Health{" "}
                    {">"} 80%) ? "Synced" : Temp {">"} 95°C ? "Overheating" :
                    Vibration {">"} 8mm/s ? "High Vibration" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Backup Status
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 70
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 100
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 10
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 70
                        ? "Current"
                        : (reading?.temperature || 0) > 100
                        ? "Overheating"
                        : (reading?.vibration || 0) > 10
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Dynamic status based on motor conditions: normal + high
                    efficiency = Current, high temp = Overheating, high
                    vibration = High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Efficiency{" "}
                    {">"} 70%) ? "Current" : Temp {">"} 100°C ? "Overheating" :
                    Vibration {">"} 10mm/s ? "High Vibration" : "Standby"
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
                    Real-time Cloud Integration Data Flow
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    can be intelligently applied to cloud integration and data
                    management systems. Every metric shown is calculated from
                    live motor readings.
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                    <div>
                      • <strong>Motor Sensors → Cloud:</strong> Speed,
                      temperature, efficiency, and status data
                    </div>
                    <div>
                      • <strong>Data Upload:</strong> Motor speed determines
                      data volume uploaded to cloud
                    </div>
                    <div>
                      • <strong>Storage Management:</strong> Motor temperature
                      affects cloud storage usage
                    </div>
                    <div>
                      • <strong>API Activity:</strong> Motor efficiency
                      determines cloud API call frequency
                    </div>
                    <div>
                      • <strong>Synchronization:</strong> Motor status directly
                      affects cloud sync status
                    </div>
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

            {/* Educational Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                  ℹ️
                </div>
                <div>
                  <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                    🤖 Machine Learning & AI Insights
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                    This dashboard demonstrates how motor sensor data is
                    processed through advanced machine learning algorithms to
                    provide predictive insights, anomaly detection, and
                    intelligent recommendations for industrial motor
                    optimization.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Prediction Accuracy:</strong> Motor efficiency
                      determines ML model performance
                    </div>
                    <div>
                      • <strong>Anomaly Detection:</strong> Motor vibration
                      indicates unusual patterns
                    </div>
                    <div>
                      • <strong>Trend Analysis:</strong> Efficiency patterns
                      show performance trajectory
                    </div>
                    <div>
                      • <strong>Smart Recommendations:</strong> AI generates
                      actionable insights based on motor data
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ML Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Prediction Accuracy</div>
                <div className="text-2xl font-bold">
                  {mlInsights.predictionAccuracy.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">ML Model</div>
                <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Efficiency × 1.1 =
                  Prediction Accuracy (max 100%)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher motor efficiency = more accurate ML predictions
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Anomaly Score</div>
                <div className="text-2xl font-bold">
                  {mlInsights.anomalyScore.toFixed(0)}%
                </div>
                <div className="text-xs opacity-90">Risk Level</div>
                <div className="text-xs opacity-60 mt-2 border-t border-red-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Vibration × 20 = Anomaly
                  Score (max 100%)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher vibration = higher anomaly risk requiring investigation
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Trend Analysis</div>
                <div
                  className={`text-2xl font-bold ${getTrendColor(
                    mlInsights.trendAnalysis
                  )}`}
                >
                  {mlInsights.trendAnalysis}
                </div>
                <div className="text-xs opacity-90">Performance</div>
                <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                  💡 <strong>Dynamic:</strong> Efficiency {">"} 85% =
                  "Improving", {"<"} 70% = "Declining", else "Stable"
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Efficiency thresholds determine performance trend direction
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Model Updates</div>
                <div className="text-2xl font-bold">
                  {Math.floor(
                    (reading?.operatingHours || 0) * 2 +
                      (reading?.efficiency || 0) * 0.1
                  )}
                </div>
                <div className="text-xs opacity-90">This Week</div>
                <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                  💡 <strong>Dynamic:</strong> Operating Hours × 2 + Efficiency
                  × 0.1 = Model Updates
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher operating hours and efficiency = more frequent model
                  retraining
                </div>
              </div>
            </div>

            {/* ML Models */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🧠 Active ML Models
                </h4>
                <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm text-purple-800 dark:text-purple-200 font-medium mb-1">
                    💡 How ML Models Work
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    These represent specialized machine learning models trained
                    on historical motor data. Each model focuses on different
                    aspects of industrial motor performance and optimization.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Predictive Maintenance
                    </span>
                    <span className="font-medium text-green-600">
                      {Math.min(
                        100,
                        Math.max(
                          85,
                          (reading?.systemHealth || 0) * 0.95 +
                            (reading?.efficiency || 0) * 0.05
                        )
                      ).toFixed(1)}
                      % Accuracy
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic accuracy based on motor system health and
                    efficiency
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> min(100, max(85, System Health
                    × 0.95 + Efficiency × 0.05)) = Predictive Maintenance
                    Accuracy (%)
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Anomaly Detection
                    </span>
                    <span className="font-medium text-green-600">
                      {Math.min(
                        100,
                        Math.max(
                          80,
                          100 -
                            (reading?.vibration || 0) * 2 +
                            (reading?.efficiency || 0) * 0.3
                        )
                      ).toFixed(1)}
                      % Accuracy
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic accuracy based on motor vibration and efficiency
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> min(100, max(80, 100 -
                    Vibration × 2 + Efficiency × 0.3)) = Anomaly Detection
                    Accuracy (%)
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Energy Optimization
                    </span>
                    <span className="font-medium text-green-600">
                      {Math.min(
                        100,
                        Math.max(
                          75,
                          (reading?.efficiency || 0) * 0.9 +
                            (reading?.powerConsumption || 0) * 0.1
                        )
                      ).toFixed(1)}
                      % Accuracy
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic accuracy based on motor efficiency and power
                    consumption
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> min(100, max(75, Efficiency ×
                    0.9 + Power Consumption × 0.1)) = Energy Optimization
                    Accuracy (%)
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Quality Prediction
                    </span>
                    <span className="font-medium text-green-600">
                      {Math.min(
                        100,
                        Math.max(
                          80,
                          (reading?.efficiency || 0) * 0.8 +
                            (reading?.systemHealth || 0) * 0.2 -
                            (reading?.vibration || 0) * 0.5
                        )
                      ).toFixed(1)}
                      % Accuracy
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Dynamic accuracy based on motor efficiency, system
                    health, and vibration
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> min(100, max(80, Efficiency ×
                    0.8 + System Health × 0.2 - Vibration × 0.5)) = Quality
                    Prediction Accuracy (%)
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🔮 AI Recommendations
                </h4>
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                    💡 How AI Recommendations Work
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    AI analyzes motor sensor data in real-time and generates
                    intelligent recommendations based on prediction accuracy,
                    anomaly scores, trend analysis, and system health
                    conditions.
                  </div>
                </div>
                <div className="space-y-2">
                  {mlInsights.recommendations.length > 0 ? (
                    mlInsights.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg"
                      >
                        <span className="text-lg">•</span>
                        <div className="flex-1">
                          <span className="text-gray-700 dark:text-gray-200">
                            {rec}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            💡 Dynamic recommendation based on current motor
                            sensor data analysis
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <div className="text-sm font-medium mb-2">
                        All systems operating optimally
                      </div>
                      <div className="text-xs">
                        💡 No recommendations needed - motor performance is
                        within normal parameters
                      </div>
                    </div>
                  )}
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
                    Real-time Machine Learning Data Flow
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    flows through machine learning algorithms to generate
                    predictive insights, detect anomalies, and provide
                    intelligent recommendations for motor optimization.
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                    <div>
                      • <strong>Motor Sensors → ML:</strong> Efficiency,
                      vibration, system health data
                    </div>
                    <div>
                      • <strong>Prediction Accuracy:</strong> Motor efficiency
                      determines ML model performance
                    </div>
                    <div>
                      • <strong>Anomaly Detection:</strong> Motor vibration
                      indicates unusual patterns
                    </div>
                    <div>
                      • <strong>Trend Analysis:</strong> Efficiency thresholds
                      determine performance trajectory
                    </div>
                    <div>
                      • <strong>Smart Recommendations:</strong> AI generates
                      actionable insights based on all sensor data
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edge Computing & Local Processing */}
        {activeTab === "edge" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              ⚡ Edge Computing & Local Processing
            </h3>

            {/* Educational Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                  ℹ️
                </div>
                <div>
                  <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                    ⚡ Edge Computing & Local Processing
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                    This dashboard demonstrates how motor sensor data is
                    processed at the edge of your network for real-time decision
                    making, reduced latency, and improved reliability. Edge
                    computing brings processing power closer to your industrial
                    motors for faster response times.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Processing Latency:</strong> Motor vibration
                      affects local processing speed
                    </div>
                    <div>
                      • <strong>Local Storage:</strong> Motor operating hours
                      determine edge cache capacity
                    </div>
                    <div>
                      • <strong>Edge Devices:</strong> Motor speed correlates to
                      connected edge device count
                    </div>
                    <div>
                      • <strong>Offline Capability:</strong> Motor status
                      determines edge device reliability
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edge Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Processing Latency</div>
                <div className="text-2xl font-bold">
                  {edgeComputing.processingLatency}ms
                </div>
                <div className="text-xs opacity-90">Local Processing</div>
                <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Vibration × 5 = Processing
                  Latency (min 1ms)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher vibration = increased processing time due to data
                  complexity
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Local Storage</div>
                <div className="text-2xl font-bold">
                  {edgeComputing.localStorage} GB
                </div>
                <div className="text-xs opacity-90">Edge Cache</div>
                <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Operating Hours × 0.1 =
                  Local Storage (GB)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  More operating hours = more data cached locally for faster
                  access
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Edge Devices</div>
                <div className="text-2xl font-bold">
                  {edgeComputing.edgeDevices}
                </div>
                <div className="text-xs opacity-90">Connected</div>
                <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Speed ÷ 200 = Connected
                  Edge Devices
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher motor speed = more edge devices needed for distributed
                  processing
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Offline Mode</div>
                <div className="text-2xl font-bold">
                  {edgeComputing.offlineCapability ? "✅" : "❌"}
                </div>
                <div className="text-xs opacity-90">Capability</div>
                <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Status ≠ "critical" =
                  Offline Capability
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Non-critical motor status enables offline edge processing
                  capability
                </div>
              </div>
            </div>

            {/* Edge Computing Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🔧 Edge Processing
                </h4>
                <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-sm text-orange-800 dark:text-orange-200 font-medium mb-1">
                    💡 How Edge Processing Works
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">
                    These represent the core edge computing capabilities that
                    process motor sensor data locally for faster response times
                    and reduced cloud dependency.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Data Filtering
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal"
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 80
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 5
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal"
                        ? "Active"
                        : (reading?.temperature || 0) > 80
                        ? "Overheating"
                        : (reading?.vibration || 0) > 5
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal =
                    Active, high temp = Overheating, high vibration = High
                    Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = Normal ? "Active" :
                    Temp {">"} 80°C ? "Overheating" : Vibration {">"} 5mm/s ?
                    "High Vibration" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Local Analytics
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 75
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 85
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 6
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 75
                        ? "Running"
                        : (reading?.temperature || 0) > 85
                        ? "Overheating"
                        : (reading?.vibration || 0) > 6
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal + high
                    efficiency = Running, high temp = Overheating, high
                    vibration = High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Efficiency{" "}
                    {">"} 75%) ? "Running" : Temp {">"} 85°C ? "Overheating" :
                    Vibration {">"} 6mm/s ? "High Vibration" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Real-time Alerts
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.systemHealth || 0) > 80
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 90
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 7
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.systemHealth || 0) > 80
                        ? "Enabled"
                        : (reading?.temperature || 0) > 90
                        ? "Overheating"
                        : (reading?.vibration || 0) > 7
                        ? "High Vibration"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal + high
                    health = Enabled, high temp = Overheating, high vibration =
                    High Vibration, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = (Normal && Health{" "}
                    {">"} 80%) ? "Enabled" : Temp {">"} 90°C ? "Overheating" :
                    Vibration {">"} 7mm/s ? "High Vibration" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Data Compression
                    </span>
                    <span className="font-medium text-green-600">
                      {Math.min(
                        95,
                        Math.max(
                          70,
                          (reading?.efficiency || 0) * 0.8 +
                            (reading?.systemHealth || 0) * 0.2
                        )
                      ).toFixed(0)}
                      % Reduction
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Dynamic compression based on motor efficiency and system
                    health
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> min(95, max(70, Efficiency ×
                    0.8 + System Health × 0.2)) = Data Compression (%)
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🌐 Network Optimization
                </h4>
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                    💡 How Network Optimization Works
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    These metrics show how your edge network performs under
                    different motor conditions, optimizing data transmission and
                    network efficiency for industrial IoT applications.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Bandwidth Usage
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {(reading?.powerConsumption || 0).toFixed(1)} Mbps
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic - Motor Power Consumption = Network Bandwidth
                    Usage (Mbps)
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Connection Quality
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 85
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 95
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 8
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 85
                        ? "Excellent"
                        : (reading?.temperature || 0) > 95
                        ? "Poor"
                        : (reading?.vibration || 0) > 8
                        ? "Fair"
                        : "Good"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic quality based on motor conditions: normal + high
                    efficiency = Excellent, high temp = Poor, high vibration =
                    Fair, else = Good
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Quality = (Normal && Efficiency{" "}
                    {">"} 85%) ? "Excellent" : Temp {">"} 95°C ? "Poor" :
                    Vibration {">"} 8mm/s ? "Fair" : "Good"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Packet Loss
                    </span>
                    <span className="font-medium text-green-600">
                      {Math.min(
                        5,
                        Math.max(
                          0.01,
                          (reading?.vibration || 0) * 0.1 +
                            (reading?.temperature || 0) * 0.01
                        )
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic packet loss based on motor vibration and
                    temperature
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> min(5, max(0.01, Vibration ×
                    0.1 + Temperature × 0.01)) = Packet Loss (%)
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Latency
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {edgeComputing.processingLatency}ms
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Dynamic - Same as Processing Latency (Motor Vibration ×
                    5)
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
                    Real-time Edge Computing Data Flow
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    is processed at the edge of your network for real-time
                    decision making, reduced latency, and improved reliability.
                    Edge computing brings intelligence closer to your motors for
                    faster response times.
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                    <div>
                      • <strong>Motor Sensors → Edge:</strong> Vibration,
                      operating hours, speed, status data
                    </div>
                    <div>
                      • <strong>Processing Latency:</strong> Motor vibration
                      affects local processing speed
                    </div>
                    <div>
                      • <strong>Local Storage:</strong> Motor operating hours
                      determine edge cache capacity
                    </div>
                    <div>
                      • <strong>Edge Devices:</strong> Motor speed correlates to
                      connected edge device count
                    </div>
                    <div>
                      • <strong>Network Optimization:</strong> Motor power
                      consumption affects bandwidth usage
                    </div>
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

            {/* Educational Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                  ℹ️
                </div>
                <div>
                  <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                    🔒 IoT Security & Compliance
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    is protected through advanced security measures, threat
                    detection, and compliance monitoring. IoT security ensures
                    your motor data remains secure while maintaining operational
                    efficiency and regulatory compliance.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Security Score:</strong> Motor efficiency and
                      health affect overall security rating
                    </div>
                    <div>
                      • <strong>Encryption Level:</strong> Motor efficiency
                      determines encryption strength
                    </div>
                    <div>
                      • <strong>Threats Blocked:</strong> Motor activity and
                      system health correlate to threat volume
                    </div>
                    <div>
                      • <strong>Compliance:</strong> Motor system health impacts
                      regulatory compliance scores
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Security Score</div>
                <div className="text-2xl font-bold">
                  {securityMetrics.securityScore}%
                </div>
                <div className="text-xs opacity-90">Overall Rating</div>
                <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                  💡 <strong>Dynamic:</strong> Base 95% + Efficiency Bonus +
                  Status Bonus - Temperature/Vibration Penalties
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher efficiency and normal status improve security rating
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Encryption</div>
                <div className="text-2xl font-bold">
                  {securityMetrics.encryptionLevel}
                </div>
                <div className="text-xs opacity-90">Data Protection</div>
                <div className="text-xs opacity-60 mt-2 border-t border-blue-400 pt-2">
                  💡 <strong>Dynamic:</strong> Motor Efficiency {" >"} 90% =
                  AES-256, else AES-128
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher motor efficiency enables stronger encryption protocols
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Threats Blocked</div>
                <div className="text-2xl font-bold">
                  {securityMetrics.threatsBlocked.toLocaleString()}
                </div>
                <div className="text-xs opacity-90">Last 24h</div>
                <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                  💡 <strong>Dynamic:</strong> Base 1200 + (Speed ÷ 100) +
                  (System Health ÷ 20)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher motor activity and system health increase threat
                  detection
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Compliance</div>
                <div className="text-2xl font-bold">
                  {securityMetrics.complianceScore}%
                </div>
                <div className="text-xs opacity-90">GDPR/ISO</div>
                <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                  💡 <strong>Dynamic:</strong> Base 100% - (System Health {" <"}{" "}
                  70% penalty)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Poor motor system health reduces compliance scores
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🛡️ Security Measures
                </h4>
                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                    💡 Core Security Protocols
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    These represent the fundamental security measures protecting
                    your industrial motor IoT infrastructure from unauthorized
                    access, data breaches, and cyber threats.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Device Authentication
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal"
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 85
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 6
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal"
                        ? "Enabled"
                        : (reading?.temperature || 0) > 85
                        ? "Disabled"
                        : (reading?.vibration || 0) > 6
                        ? "Degraded"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic status based on motor conditions: normal =
                    Enabled, high temp = Disabled, high vibration = Degraded,
                    else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Status = Normal ? "Enabled" :
                    Temp {">"} 85°C ? "Disabled" : Vibration {">"} 6mm/s ?
                    "Degraded" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Data Encryption
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 90
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 90
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 7
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 90
                        ? "AES-256"
                        : (reading?.temperature || 0) > 90
                        ? "Disabled"
                        : (reading?.vibration || 0) > 7
                        ? "AES-128"
                        : "AES-128"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic encryption level based on motor conditions:
                    normal + high efficiency = AES-256, high temp = Disabled,
                    high vibration = AES-128, else = AES-128
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Encryption = (Normal &&
                    Efficiency {">"} 90%) ? "AES-256" : Temp {">"} 90°C ?
                    "Disabled" : Vibration {">"} 7mm/s ? "AES-128" : "AES-128"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Access Control
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.systemHealth || 0) > 80
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 95
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 8
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.systemHealth || 0) > 80
                        ? "RBAC"
                        : (reading?.temperature || 0) > 95
                        ? "Locked"
                        : (reading?.vibration || 0) > 8
                        ? "Limited"
                        : "Basic"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic access control based on motor conditions: normal
                    + high health = RBAC, high temp = Locked, high vibration =
                    Limited, else = Basic
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Access = (Normal && Health{" "}
                    {">"} 80%) ? "RBAC" : Temp {">"} 95°C ? "Locked" : Vibration{" "}
                    {">"} 8mm/s ? "Limited" : "Basic"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Audit Logging
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 85
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 100
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 9
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 85
                        ? "Complete"
                        : (reading?.temperature || 0) > 100
                        ? "Failed"
                        : (reading?.vibration || 0) > 9
                        ? "Partial"
                        : "Basic"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Dynamic logging level based on motor conditions: normal +
                    high efficiency = Complete, high temp = Failed, high
                    vibration = Partial, else = Basic
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Logging = (Normal && Efficiency{" "}
                    {">"} 85%) ? "Complete" : Temp {">"} 100°C ? "Failed" :
                    Vibration {">"} 9mm/s ? "Partial" : "Basic"
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🔍 Monitoring & Alerts
                </h4>
                <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm text-purple-800 dark:text-purple-200 font-medium mb-1">
                    💡 Advanced Threat Detection
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    These systems continuously monitor your motor IoT network
                    for security threats, anomalies, and unauthorized access
                    attempts, providing real-time protection and automated
                    response.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Intrusion Detection
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 80
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 95
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 8
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 80
                        ? "Active"
                        : (reading?.temperature || 0) > 95
                        ? "Disabled"
                        : (reading?.vibration || 0) > 8
                        ? "Degraded"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic intrusion detection based on motor conditions:
                    normal + high efficiency = Active, high temp = Disabled,
                    high vibration = Degraded, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Detection = (Normal &&
                    Efficiency {">"} 80%) ? "Active" : Temp {">"} 95°C ?
                    "Disabled" : Vibration {">"} 8mm/s ? "Degraded" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Anomaly Detection
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.systemHealth || 0) > 85
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 100
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 9
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.systemHealth || 0) > 85
                        ? "ML-Powered"
                        : (reading?.temperature || 0) > 100
                        ? "Failed"
                        : (reading?.vibration || 0) > 9
                        ? "Basic"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic anomaly detection based on motor conditions:
                    normal + high health = ML-Powered, high temp = Failed, high
                    vibration = Basic, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Anomaly = (Normal && Health{" "}
                    {">"} 85%) ? "ML-Powered" : Temp {">"} 100°C ? "Failed" :
                    Vibration {">"} 9mm/s ? "Basic" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Threat Intelligence
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 75
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 105
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 10
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 75
                        ? "Updated"
                        : (reading?.temperature || 0) > 105
                        ? "Outdated"
                        : (reading?.vibration || 0) > 10
                        ? "Delayed"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic threat intelligence based on motor conditions:
                    normal + high efficiency = Updated, high temp = Outdated,
                    high vibration = Delayed, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Intelligence = (Normal &&
                    Efficiency {">"} 75%) ? "Updated" : Temp {">"} 105°C ?
                    "Outdated" : Vibration {">"} 10mm/s ? "Delayed" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Incident Response
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.systemHealth || 0) > 70
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 110
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 11
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.systemHealth || 0) > 70
                        ? "Automated"
                        : (reading?.temperature || 0) > 110
                        ? "Manual"
                        : (reading?.vibration || 0) > 11
                        ? "Delayed"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Dynamic incident response based on motor conditions:
                    normal + high health = Automated, high temp = Manual, high
                    vibration = Delayed, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Response = (Normal && Health{" "}
                    {">"} 70%) ? "Automated" : Temp {">"} 110°C ? "Manual" :
                    Vibration {">"} 11mm/s ? "Delayed" : "Standby"
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
                    Real-time IoT Security Data Flow
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    is protected through comprehensive security measures, threat
                    detection, and compliance monitoring. IoT security ensures
                    your motor data remains secure while maintaining operational
                    efficiency and regulatory compliance.
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                    <div>
                      • <strong>Motor Sensors → Security:</strong> Efficiency,
                      temperature, vibration, system health data
                    </div>
                    <div>
                      • <strong>Security Score:</strong> Motor performance
                      affects overall security rating
                    </div>
                    <div>
                      • <strong>Encryption Level:</strong> Motor efficiency
                      determines encryption strength
                    </div>
                    <div>
                      • <strong>Threat Detection:</strong> Motor activity
                      correlates to threat volume
                    </div>
                    <div>
                      • <strong>Compliance:</strong> Motor system health impacts
                      regulatory compliance
                    </div>
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

            {/* Educational Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                  ℹ️
                </div>
                <div>
                  <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                    📊 Big Data Analytics & Insights
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    is processed through advanced big data analytics to generate
                    actionable insights, predictive models, and business
                    intelligence. Analytics transforms raw motor data into
                    valuable operational insights for optimization and
                    decision-making.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Data Points:</strong> Motor speed, efficiency,
                      and temperature affect data volume
                    </div>
                    <div>
                      • <strong>Processing Speed:</strong> Motor performance
                      determines analytics throughput
                    </div>
                    <div>
                      • <strong>Insights Generated:</strong> Motor complexity
                      and status changes create analytics insights
                    </div>
                    <div>
                      • <strong>Data Quality:</strong> Motor health and
                      efficiency impact analytics accuracy
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Data Points</div>
                <div className="text-2xl font-bold">
                  {(analyticsMetrics.dataPoints / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs opacity-90">Processed Today</div>
                <div className="text-xs opacity-60 mt-2 border-t border-indigo-400 pt-2">
                  💡 <strong>Dynamic:</strong> Base 2M + (Speed × 1000) +
                  (Efficiency × 1000) + (Temperature × 500)
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Higher motor activity and performance increase data volume
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Processing Speed</div>
                <div className="text-2xl font-bold">
                  {analyticsMetrics.processingSpeed}TB/h
                </div>
                <div className="text-xs opacity-90">Throughput</div>
                <div className="text-xs opacity-60 mt-2 border-t border-green-400 pt-2">
                  💡 <strong>Dynamic:</strong> Base 1.0TB/h + Speed Bonus +
                  Efficiency Bonus + System Health Bonus
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Better motor performance increases analytics processing speed
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Insights Generated</div>
                <div className="text-2xl font-bold">
                  {analyticsMetrics.insightsGenerated}
                </div>
                <div className="text-xs opacity-90">This Week</div>
                <div className="text-xs opacity-60 mt-2 border-t border-purple-400 pt-2">
                  💡 <strong>Dynamic:</strong> Base 800 + (Vibration × 10) +
                  (Operating Hours × 2) + Status Insights
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Motor complexity and status changes generate more insights
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-sm opacity-90">Data Quality</div>
                <div className="text-2xl font-bold">
                  {analyticsMetrics.dataQuality}%
                </div>
                <div className="text-xs opacity-90">Accuracy</div>
                <div className="text-xs opacity-60 mt-2 border-t border-orange-400 pt-2">
                  💡 <strong>Dynamic:</strong> Base 99.5% + Efficiency Bonus +
                  Health Bonus - Temperature/Vibration Penalties
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Motor health and efficiency directly impact data quality
                </div>
              </div>
            </div>

            {/* Analytics Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  📈 Analytics Pipeline
                </h4>
                <div className="mb-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="text-sm text-indigo-800 dark:text-indigo-200 font-medium mb-1">
                    💡 Data Processing Pipeline
                  </div>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300">
                    These represent the core data processing stages that
                    transform raw motor sensor data into actionable insights and
                    business intelligence for operational optimization.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Data Ingestion
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal"
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 90
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 8
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal"
                        ? "Real-time"
                        : (reading?.temperature || 0) > 90
                        ? "Degraded"
                        : (reading?.vibration || 0) > 8
                        ? "Delayed"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic ingestion based on motor conditions: normal =
                    Real-time, high temp = Degraded, high vibration = Delayed,
                    else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Ingestion = Normal ?
                    "Real-time" : Temp {">"} 90°C ? "Degraded" : Vibration {">"}{" "}
                    8mm/s ? "Delayed" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Data Processing
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 80
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 95
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 9
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 80
                        ? "Streaming"
                        : (reading?.temperature || 0) > 95
                        ? "Failed"
                        : (reading?.vibration || 0) > 9
                        ? "Batch"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic processing based on motor conditions: normal +
                    high efficiency = Streaming, high temp = Failed, high
                    vibration = Batch, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Processing = (Normal &&
                    Efficiency {">"} 80%) ? "Streaming" : Temp {">"} 95°C ?
                    "Failed" : Vibration {">"} 9mm/s ? "Batch" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Data Storage
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.systemHealth || 0) > 85
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 100
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 10
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.systemHealth || 0) > 85
                        ? "Distributed"
                        : (reading?.temperature || 0) > 100
                        ? "Failed"
                        : (reading?.vibration || 0) > 10
                        ? "Limited"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic storage based on motor conditions: normal + high
                    health = Distributed, high temp = Failed, high vibration =
                    Limited, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Storage = (Normal && Health{" "}
                    {">"} 85%) ? "Distributed" : Temp {">"} 100°C ? "Failed" :
                    Vibration {">"} 10mm/s ? "Limited" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Visualization
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 75
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 105
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 11
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 75
                        ? "Interactive"
                        : (reading?.temperature || 0) > 105
                        ? "Failed"
                        : (reading?.vibration || 0) > 11
                        ? "Basic"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Dynamic visualization based on motor conditions: normal +
                    high efficiency = Interactive, high temp = Failed, high
                    vibration = Basic, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Visualization = (Normal &&
                    Efficiency {">"} 75%) ? "Interactive" : Temp {">"} 105°C ?
                    "Failed" : Vibration {">"} 11mm/s ? "Basic" : "Standby"
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">
                  🎯 Business Intelligence
                </h4>
                <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm text-purple-800 dark:text-purple-200 font-medium mb-1">
                    💡 Intelligence & Automation
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    These systems transform processed motor data into business
                    intelligence, predictive insights, and automated
                    decision-making tools for operational excellence and
                    strategic planning.
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Predictive Models
                    </span>
                    <span className="font-medium text-green-600">
                      {Math.floor(
                        10 +
                          (reading?.efficiency || 0) * 0.05 +
                          (reading?.systemHealth || 0) * 0.03
                      )}{" "}
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic model count based on motor efficiency and system
                    health
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> 10 + (Efficiency × 0.05) +
                    (System Health × 0.03) = Active Models
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Dashboard Updates
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 70
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 110
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 12
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 70
                        ? "Live"
                        : (reading?.temperature || 0) > 110
                        ? "Failed"
                        : (reading?.vibration || 0) > 12
                        ? "Delayed"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic updates based on motor conditions: normal + high
                    efficiency = Live, high temp = Failed, high vibration =
                    Delayed, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Updates = (Normal && Efficiency{" "}
                    {">"} 70%) ? "Live" : Temp {">"} 110°C ? "Failed" :
                    Vibration {">"} 12mm/s ? "Delayed" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Report Generation
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.systemHealth || 0) > 75
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 115
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 13
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.systemHealth || 0) > 75
                        ? "Automated"
                        : (reading?.temperature || 0) > 115
                        ? "Failed"
                        : (reading?.vibration || 0) > 13
                        ? "Manual"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    💡 Dynamic report generation based on motor conditions:
                    normal + high health = Automated, high temp = Failed, high
                    vibration = Manual, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Reports = (Normal && Health{" "}
                    {">"} 75%) ? "Automated" : Temp {">"} 115°C ? "Failed" :
                    Vibration {">"} 13mm/s ? "Manual" : "Standby"
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Alert System
                    </span>
                    <span
                      className={`font-medium ${
                        reading?.status === "normal" &&
                        (reading?.efficiency || 0) > 65
                          ? "text-green-600"
                          : (reading?.temperature || 0) > 120
                          ? "text-red-600"
                          : (reading?.vibration || 0) > 14
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {reading?.status === "normal" &&
                      (reading?.efficiency || 0) > 65
                        ? "ML-Powered"
                        : (reading?.temperature || 0) > 120
                        ? "Failed"
                        : (reading?.vibration || 0) > 14
                        ? "Basic"
                        : "Standby"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Dynamic alert system based on motor conditions: normal +
                    high efficiency = ML-Powered, high temp = Failed, high
                    vibration = Basic, else = Standby
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    📊 <strong>Formula:</strong> Alerts = (Normal && Efficiency{" "}
                    {">"} 65%) ? "ML-Powered" : Temp {">"} 120°C ? "Failed" :
                    Vibration {">"} 14mm/s ? "Basic" : "Standby"
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
                    Real-time Big Data Analytics Pipeline
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-3">
                    This dashboard demonstrates how industrial motor sensor data
                    flows through advanced big data analytics systems to
                    generate actionable insights, predictive models, and
                    business intelligence. Analytics transforms raw motor data
                    into valuable operational insights for optimization and
                    decision-making.
                  </p>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                    <div>
                      • <strong>Motor Sensors → Analytics:</strong> Speed,
                      efficiency, temperature, vibration, system health data
                    </div>
                    <div>
                      • <strong>Data Volume:</strong> Motor activity and
                      performance determine data point volume
                    </div>
                    <div>
                      • <strong>Processing Speed:</strong> Motor performance
                      affects analytics throughput
                    </div>
                    <div>
                      • <strong>Insights Generation:</strong> Motor complexity
                      and status changes create analytics insights
                    </div>
                    <div>
                      • <strong>Data Quality:</strong> Motor health and
                      efficiency impact analytics accuracy
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
