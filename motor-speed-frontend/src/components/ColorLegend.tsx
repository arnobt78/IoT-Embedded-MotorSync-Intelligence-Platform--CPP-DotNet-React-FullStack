import React from "react";

export default function ColorLegend() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        📊 Motor Status & Thresholds Guide
      </h3>

      {/* 5-Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status Indicators */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center text-sm">
            🚦 Status
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-800 dark:text-red-300 font-medium">
                Critical
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">
                Warning
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                Maintenance
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-800 dark:text-green-300 font-medium">
                Normal
              </span>
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center text-sm">
            🌡️ Temperature
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-red-600 dark:text-red-400">
                🔴 Critical
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &gt; 85°C
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600 dark:text-yellow-400">
                🟡 Warning
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                75-85°C
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 dark:text-green-400">
                🟢 Normal
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &lt; 75°C
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 dark:text-blue-400">❄️ Cold</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &lt; 30°C
              </span>
            </div>
          </div>
        </div>

        {/* RPM */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center text-sm">
            ⚡ RPM
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-red-600 dark:text-red-400">
                🔴 Overload
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &gt; 3000
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600 dark:text-yellow-400">
                🟡 High
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                2500-3000
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 dark:text-green-400">
                🟢 Optimal
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                1500-2500
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 dark:text-blue-400">🔵 Low</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &lt; 1500
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-red-600 dark:text-red-400">🚨 Stall</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &lt; 500
              </span>
            </div>
          </div>
        </div>

        {/* Vibration */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center text-sm">
            📳 Vibration
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-red-600 dark:text-red-400">
                🔴 Critical
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &gt; 4.5
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600 dark:text-yellow-400">
                🟡 Warning
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                3.5-4.5
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 dark:text-green-400">
                🟢 Normal
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &lt; 3.5
              </span>
            </div>
            <div className="text-center text-gray-500 dark:text-gray-400 text-xs mt-2">
              mm/s
            </div>
          </div>
        </div>

        {/* Efficiency */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center text-sm">
            ⚙️ Efficiency
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-red-600 dark:text-red-400">
                🔴 Critical
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &lt; 80%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600 dark:text-yellow-400">
                🟡 Warning
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                80-85%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 dark:text-green-400">
                🟢 Normal
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                &gt; 85%
              </span>
            </div>
            <div className="text-center text-gray-500 dark:text-gray-400 text-xs mt-2">
              %
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="text-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            💡 <strong>Quick Reference:</strong> Monitor readings against these
            thresholds for optimal motor performance
          </span>
        </div>
      </div>
    </div>
  );
}
