using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using MotorServer.Models;
using MotorServer.Data;
using MotorServer.Hubs;
using System.Text.Json;

namespace MotorServer.Services
{
    public class PredictiveMaintenanceService
    {
        private readonly AppDbContext _db;
        private readonly IHubContext<MotorHub> _hub;

        public PredictiveMaintenanceService(AppDbContext db, IHubContext<MotorHub> hub)
        {
            _db = db;
            _hub = hub;
        }

        public async Task<PredictiveAnalysis> AnalyzeMotorHealth(string machineId = "MOTOR-001")
        {
            // Get recent readings (last 24 hours)
            var recentReadings = await _db.MotorReadings
                .Where(r => r.MachineId == machineId && r.Timestamp >= DateTime.UtcNow.AddHours(-24))
                .OrderByDescending(r => r.Timestamp)
                .Take(100)
                .ToListAsync();

            if (!recentReadings.Any())
            {
                return new PredictiveAnalysis
                {
                    MachineId = machineId,
                    AnalysisTimestamp = DateTime.UtcNow,
                    OverallHealthScore = 0,
                    RiskLevel = "Unknown",
                    Predictions = new List<MaintenancePrediction>(),
                    Recommendations = new List<string> { "Insufficient data for analysis" }
                };
            }

            var analysis = new PredictiveAnalysis
            {
                MachineId = machineId,
                AnalysisTimestamp = DateTime.UtcNow,
                OverallHealthScore = CalculateOverallHealthScore(recentReadings),
                RiskLevel = DetermineRiskLevel(recentReadings),
                Predictions = GenerateMaintenancePredictions(recentReadings),
                Recommendations = GenerateRecommendations(recentReadings),
                TrendAnalysis = AnalyzeTrends(recentReadings),
                AnomalyDetection = DetectAnomalies(recentReadings)
            };

            return analysis;
        }

        private double CalculateOverallHealthScore(List<MotorReading> readings)
        {
            if (!readings.Any()) return 0;

            var scores = new List<double>();

            // Temperature health score (0-100)
            var avgTemp = readings.Average(r => r.Temperature);
            var tempScore = Math.Max(0, 100 - (avgTemp - 50) * 2); // Optimal around 50°C
            scores.Add(Math.Min(100, tempScore));

            // Vibration health score
            var avgVibration = readings.Where(r => r.Vibration.HasValue).Average(r => r.Vibration!.Value);
            var vibrationScore = Math.Max(0, 100 - avgVibration * 20); // Lower vibration = better
            scores.Add(Math.Min(100, vibrationScore));

            // Efficiency health score
            var avgEfficiency = readings.Where(r => r.Efficiency.HasValue).Average(r => r.Efficiency!.Value);
            scores.Add(avgEfficiency);

            // Bearing health score
            var avgBearingHealth = readings.Where(r => r.BearingHealth.HasValue).Average(r => r.BearingHealth!.Value);
            scores.Add(avgBearingHealth);

            // System health score
            var avgSystemHealth = readings.Where(r => r.SystemHealth.HasValue).Average(r => r.SystemHealth!.Value);
            scores.Add(avgSystemHealth);

            return scores.Average();
        }

        private string DetermineRiskLevel(List<MotorReading> readings)
        {
            var healthScore = CalculateOverallHealthScore(readings);
            var criticalReadings = readings.Count(r => r.Status == "critical");
            var warningReadings = readings.Count(r => r.Status == "warning");

            if (healthScore < 40 || criticalReadings > 5)
                return "Critical";
            if (healthScore < 60 || warningReadings > 10)
                return "High";
            if (healthScore < 80)
                return "Medium";
            return "Low";
        }

