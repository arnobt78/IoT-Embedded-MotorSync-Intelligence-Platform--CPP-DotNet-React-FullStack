import type { Alert } from "../types";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface AlertSystemProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}

export default function AlertSystem({
  alerts,
  onAcknowledge,
  signalRConnected = true,
  backendStatus = "connected",
}: AlertSystemProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);
  const [dismissingAlerts, setDismissingAlerts] = useState<Set<string>>(
    new Set()
  );
  const [alertSource, setAlertSource] = useState<"backend" | "offline">(
    "backend"
  );

  useEffect(() => {
    setVisibleAlerts(alerts.filter((alert) => !alert.acknowledged));

    // Track alert source based on connection status
    if (signalRConnected && backendStatus === "connected") {
      setAlertSource("backend");
    } else {
      setAlertSource("offline");
    }
  }, [alerts, signalRConnected, backendStatus]);

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    visibleAlerts.forEach((alert) => {
      if (!dismissingAlerts.has(alert.id)) {
        const timer = setTimeout(() => {
          // Start dismissing animation
          setDismissingAlerts((prev) => new Set(prev).add(alert.id));

          // Actually dismiss after animation completes
          setTimeout(() => {
            onAcknowledge(alert.id);
            setDismissingAlerts((prev) => {
              const newSet = new Set(prev);
              newSet.delete(alert.id);
              return newSet;
            });
          }, 300); // Animation duration
        }, 5000); // Auto-dismiss after 5 seconds

        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [visibleAlerts, dismissingAlerts, onAcknowledge]);

  const handleDismiss = (alertId: string) => {
    // Start dismissing animation
    setDismissingAlerts((prev) => new Set(prev).add(alertId));

    // Actually dismiss after animation completes
    setTimeout(() => {
      onAcknowledge(alertId);
      setDismissingAlerts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }, 300); // Animation duration
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800";
      case "high":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "low":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case "high":
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      case "medium":
        return <InformationCircleIcon className="w-5 h-5 text-yellow-500" />;
      case "low":
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-sm">
      {/* Alert System Status Indicator */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                alertSource === "backend" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-gray-600 dark:text-gray-400">
              Alert System:{" "}
              {alertSource === "backend"
                ? "🔗 Real-time Backend"
                : "❌ Offline"}
            </span>
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {visibleAlerts.length} active
          </div>
        </div>
      </div>
      {visibleAlerts.map((alert) => {
        const isDismissing = dismissingAlerts.has(alert.id);
        return (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 shadow-lg ${getSeverityColor(
              alert.severity
            )} transform transition-all duration-300 ease-in-out ${
              isDismissing
                ? "translate-x-full opacity-0 scale-95"
                : "translate-x-0 opacity-100 scale-100"
            }`}
            style={{
              animation: isDismissing
                ? "none"
                : "slideInFromRight 0.3s ease-out",
            }}
          >
            <div className="flex items-start space-x-3">
              {getSeverityIcon(alert.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium capitalize">
                    {alert.type} Alert
                  </p>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm mt-1">{alert.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Machine: {alert.machineId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(alert.timestamp)}
                  </p>
                </div>

                {/* Data Source Indicator */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Source:{" "}
                      {alertSource === "backend"
                        ? "🔗 C++ Backend"
                        : "❌ Offline"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
            scale: 0.95;
          }
          to {
            transform: translateX(0);
            opacity: 1;
            scale: 1;
          }
        }
      `}</style>
    </div>
  );
}
