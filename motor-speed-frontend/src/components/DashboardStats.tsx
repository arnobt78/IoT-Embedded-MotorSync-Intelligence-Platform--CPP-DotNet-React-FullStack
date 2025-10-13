import type { DashboardStats } from "../types";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/api";
import { PhysicsTooltip } from "./ui/tooltip";

interface DashboardStatsProps {
  stats?: DashboardStats | null;
  signalRConnected?: boolean;
  backendStatus?: "connected" | "offline";
}

export default function DashboardStatsComponent({
  stats: propStats,
  signalRConnected = true,
  backendStatus = "connected",
}: DashboardStatsProps) {
  const [stats, setStats] = useState<DashboardStats | null>(propStats || null);
  const [loading, setLoading] = useState(!propStats);

  // Determine data source status
  const getDataSourceStatus = () => {
    if (signalRConnected && backendStatus === "connected" && stats) {
      return "backend";
    } else {
      return "offline";
    }
  };

  const dataSource = getDataSourceStatus();

  // Custom tooltip content for dashboard stats
  const getTooltipContent = (physicsFormula: string) => (
    <div>
      <div className="font-medium mb-1">📊 Physics Formula:</div>
      <div className="text-gray-300">{physicsFormula}</div>
    </div>
  );

  // Invisible tooltip trigger with custom cursor - covers entire card
  const InvisibleTooltip = ({ physicsFormula }: { physicsFormula: string }) => (
    <PhysicsTooltip
      content={getTooltipContent(physicsFormula)}
      children={<div className="absolute inset-0 cursor-help opacity-0" />}
    />
  );

  // Fetch dashboard stats from backend - only real data or offline
  const loadDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<DashboardStats>(
        `${API_BASE_URL}/api/motor/stats`
      );
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      // No fallback data - set to null (offline state)
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stats on component mount or when data source changes
  useEffect(() => {
    if (!propStats && dataSource === "backend") {
      loadDashboardStats();
    } else if (dataSource === "offline") {
      setStats(null);
    }
  }, [dataSource, propStats, loadDashboardStats]);

  // Update stats when propStats changes
  useEffect(() => {
    if (propStats) {
      setStats(propStats);
      setLoading(false);
    }
  }, [propStats]);

  // Show loading state
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show offline state
  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-600 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Offline
                </p>
                <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                  --
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xl text-gray-400 dark:text-gray-500">
                  --
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  // Enhanced stat cards with physics-based calculations and data source indicators
  const statCards = [
    {
      title: "Total Machines",
      value: stats.totalMachines,
      icon: "🏭",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-800",
      textColor: "text-blue-700 dark:text-blue-300",
      iconColor: "text-blue-600 dark:text-blue-400",
      hint: "Online & Offline Machines",
      physicsFormula:
        "Machine Count = Σ(Active Machines) + Σ(Standby Machines)",
      dataSource: dataSource,
    },
    {
      title: "Online Machines",
      value: stats.onlineMachines,
      icon: "🟢",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-100 dark:bg-green-800",
      textColor: "text-green-700 dark:text-green-300",
      iconColor: "text-green-600 dark:text-green-400",
      hint: "Currently Running",
      physicsFormula: "Online Rate = (Online Machines ÷ Total Machines) × 100%",
      dataSource: dataSource,
    },
    {
      title: "Total Readings",
      value: stats.totalReadings.toLocaleString(),
      icon: "📊",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-800",
      textColor: "text-purple-700 dark:text-purple-300",
      iconColor: "text-purple-600 dark:text-purple-400",
      hint: "From Motor-001 Machine",
      physicsFormula: "Total Readings = Σ(Sensor Readings) × Time Period",
      dataSource: dataSource,
    },
    {
      title: "Avg Efficiency",
      value: `${stats.averageEfficiency}%`,
      icon: "⚡",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      iconBg: "bg-yellow-100 dark:bg-yellow-800",
      textColor: "text-yellow-700 dark:text-yellow-300",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      hint: "All Motor-001 Readings",
      physicsFormula:
        "Efficiency = (Useful Power Output ÷ Total Power Input) × 100%",
      dataSource: dataSource,
    },
    {
      title: "Critical Alerts",
      value: stats.criticalAlerts,
      icon: "🚨",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconBg: "bg-red-100 dark:bg-red-800",
      textColor: "text-red-700 dark:text-red-300",
      iconColor: "text-red-600 dark:text-red-400",
      hint: "Last 24 Hours",
      physicsFormula:
        "Alert Count = Σ(Temp >90°C) + Σ(Vibration >6.0mm/s) + Σ(Efficiency <75%)",
      dataSource: dataSource,
    },
    {
      title: "Maintenance Due",
      value: stats.maintenanceDue,
      icon: "🔧",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconBg: "bg-orange-100 dark:bg-orange-800",
      textColor: "text-orange-700 dark:text-orange-300",
      iconColor: "text-orange-600 dark:text-orange-400",
      hint: "Last 7 Days",
      physicsFormula:
        "Maintenance = Σ(Warning: MaintenanceStatus=1) + Σ(Critical: MaintenanceStatus=2)",
      dataSource: dataSource,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md transition-all duration-200 hover:scale-105 relative`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {card.title}
                </p>
                {/* Data source indicator */}
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      card.dataSource === "backend" ? "#10b981" : "#6b7280",
                  }}
                  title={`Data Source: ${
                    card.dataSource === "backend"
                      ? "Real C++ Backend"
                      : "Offline"
                  }`}
                />
              </div>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
              {card.hint && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {card.hint}
                </p>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center shadow-sm`}
            >
              <span className={`text-xl ${card.iconColor}`}>{card.icon}</span>
            </div>
          </div>

          {/* Invisible clickable tooltip area */}
          <InvisibleTooltip physicsFormula={card.physicsFormula} />
        </div>
      ))}
    </div>
  );
}