        private List<MaintenancePrediction> GenerateMaintenancePredictions(List<MotorReading> readings)
        {
            var predictions = new List<MaintenancePrediction>();

            // Temperature trend prediction
            var tempTrend = CalculateTrend(readings.Select(r => (double)r.Temperature).ToList());
            if (tempTrend > 0.5) // Rising temperature trend
            {
                predictions.Add(new MaintenancePrediction
                {
                    Component = "Cooling System",
                    Issue = "Rising Temperature Trend",
                    Severity = tempTrend > 1.0 ? "High" : "Medium",
                    PredictedFailureTime = DateTime.UtcNow.AddDays(7 - (int)(tempTrend * 5)),
                    Confidence = Math.Min(95, tempTrend * 30 + 50),
                    Description = $"Temperature increasing at {tempTrend:F2}°C per hour"
                });
            }

            // Vibration trend prediction
            var vibrationReadings = readings.Where(r => r.Vibration.HasValue).ToList();
            if (vibrationReadings.Count > 10)
            {
                var vibrationTrend = CalculateTrend(vibrationReadings.Select(r => r.Vibration!.Value).ToList());
                if (vibrationTrend > 0.1)
                {
                    predictions.Add(new MaintenancePrediction
                    {
                        Component = "Bearing Assembly",
                        Issue = "Increasing Vibration",
                        Severity = vibrationTrend > 0.3 ? "High" : "Medium",
                        PredictedFailureTime = DateTime.UtcNow.AddDays(14 - (int)(vibrationTrend * 20)),
                        Confidence = Math.Min(90, vibrationTrend * 50 + 40),
                        Description = $"Vibration increasing at {vibrationTrend:F3} mm/s per hour"
                    });
                }
            }

            // Efficiency degradation prediction
            var efficiencyReadings = readings.Where(r => r.Efficiency.HasValue).ToList();
            if (efficiencyReadings.Count > 10)
            {
                var efficiencyTrend = CalculateTrend(efficiencyReadings.Select(r => r.Efficiency!.Value).ToList());
                if (efficiencyTrend < -0.1) // Declining efficiency
                {
                    predictions.Add(new MaintenancePrediction
                    {
                        Component = "Motor Efficiency",
                        Issue = "Efficiency Degradation",
                        Severity = efficiencyTrend < -0.5 ? "High" : "Medium",
                        PredictedFailureTime = DateTime.UtcNow.AddDays(30 - (int)(Math.Abs(efficiencyTrend) * 30)),
                        Confidence = Math.Min(85, Math.Abs(efficiencyTrend) * 40 + 45),
                        Description = $"Efficiency declining at {Math.Abs(efficiencyTrend):F2}% per hour"
                    });
                }
            }

            // Operating hours based prediction
            var latestReading = readings.First();
            if (latestReading.OperatingHours.HasValue && latestReading.OperatingHours > 1000)
            {
                var hoursUntilMaintenance = 2000 - latestReading.OperatingHours.Value;
                if (hoursUntilMaintenance < 200)
                {
                    predictions.Add(new MaintenancePrediction
                    {
                        Component = "General Maintenance",
                        Issue = "Scheduled Maintenance Due",
                        Severity = hoursUntilMaintenance < 50 ? "High" : "Medium",
                        PredictedFailureTime = DateTime.UtcNow.AddHours(hoursUntilMaintenance),
                        Confidence = 95,
                        Description = $"Maintenance due in {hoursUntilMaintenance:F0} operating hours"
                    });
                }
            }

            return predictions.OrderByDescending(p => p.Severity == "High" ? 3 : p.Severity == "Medium" ? 2 : 1).ToList();
        }

        private List<string> GenerateRecommendations(List<MotorReading> readings)
        {
            var recommendations = new List<string>();

            var avgTemp = readings.Average(r => r.Temperature);
            if (avgTemp > 80)
            {
                recommendations.Add("🔧 Check cooling system - temperature consistently high");
            }
            else if (avgTemp < 30)
            {
                recommendations.Add("🌡️ Verify heating system - temperature unusually low");
            }

            var avgVibration = readings.Where(r => r.Vibration.HasValue).Average(r => r.Vibration!.Value);
            if (avgVibration > 4.0)
            {
                recommendations.Add("📳 Inspect bearings and mounting - high vibration detected");
            }

            var avgEfficiency = readings.Where(r => r.Efficiency.HasValue).Average(r => r.Efficiency!.Value);
            if (avgEfficiency < 85)
            {
                recommendations.Add("⚡ Optimize motor settings - efficiency below optimal range");
            }

            var avgBearingHealth = readings.Where(r => r.BearingHealth.HasValue).Average(r => r.BearingHealth!.Value);
            if (avgBearingHealth < 80)
            {
                recommendations.Add("🔩 Schedule bearing inspection - health declining");
            }

            var criticalCount = readings.Count(r => r.Status == "critical");
            if (criticalCount > 0)
            {
                recommendations.Add($"🚨 Immediate attention required - {criticalCount} critical readings in last 24h");
            }

            if (!recommendations.Any())
            {
                recommendations.Add("✅ All systems operating within normal parameters");
            }

            return recommendations;
        }

        private TrendAnalysis AnalyzeTrends(List<MotorReading> readings)
        {
            return new TrendAnalysis
            {
                TemperatureTrend = CalculateTrend(readings.Select(r => (double)r.Temperature).ToList()),
                VibrationTrend = CalculateTrend(readings.Where(r => r.Vibration.HasValue).Select(r => r.Vibration!.Value).ToList()),
                EfficiencyTrend = CalculateTrend(readings.Where(r => r.Efficiency.HasValue).Select(r => r.Efficiency!.Value).ToList()),
                PowerTrend = CalculateTrend(readings.Where(r => r.PowerConsumption.HasValue).Select(r => r.PowerConsumption!.Value).ToList()),
                AnalysisPeriod = "24 hours"
            };
        }

