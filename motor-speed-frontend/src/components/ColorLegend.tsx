import React from "react";

export default function ColorLegend() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        📊 Motor Status & Thresholds Guide
      </h3>

      {/* 5-Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status Indicators */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-3 text-center text-sm">
            🚦 Status
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-800 font-medium">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-yellow-800 font-medium">
                Warning
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-800 font-medium">
                Maintenance
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-800 font-medium">Normal</span>
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-red-50 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-3 text-center text-sm">
            🌡️ Temperature
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-red-600">🔴 Critical</span>
              <span className="font-medium">&gt; 85°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600">🟡 Warning</span>
              <span className="font-medium">75-85°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600">🟢 Normal</span>
              <span className="font-medium">&lt; 75°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600">❄️ Cold</span>
              <span className="font-medium">&lt; 30°C</span>
            </div>
          </div>
        </div>

        {/* RPM */}
        <div className="bg-blue-50 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-3 text-center text-sm">
            ⚡ RPM
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-red-600">🔴 Overload</span>
              <span className="font-medium">&gt; 3000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600">🟡 High</span>
              <span className="font-medium">2500-3000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600">🟢 Optimal</span>
              <span className="font-medium">1500-2500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600">🔵 Low</span>
              <span className="font-medium">&lt; 1500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-red-600">🚨 Stall</span>
              <span className="font-medium">&lt; 500</span>
            </div>
          </div>
        </div>

        {/* Vibration */}
        <div className="bg-purple-50 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-3 text-center text-sm">
            📳 Vibration
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-red-600">🔴 Critical</span>
              <span className="font-medium">&gt; 4.5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600">🟡 Warning</span>
              <span className="font-medium">3.5-4.5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600">🟢 Normal</span>
              <span className="font-medium">&lt; 3.5</span>
            </div>
            <div className="text-center text-gray-500 text-xs mt-2">mm/s</div>
          </div>
        </div>

        {/* Efficiency */}
        <div className="bg-green-50 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-3 text-center text-sm">
            ⚙️ Efficiency
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-red-600">🔴 Critical</span>
              <span className="font-medium">&lt; 80%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-yellow-600">🟡 Warning</span>
              <span className="font-medium">80-85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600">🟢 Normal</span>
              <span className="font-medium">&gt; 85%</span>
            </div>
            <div className="text-center text-gray-500 text-xs mt-2">%</div>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-center">
          <span className="text-xs text-gray-600">
            💡 <strong>Quick Reference:</strong> Monitor readings against these
            thresholds for optimal motor performance
          </span>
        </div>
      </div>
    </div>
  );
}
