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
}

export default function AlertSystem({
  alerts,
  onAcknowledge,
}: AlertSystemProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setVisibleAlerts(alerts.filter((alert) => !alert.acknowledged));
  }, [alerts]);

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
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-lg p-4 shadow-lg ${getSeverityColor(
            alert.severity
          )} animate-in slide-in-from-right duration-300`}
        >
          <div className="flex items-start space-x-3">
            {getSeverityIcon(alert.severity)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium capitalize">
                  {alert.type} Alert
                </p>
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="text-gray-400 hover:text-gray-600"
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
