import { useState, useEffect } from "react";
import { useToast } from "../hooks/useToast";

interface MotorSettings {
  // Motor Control Settings
  maxSpeed: number;
  minSpeed: number;
  temperatureWarningThreshold: number;
  temperatureCriticalThreshold: number;
  vibrationWarningThreshold: number;
  vibrationCriticalThreshold: number;
  efficiencyWarningThreshold: number;
  efficiencyCriticalThreshold: number;

  // Data Management Settings
  maxReadings: number;
  updateInterval: number;
  dataRetentionDays: number;
  autoExportEnabled: boolean;
  exportFormat: "csv" | "json" | "excel";

  // Notification Settings
  emailNotifications: boolean;
  browserNotifications: boolean;
  soundAlerts: boolean;
  criticalAlertsOnly: boolean;

  // System Performance Settings
  realTimeUpdates: boolean;
  chartAnimationEnabled: boolean;
  dataCompressionEnabled: boolean;
  cacheEnabled: boolean;

  // UI Settings
  darkMode: boolean;
  compactMode: boolean;
  showTooltips: boolean;
  language: string;
}

export default function SettingsModal({
  open,
  onClose,
  darkMode,
  setDarkMode,
  maxReadings,
  setMaxReadings,
}: {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (_v: boolean) => void;
  maxReadings: number;
  setMaxReadings: (_v: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "motor" | "data" | "notifications" | "system" | "ui"
  >("motor");
  const [settings, setSettings] = useState<MotorSettings>({
    // Motor Control Settings
    maxSpeed: 3000,
    minSpeed: 2000,
    temperatureWarningThreshold: 80,
    temperatureCriticalThreshold: 90,
    vibrationWarningThreshold: 4.0,
    vibrationCriticalThreshold: 5.0,
    efficiencyWarningThreshold: 85,
    efficiencyCriticalThreshold: 75,

    // Data Management Settings
    maxReadings: maxReadings,
    updateInterval: 2000,
    dataRetentionDays: 30,
    autoExportEnabled: false,
    exportFormat: "csv",

    // Notification Settings
    emailNotifications: false,
    browserNotifications: true,
    soundAlerts: true,
    criticalAlertsOnly: false,

    // System Performance Settings
    realTimeUpdates: true,
    chartAnimationEnabled: true,
    dataCompressionEnabled: true,
    cacheEnabled: true,

    // UI Settings
    darkMode: darkMode,
    compactMode: false,
    showTooltips: true,
    language: "en",
  });

  const toast = useToast();

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      maxReadings: maxReadings,
      darkMode: darkMode,
    }));
  }, [maxReadings, darkMode]);

  const handleSave = () => {
    setMaxReadings(settings.maxReadings);
    setDarkMode(settings.darkMode);

    // Save to localStorage for persistence
    localStorage.setItem("motorDashboardSettings", JSON.stringify(settings));

    // Show different messages based on active tab
    if (activeTab === "motor") {
      toast.warning(
        "⚠️ Motor Control Settings Saved (UI Only)",
        `Motor control thresholds have been saved locally. Note: This feature is not yet integrated with the backend - coming soon!`
      );
    } else if (activeTab === "data") {
      toast.info(
        "📊 Data Management Settings Saved (Mixed)",
        `Max Readings to Keep is working ✅. Other settings (Update Interval, Data Retention, Auto Export, Export Format) are UI-only and coming soon!`
      );
    } else if (activeTab === "notifications") {
      toast.warning(
        "🔔 Notification Settings Saved (UI Only)",
        `Notification preferences have been saved locally. Note: All notification features (Email, Browser, Sound, Critical Alerts) are not yet integrated with the backend - coming soon!`
      );
    } else if (activeTab === "system") {
      toast.warning(
        "🖥️ System Performance Settings Saved (UI Only)",
        `Performance preferences have been saved locally. Note: All system features (Real-time Updates, Chart Animations, Data Compression, Cache Control) are not yet integrated with the backend - coming soon!`
      );
    } else if (activeTab === "ui") {
      toast.info(
        "🎨 Interface Settings Saved (Mixed)",
        `Dark Mode is working ✅. Other settings (Compact Mode, Show Tooltips, Language) are UI-only and coming soon!`
      );
    } else {
      toast.success(
        "⚙️ Settings Saved Successfully",
        `Motor dashboard settings have been updated. Changes will take effect immediately.`
      );
    }

    onClose();
  };

  const handleReset = () => {
    const defaultSettings: MotorSettings = {
      maxSpeed: 3000,
      minSpeed: 2000,
      temperatureWarningThreshold: 80,
      temperatureCriticalThreshold: 90,
      vibrationWarningThreshold: 4.0,
      vibrationCriticalThreshold: 5.0,
      efficiencyWarningThreshold: 85,
      efficiencyCriticalThreshold: 75,
      maxReadings: 50,
      updateInterval: 2000,
      dataRetentionDays: 30,
      autoExportEnabled: false,
      exportFormat: "csv",
      emailNotifications: false,
      browserNotifications: true,
      soundAlerts: true,
      criticalAlertsOnly: false,
      realTimeUpdates: true,
      chartAnimationEnabled: true,
      dataCompressionEnabled: true,
      cacheEnabled: true,
      darkMode: false,
      compactMode: false,
      showTooltips: true,
      language: "en",
    };

    setSettings(defaultSettings);
    toast.info(
      "🔄 Settings Reset",
      "All settings have been reset to default values."
    );
  };

  const updateSetting = <K extends keyof MotorSettings>(
    key: K,
    value: MotorSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                ⚙️ Motor Dashboard Settings
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Configure your motor monitoring system preferences
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors duration-200 p-2 hover:bg-blue-600 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "motor", label: "Motor Control", icon: "⚡" },
              { id: "data", label: "Data Management", icon: "📊" },
              { id: "notifications", label: "Notifications", icon: "🔔" },
              { id: "system", label: "System", icon: "🖥️" },
              { id: "ui", label: "Interface", icon: "🎨" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | "motor"
                      | "data"
                      | "notifications"
                      | "system"
                      | "ui"
                  )
                }
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "motor" && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                      Motor Control Thresholds
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Configure warning and critical thresholds for motor
                      parameters. These settings affect status determination and
                      alert generation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Card */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-amber-600 dark:text-amber-400 mr-3 mt-1">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                      Feature Status: UI Only
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      <strong>Note:</strong> Motor Control settings are
                      currently UI-only and not integrated with the backend
                      system. Your threshold changes will be saved locally but
                      won't affect actual motor status determination.
                      <span className="font-semibold">
                        This feature is coming soon!
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Speed Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    ⚡ Speed Control
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Speed (RPM)
                    </label>
                    <input
                      type="number"
                      min={2000}
                      max={3500}
                      value={settings.maxSpeed}
                      onChange={(e) =>
                        updateSetting("maxSpeed", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Maximum allowed motor speed (2000-3500 RPM)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Speed (RPM)
                    </label>
                    <input
                      type="number"
                      min={1500}
                      max={2500}
                      value={settings.minSpeed}
                      onChange={(e) =>
                        updateSetting("minSpeed", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum operational speed (1500-2500 RPM)
                    </p>
                  </div>
                </div>

                {/* Temperature Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🌡️ Temperature Control
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Warning Threshold (°C)
                    </label>
                    <input
                      type="number"
                      min={60}
                      max={100}
                      step={0.1}
                      value={settings.temperatureWarningThreshold}
                      onChange={(e) =>
                        updateSetting(
                          "temperatureWarningThreshold",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Temperature warning threshold (60-100°C)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Critical Threshold (°C)
                    </label>
                    <input
                      type="number"
                      min={70}
                      max={120}
                      step={0.1}
                      value={settings.temperatureCriticalThreshold}
                      onChange={(e) =>
                        updateSetting(
                          "temperatureCriticalThreshold",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Temperature critical threshold (70-120°C)
                    </p>
                  </div>
                </div>

                {/* Vibration Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📳 Vibration Control
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Warning Threshold (mm/s)
                    </label>
                    <input
                      type="number"
                      min={1.0}
                      max={8.0}
                      step={0.1}
                      value={settings.vibrationWarningThreshold}
                      onChange={(e) =>
                        updateSetting(
                          "vibrationWarningThreshold",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Vibration warning threshold (1.0-8.0 mm/s)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Critical Threshold (mm/s)
                    </label>
                    <input
                      type="number"
                      min={2.0}
                      max={10.0}
                      step={0.1}
                      value={settings.vibrationCriticalThreshold}
                      onChange={(e) =>
                        updateSetting(
                          "vibrationCriticalThreshold",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Vibration critical threshold (2.0-10.0 mm/s)
                    </p>
                  </div>
                </div>

                {/* Efficiency Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    ⚙️ Efficiency Control
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Warning Threshold (%)
                    </label>
                    <input
                      type="number"
                      min={70}
                      max={95}
                      step={0.1}
                      value={settings.efficiencyWarningThreshold}
                      onChange={(e) =>
                        updateSetting(
                          "efficiencyWarningThreshold",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Efficiency warning threshold (70-95%)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Critical Threshold (%)
                    </label>
                    <input
                      type="number"
                      min={60}
                      max={90}
                      step={0.1}
                      value={settings.efficiencyCriticalThreshold}
                      onChange={(e) =>
                        updateSetting(
                          "efficiencyCriticalThreshold",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Efficiency critical threshold (60-90%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-green-600 dark:text-green-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-green-800 dark:text-green-200 font-medium mb-2">
                      Data Management Settings
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Configure data collection, storage, and export preferences
                      for your motor monitoring system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Status Warning Card */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-amber-600 dark:text-amber-400 mr-3 mt-1">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                      Feature Status: Mixed Integration
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      <strong>Currently Working:</strong> Max Readings to Keep
                      ✅<br />
                      <strong>UI Only (Coming Soon):</strong> Update Interval,
                      Data Retention, Auto Export, Export Format ⏳<br />
                      <span className="font-semibold">Note:</span> Only "Max
                      Readings to Keep" is fully integrated with the backend
                      system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Collection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📊 Data Collection
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Readings to Keep
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      value={settings.maxReadings}
                      onChange={(e) =>
                        updateSetting("maxReadings", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Maximum number of readings to store (10-1000)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Update Interval (ms)
                    </label>
                    <select
                      value={settings.updateInterval}
                      onChange={(e) =>
                        updateSetting("updateInterval", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1000}>1 second (High frequency)</option>
                      <option value={2000}>2 seconds (Standard)</option>
                      <option value={5000}>5 seconds (Balanced)</option>
                      <option value={10000}>10 seconds (Low frequency)</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      How often to collect new motor readings
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data Retention (days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={settings.dataRetentionDays}
                      onChange={(e) =>
                        updateSetting(
                          "dataRetentionDays",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      How long to keep historical data (1-365 days)
                    </p>
                  </div>
                </div>

                {/* Data Export */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📤 Data Export
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto Export Enabled
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Automatically export data at regular intervals
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateSetting(
                          "autoExportEnabled",
                          !settings.autoExportEnabled
                        )
                      }
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                        settings.autoExportEnabled
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                          settings.autoExportEnabled ? "translate-x-6" : ""
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Export Format
                    </label>
                    <select
                      value={settings.exportFormat}
                      onChange={(e) =>
                        updateSetting(
                          "exportFormat",
                          e.target.value as "csv" | "json" | "excel"
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="csv">CSV (Comma Separated Values)</option>
                      <option value="json">
                        JSON (JavaScript Object Notation)
                      </option>
                      <option value="excel">Excel (Microsoft Excel)</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Preferred format for data exports
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-yellow-600 dark:text-yellow-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                      Notification Settings
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      Configure how you want to be notified about motor status
                      changes and alerts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Card */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-amber-600 dark:text-amber-400 mr-3 mt-1">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                      Feature Status: UI Only
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      <strong>Note:</strong> All notification settings are
                      currently UI-only and not integrated with the backend
                      system. Your notification preferences will be saved
                      locally but won't trigger actual notifications (emails,
                      browser alerts, sounds, or filtering).
                      <span className="font-semibold">
                        This feature is coming soon!
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Notification Types */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🔔 Notification Types
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Notifications
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Receive alerts via email
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting(
                            "emailNotifications",
                            !settings.emailNotifications
                          )
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.emailNotifications
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.emailNotifications ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Browser Notifications
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Show browser notifications
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting(
                            "browserNotifications",
                            !settings.browserNotifications
                          )
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.browserNotifications
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.browserNotifications ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Sound Alerts
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Play sound for critical alerts
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting("soundAlerts", !settings.soundAlerts)
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.soundAlerts
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.soundAlerts ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Critical Alerts Only
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Only notify for critical issues
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting(
                            "criticalAlertsOnly",
                            !settings.criticalAlertsOnly
                          )
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.criticalAlertsOnly
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.criticalAlertsOnly ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-purple-600 dark:text-purple-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-purple-800 dark:text-purple-200 font-medium mb-2">
                      System Performance Settings
                    </h4>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      Optimize system performance and resource usage for your
                      motor monitoring dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Card */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-amber-600 dark:text-amber-400 mr-3 mt-1">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                      Feature Status: UI Only
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      <strong>Note:</strong> All system performance settings are
                      currently UI-only and not integrated with the backend
                      system. Your performance preferences will be saved locally
                      but won't affect actual system behavior (real-time
                      updates, chart animations, data compression, cache
                      control).
                      <span className="font-semibold">
                        This feature is coming soon!
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Performance Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🖥️ Performance Options
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Real-time Updates
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Enable live data updates
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting(
                            "realTimeUpdates",
                            !settings.realTimeUpdates
                          )
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.realTimeUpdates
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.realTimeUpdates ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Chart Animations
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Enable smooth chart animations
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting(
                            "chartAnimationEnabled",
                            !settings.chartAnimationEnabled
                          )
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.chartAnimationEnabled
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.chartAnimationEnabled
                              ? "translate-x-6"
                              : ""
                          }`}
                        ></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Data Compression
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Compress data for better performance
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting(
                            "dataCompressionEnabled",
                            !settings.dataCompressionEnabled
                          )
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.dataCompressionEnabled
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.dataCompressionEnabled
                              ? "translate-x-6"
                              : ""
                          }`}
                        ></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Cache Enabled
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Use browser cache for faster loading
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting("cacheEnabled", !settings.cacheEnabled)
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.cacheEnabled
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.cacheEnabled ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ui" && (
            <div className="space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-indigo-600 dark:text-indigo-400 mr-3 mt-1">
                    ℹ️
                  </div>
                  <div>
                    <h4 className="text-indigo-800 dark:text-indigo-200 font-medium mb-2">
                      User Interface Settings
                    </h4>
                    <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                      Customize the appearance and behavior of your motor
                      dashboard interface.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Status Warning Card */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-amber-600 dark:text-amber-400 mr-3 mt-1">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                      Feature Status: Mixed Integration
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      <strong>Currently Working:</strong> Dark Mode ✅<br />
                      <strong>UI Only (Coming Soon):</strong> Compact Mode, Show
                      Tooltips, Language ⏳<br />
                      <span className="font-semibold">Note:</span> Only "Dark
                      Mode" is fully integrated and functional.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Appearance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🎨 Appearance
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dark Mode
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Use dark theme for the interface
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting("darkMode", !settings.darkMode)
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.darkMode
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.darkMode ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Compact Mode
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Use compact layout for smaller screens
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting("compactMode", !settings.compactMode)
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.compactMode
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.compactMode ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Show Tooltips
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Display helpful tooltips and hints
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateSetting("showTooltips", !settings.showTooltips)
                        }
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                          settings.showTooltips
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                            settings.showTooltips ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    🌐 Language
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interface Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        updateSetting("language", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Select your preferred language for the interface
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-2 bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
            >
              🔄 Reset to Defaults
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                💾 Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
