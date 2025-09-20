import type { DashboardStats } from "../types";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export default function DashboardStatsComponent({
  stats,
}: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Machines",
      value: stats.totalMachines,
      icon: "🏭",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
    },
    {
      title: "Online Machines",
      value: stats.onlineMachines,
      icon: "🟢",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-700",
      iconColor: "text-green-600",
    },
    {
      title: "Total Readings",
      value: stats.totalReadings.toLocaleString(),
      icon: "📊",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      textColor: "text-purple-700",
      iconColor: "text-purple-600",
    },
    {
      title: "Avg Efficiency",
      value: `${stats.averageEfficiency}%`,
      icon: "⚡",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-700",
      iconColor: "text-yellow-600",
    },
    {
      title: "Critical Alerts",
      value: stats.criticalAlerts,
      icon: "🚨",
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
      textColor: "text-red-700",
      iconColor: "text-red-600",
      hint: "Last 24 hours",
    },
    {
      title: "Maintenance Due",
      value: stats.maintenanceDue,
      icon: "🔧",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      textColor: "text-orange-700",
      iconColor: "text-orange-600",
      hint: "Last 7 days",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
              {card.hint && (
                <p className="text-xs text-gray-500 mt-1">{card.hint}</p>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center shadow-sm`}
            >
              <span className={`text-xl ${card.iconColor}`}>{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