        private List<AnomalyDetection> DetectAnomalies(List<MotorReading> readings)
        {
            var anomalies = new List<AnomalyDetection>();

            if (readings.Count < 10) return anomalies;

            // Temperature anomalies
            var temps = readings.Select(r => r.Temperature).ToList();
            var tempMean = temps.Average();
            var tempStdDev = Math.Sqrt(temps.Select(t => Math.Pow(t - tempMean, 2)).Average());
            
            foreach (var reading in readings.Where(r => Math.Abs(r.Temperature - tempMean) > 2 * tempStdDev))
            {
                anomalies.Add(new AnomalyDetection
                {
                    Timestamp = reading.Timestamp,
                    SensorType = "Temperature",
                    Value = reading.Temperature,
                    ExpectedRange = $"{tempMean - 2 * tempStdDev:F1} - {tempMean + 2 * tempStdDev:F1}°C",
                    Severity = Math.Abs(reading.Temperature - tempMean) > 3 * tempStdDev ? "High" : "Medium",
                    Description = $"Temperature spike detected: {reading.Temperature}°C"
                });
            }

            // Vibration anomalies
            var vibrationReadings = readings.Where(r => r.Vibration.HasValue).ToList();
            if (vibrationReadings.Count > 5)
            {
                var vibrations = vibrationReadings.Select(r => r.Vibration!.Value).ToList();
                var vibMean = vibrations.Average();
                var vibStdDev = Math.Sqrt(vibrations.Select(v => Math.Pow(v - vibMean, 2)).Average());

                foreach (var reading in vibrationReadings.Where(r => Math.Abs(r.Vibration!.Value - vibMean) > 2 * vibStdDev))
                {
                    anomalies.Add(new AnomalyDetection
                    {
                        Timestamp = reading.Timestamp,
                        SensorType = "Vibration",
                        Value = reading.Vibration!.Value,
                        ExpectedRange = $"{vibMean - 2 * vibStdDev:F2} - {vibMean + 2 * vibStdDev:F2} mm/s",
                        Severity = Math.Abs(reading.Vibration!.Value - vibMean) > 3 * vibStdDev ? "High" : "Medium",
                        Description = $"Vibration anomaly detected: {reading.Vibration!.Value:F2} mm/s"
                    });
                }
            }

            return anomalies.OrderByDescending(a => a.Severity == "High" ? 2 : 1).Take(10).ToList();
        }

        private double CalculateTrend(List<double> values)
        {
            if (values.Count < 2) return 0;

            var n = values.Count;
            var sumX = Enumerable.Range(0, n).Sum();
            var sumY = values.Sum();
            var sumXY = Enumerable.Range(0, n).Zip(values, (x, y) => x * y).Sum();
            var sumXX = Enumerable.Range(0, n).Sum(x => x * x);

            var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            return slope;
        }

        public async Task<OEEAnalysis> CalculateOEE(string machineId = "MOTOR-001")
        {
            var readings = await _db.MotorReadings
                .Where(r => r.MachineId == machineId && r.Timestamp >= DateTime.UtcNow.AddDays(-7))
                .ToListAsync();

            if (!readings.Any())
            {
                return new OEEAnalysis
                {
                    MachineId = machineId,
                    AnalysisPeriod = "7 days",
                    Availability = 0,
                    Performance = 0,
                    Quality = 0,
                    OverallOEE = 0
                };
            }

            // Calculate Availability (uptime / planned production time)
            var totalReadings = readings.Count;
            var operationalReadings = readings.Count(r => r.Status != "critical");
            var availability = (double)operationalReadings / totalReadings * 100;

            // Calculate Performance (actual speed / ideal speed)
            var avgSpeed = readings.Average(r => r.Speed);
            var idealSpeed = 2500; // RPM
            var performance = Math.Min(100, (avgSpeed / idealSpeed) * 100);

            // Calculate Quality (good readings / total readings)
            var goodReadings = readings.Count(r => r.Status == "normal" && r.Efficiency > 85);
            var quality = (double)goodReadings / totalReadings * 100;

            // Overall OEE
            var overallOEE = (availability * performance * quality) / 10000;

            return new OEEAnalysis
            {
                MachineId = machineId,
                AnalysisPeriod = "7 days",
                Availability = Math.Round(availability, 2),
                Performance = Math.Round(performance, 2),
                Quality = Math.Round(quality, 2),
                OverallOEE = Math.Round(overallOEE, 2),
                Recommendations = GenerateOEERecommendations(availability, performance, quality)
            };
        }

        private List<string> GenerateOEERecommendations(double availability, double performance, double quality)
        {
            var recommendations = new List<string>();

            if (availability < 90)
                recommendations.Add("🔧 Improve availability - focus on reducing downtime");
            if (performance < 90)
                recommendations.Add("⚡ Optimize performance - check speed settings and load");
            if (quality < 90)
                recommendations.Add("✅ Enhance quality - review process parameters");

            if (recommendations.Count == 0)
                recommendations.Add("🎯 Excellent OEE performance - maintain current practices");

            return recommendations;
        }
    }
}
