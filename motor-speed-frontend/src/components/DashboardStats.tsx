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
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Online Machines",
      value: stats.onlineMachines,
      icon: "🟢",
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Total Readings",
      value: stats.totalReadings.toLocaleString(),
      icon: "📊",
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Avg Efficiency",
      value: `${stats.averageEfficiency}%`,
      icon: "⚡",
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      title: "Critical Alerts",
      value: stats.criticalAlerts,
      icon: "🚨",
      color: "bg-red-500",
      textColor: "text-red-600",
    },
    {
      title: "Maintenance Due",
      value: stats.maintenanceDue,
      icon: "🔧",
      color: "bg-orange-500",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center`}
            >
              <span className="text-white text-xl">{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
