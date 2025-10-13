import React, { useState, useEffect } from "react";
import type { MotorReading } from "../types/types";

interface IoTCloudIntegrationProps {
  reading: MotorReading | null;
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}

export default function IoTCloudIntegration({
  reading,
  signalRConnected = true,
  backendStatus = "connected",
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

  // Simplified: Determine live status directly from reading availability (same as AdvancedAnalyticsDashboard and SensorDashboard)
  const isLive =
    reading !== null && signalRConnected && backendStatus === "connected";

  // Load IoT cloud integration data - SIMPLIFIED: Only use reading prop (same pattern as SensorDashboard)
  // NO API CALLS - all data comes from C++ → C# → React flow via reading prop
  useEffect(() => {
    // If no reading, set all metrics to offline state
    if (!reading || !isLive) {
      setCloudMetrics({
        dataUploaded: 0,
        cloudStorage: 0,
        apiCalls: 0,
        syncStatus: "Disconnected",
        lastSync: new Date().toISOString(),
      });

      setMlInsights({
        predictionAccuracy: 0,
        anomalyScore: 0,
        trendAnalysis: "Offline",
        recommendations: ["❌ System offline - no data available"],
      });

      setEdgeComputing({
        processingLatency: 0,
        localStorage: 0,
        edgeDevices: 0,
        offlineCapability: false,
      });

      setSecurityMetrics({
        securityScore: 0,
        encryptionLevel: "None",
        threatsBlocked: 0,
        complianceScore: 0,
      });

      setAnalyticsMetrics({
        dataPoints: 0,
        processingSpeed: 0,
        insightsGenerated: 0,
        dataQuality: 0,
      });
      return;
    }

    // Calculate cloud metrics using REAL reading data from C++ backend (NO API CALLS)
    setCloudMetrics({
      dataUploaded: Math.floor((reading.speed || 0) * 0.1),
      cloudStorage: Math.floor((reading.temperature || 0) * 2),
      apiCalls: Math.floor((reading.efficiency || 0) * 0.5),
      syncStatus: reading.status === "normal" ? "Connected" : "Syncing",
      lastSync: new Date().toISOString(),
    });

    // Calculate ML insights using REAL reading data
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

    // Calculate edge computing metrics using REAL reading data
    setEdgeComputing({
      processingLatency: Math.max(1, Math.floor((reading.vibration || 0) * 5)),
      localStorage: Math.floor((reading.operatingHours || 0) * 0.1),
      edgeDevices: Math.floor((reading.speed || 0) / 200),
      offlineCapability: reading.status !== "critical",
    });

    // Calculate security metrics using REAL reading data
    const baseSecurityScore = 95;
    const efficiencyBonus = Math.min(5, (reading.efficiency || 0) * 0.05);
    const temperaturePenalty =
      reading.temperature && reading.temperature > 80 ? -2 : 0;
    const vibrationPenalty =
      reading.vibration && reading.vibration > 5 ? -1 : 0;
    const statusBonus = reading.status === "normal" ? 2 : 0;

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

    const baseThreats = 1200;
    const activityMultiplier = Math.floor((reading.speed || 0) / 100);
    const systemHealthFactor = reading.systemHealth
      ? Math.floor(reading.systemHealth / 20)
      : 0;
    const calculatedThreatsBlocked =
      baseThreats + activityMultiplier + systemHealthFactor;

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

    // Calculate analytics metrics using REAL reading data
    const baseDataPoints = 2000000;
    const speedMultiplier = Math.floor((reading.speed || 0) * 1000);
    const efficiencyMultiplier = Math.floor((reading.efficiency || 0) * 1000);
    const temperatureMultiplier = Math.floor((reading.temperature || 0) * 500);

    const calculatedDataPoints =
      baseDataPoints +
      speedMultiplier +
      efficiencyMultiplier +
      temperatureMultiplier;

    const baseProcessingSpeed = 1.0;
    const speedBonus = (reading.speed || 0) * 0.01;
    const processingEfficiencyBonus = (reading.efficiency || 0) * 0.005;
    const systemHealthBonus = reading.systemHealth
      ? (reading.systemHealth - 80) * 0.01
      : 0;

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

    const baseInsights = 800;
    const vibrationInsights = Math.floor((reading.vibration || 0) * 10);
    const operatingHoursInsights = Math.floor(
      (reading.operatingHours || 0) * 2
    );
    const statusInsights =
      reading.status === "normal"
        ? 50
        : reading.status === "warning"
        ? 100
        : 150;

    const calculatedInsights =
      baseInsights +
      vibrationInsights +
      operatingHoursInsights +
      statusInsights;

    const baseDataQuality = 99.5;
    const efficiencyQualityBonus = (reading.efficiency || 0) * 0.002;
    const temperatureQualityPenalty =
      reading.temperature && reading.temperature > 85 ? -0.5 : 0;
    const vibrationQualityPenalty =
      reading.vibration && reading.vibration > 6 ? -0.3 : 0;
    const systemHealthQualityBonus = reading.systemHealth
      ? (reading.systemHealth - 90) * 0.01
      : 0;

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
      processingSpeed: Math.round(calculatedProcessingSpeed * 10) / 10,
      insightsGenerated: calculatedInsights,
      dataQuality: Math.round(calculatedDataQuality * 10) / 10,
    });
  }, [reading, isLive]); // Simplified dependencies - only reading and isLive

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

  // Show "No data available" state when offline or no reading (same pattern as SensorDashboard)
  if (!reading || !isLive) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ☁️ Advanced IoT & Cloud Integration
              </h2>
              {/* Data Source Status Indicator */}
              <span className="px-3 py-1 rounded-full text-xs font-medium inline-block bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                ❌ OFFLINE
              </span>
            </div>
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

        {/* No Data Available Content */}
        <div className="p-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Advanced IoT & Cloud Integration
            </h3>
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              <div className="text-4xl mb-4">☁️</div>
              <div className="text-lg font-medium mb-2">
                No IoT Cloud Data Available
              </div>
              <div className="text-sm mb-4">
                IoT cloud integration requires real-time data from the C++ motor
                engine.
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
                <div className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                  🔗 Data Source Status:
                </div>
                <div className="text-blue-700 dark:text-blue-300 text-sm">
                  {backendStatus === "connected" && !reading ? (
                    <span className="text-yellow-600 dark:text-yellow-400">
                      ⚠️ <strong>No Reading Data:</strong> Generate a motor
                      reading to see IoT cloud metrics
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      ❌ <strong>Connection Error:</strong> Unable to connect to
                      C++ motor engine
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                💡 <strong>Note:</strong> This dashboard only displays real data
                from the C++ backend. All IoT metrics are calculated from actual
                motor sensor readings (speed, temperature, efficiency, etc.)
                using real-world physics formulas.
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
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ☁️ Advanced IoT & Cloud Integration
            </h2>
            {/* Data Source Status Indicator */}
            <span className="px-3 py-1 rounded-full text-xs font-medium inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              🔗 LIVE DATA
            </span>
          </div>
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
                    This dashboard transforms real motor sensor data from C++
                    backend (motor_engine.cpp) into comprehensive cloud
                    integration metrics, showing how industrial motor
                    performance translates to cloud data management, storage
                    usage, and API activity.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Data Upload Volume:</strong> Motor speed (RPM)
                      from C++ determines cloud upload bandwidth. Higher speed
                      generates more sensor data requiring upload to cloud
                      platforms.
                    </div>
                    <div>
                      • <strong>Cloud Storage Usage:</strong> Motor temperature
                      (°C) from C++ affects storage requirements. Higher
                      temperatures trigger more detailed logging and historical
                      analysis storage.
                    </div>
                    <div>
                      • <strong>API Call Frequency:</strong> Motor efficiency
                      (%) from C++ determines optimization API activity. Higher
                      efficiency enables more frequent cloud-based analytics and
                      optimization calls.
                    </div>
                    <div>
                      • <strong>Sync Status:</strong> Motor operational status
                      from C++ controls cloud synchronization state.
                      Critical/warning states trigger different sync protocols
                      and priorities.
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                      <strong>🔗 Data Flow:</strong> motor_engine.cpp →
                      EngineService.cs → MotorController.cs → React (real-time,
                      no intermediate calculations)
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
                    This dashboard demonstrates how motor sensor data from C++
                    backend (motor_engine.cpp) is processed through advanced
                    machine learning algorithms to provide predictive insights,
                    anomaly detection, and intelligent recommendations for
                    industrial motor optimization.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Prediction Accuracy:</strong> Motor efficiency
                      (%) from C++ determines ML model performance. Higher
                      efficiency correlates with better training data quality
                      and more accurate predictions.
                    </div>
                    <div>
                      • <strong>Anomaly Detection:</strong> Motor vibration
                      (mm/s) from C++ indicates unusual patterns. Higher
                      vibration triggers anomaly alerts and investigative
                      recommendations.
                    </div>
                    <div>
                      • <strong>Trend Analysis:</strong> Efficiency patterns
                      from C++ show performance trajectory. Thresholds ({">"}85%
                      Improving, {"<"}70% Declining, else Stable) determine
                      trend classification.
                    </div>
                    <div>
                      • <strong>Smart Recommendations:</strong> AI generates
                      actionable insights from C++ motor data based on
                      efficiency, vibration, and system health thresholds.
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                      <strong>🔗 Data Flow:</strong> motor_engine.cpp →
                      EngineService.cs → MotorController.cs → React (real-time
                      ML analysis)
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
                    This dashboard demonstrates how motor sensor data from C++
                    backend (motor_engine.cpp) is used to simulate edge
                    computing metrics for real-time decision making, reduced
                    latency, and improved reliability.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Processing Latency:</strong> Motor vibration
                      (mm/s) from C++ affects local edge processing speed.
                      Higher vibration increases data complexity requiring more
                      processing time.
                    </div>
                    <div>
                      • <strong>Local Storage:</strong> Motor operating hours
                      from C++ determine edge cache capacity. Longer operation
                      times build larger local datasets for faster edge
                      analytics.
                    </div>
                    <div>
                      • <strong>Edge Devices:</strong> Motor speed (RPM) from
                      C++ correlates to connected edge device count. Higher
                      speeds require distributed edge processing across multiple
                      devices.
                    </div>
                    <div>
                      • <strong>Offline Capability:</strong> Motor status from
                      C++ determines edge device reliability. Non-critical
                      status enables offline edge processing capability.
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                      <strong>🔗 Data Flow:</strong> motor_engine.cpp →
                      EngineService.cs → MotorController.cs → React (real-time
                      edge simulation)
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
                    from C++ backend (motor_engine.cpp) is used to calculate
                    security metrics, threat detection, and compliance
                    monitoring for IoT systems.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Security Score:</strong> Motor efficiency &
                      health from C++ determine overall security rating. Higher
                      efficiency adds bonus, high temperature/vibration add
                      penalties.
                    </div>
                    <div>
                      • <strong>Encryption Level:</strong> Motor efficiency from
                      C++ determines encryption strength. Efficiency {">"}90%
                      enables AES-256, otherwise AES-128.
                    </div>
                    <div>
                      • <strong>Threats Blocked:</strong> Motor activity (speed)
                      and system health from C++ correlate to threat detection
                      volume. Higher activity increases threat monitoring.
                    </div>
                    <div>
                      • <strong>Compliance:</strong> Motor system health from
                      C++ impacts regulatory compliance scores. Health {"<"}70%
                      triggers compliance penalties.
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                      <strong>🔗 Data Flow:</strong> motor_engine.cpp →
                      EngineService.cs → MotorController.cs → React (real-time
                      security analysis)
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
                    from C++ backend (motor_engine.cpp) is processed through
                    advanced big data analytics to generate actionable insights
                    and business intelligence.
                  </p>
                  <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                    <div>
                      • <strong>Data Points:</strong> Motor speed, efficiency,
                      and temperature from C++ determine data volume. Formula:
                      2M base + (Speed×1000) + (Efficiency×1000) +
                      (Temperature×500).
                    </div>
                    <div>
                      • <strong>Processing Speed:</strong> Motor performance
                      from C++ determines analytics throughput. Formula: 1.0
                      TB/h base + speed bonus + efficiency bonus + health bonus.
                    </div>
                    <div>
                      • <strong>Insights Generated:</strong> Motor complexity
                      and status from C++ create analytics insights. Formula:
                      800 base + (Vibration×10) + (Operating Hours×2) + status
                      insights.
                    </div>
                    <div>
                      • <strong>Data Quality:</strong> Motor health and
                      efficiency from C++ impact analytics accuracy. Formula:
                      99.5% base + efficiency bonus + health bonus -
                      temperature/vibration penalties.
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-700">
                      <strong>🔗 Data Flow:</strong> motor_engine.cpp →
                      EngineService.cs → MotorController.cs → React (real-time
                      big data analytics)
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
          </div>
        )}
      </div>
    </div>
  );
}
