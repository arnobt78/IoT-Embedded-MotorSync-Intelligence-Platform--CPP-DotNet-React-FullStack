using System.Runtime.InteropServices;
using MotorServer.Data;
using MotorServer.Hubs;
using MotorServer.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace MotorServer.Services {
    public class EngineService {
        private const string LIB_NAME =
#if WINDOWS
            "motor_engine.dll";
#elif LINUX
            "libmotor_engine.so";
#else
            "libmotor_engine.dylib";
#endif

        [DllImport(LIB_NAME)]
        public static extern int GetMotorSpeed();

        [DllImport(LIB_NAME)]
        public static extern int GetMotorTemperature();

        private readonly AppDbContext _db;
        private readonly IHubContext<MotorHub> _hub;
        private readonly Random _random = new Random();
        private static int _readingCounter = 0;

        public EngineService(AppDbContext db, IHubContext<MotorHub> hub) {
            _db = db; _hub = hub;
        }

        public async Task<MotorReading> Sample() {
            _readingCounter++;
            
            var speed = GetMotorSpeed();
            var temperature = GetMotorTemperature();
            
            // Generate additional realistic data
            var vibration = Math.Round(_random.NextDouble() * 5.0 + 0.5, 2); // 0.5-5.5 mm/s
            var powerConsumption = Math.Round(speed * 0.8 + _random.NextDouble() * 200 + 100, 2); // kW
            var efficiency = Math.Round(85 + _random.NextDouble() * 10, 1); // 85-95%
            var operatingHours = Math.Round(_readingCounter * 0.1, 1); // Simulate operating hours
            
            // Determine status based on readings
            var status = DetermineStatus(speed, temperature, vibration, efficiency);
            
            // Generate a descriptive title
            var title = GenerateReadingTitle(speed, temperature, status);

            var reading = new MotorReading {
                Speed = speed,
                Temperature = temperature,
                Timestamp = DateTime.UtcNow,
                Title = title,
                MachineId = "MOTOR-001",
                Status = status,
                Vibration = vibration,
                PowerConsumption = powerConsumption,
                Efficiency = efficiency,
                OperatingHours = operatingHours
            };
            
            _db.MotorReadings.Add(reading);
            await _db.SaveChangesAsync();
            
            // Send real-time update
            await _hub.Clients.All.SendAsync("NewReading", reading);
            
            // Check for alerts and send if needed
            await CheckAndSendAlerts(reading);
            
            return reading;
        }

        private string DetermineStatus(int speed, int temperature, double vibration, double efficiency) {
            if (temperature > 85 || vibration > 4.5 || efficiency < 80) return "critical";
            if (temperature > 75 || vibration > 3.5 || efficiency < 85) return "warning";
            if (_readingCounter % 100 == 0) return "maintenance"; // Simulate maintenance needed
            return "normal";
        }

        private string GenerateReadingTitle(int speed, int temperature, string status) {
            var prefixes = new[] { "Routine", "Peak", "Standard", "High-load", "Idle", "Optimal" };
            var prefix = prefixes[_random.Next(prefixes.Length)];
            
            var statusEmoji = status switch {
                "critical" => "🚨",
                "warning" => "⚠️",
                "maintenance" => "🔧",
                _ => "✅"
            };
            
            return $"{statusEmoji} {prefix} Operation - {speed}RPM @ {temperature}°C";
        }

        private async Task CheckAndSendAlerts(MotorReading reading) {
            var alerts = new List<Alert>();
            
            if (reading.Temperature > 85) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "temperature",
                    Severity = "critical",
                    Message = $"Critical temperature detected: {reading.Temperature}°C",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            if (reading.Vibration > 4.5) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "vibration",
                    Severity = "high",
                    Message = $"High vibration detected: {reading.Vibration} mm/s",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            if (reading.Efficiency < 80) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "efficiency",
                    Severity = "medium",
                    Message = $"Low efficiency detected: {reading.Efficiency}%",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            foreach (var alert in alerts) {
                await _hub.Clients.All.SendAsync("NewAlert", alert);
            }
        }

        public async Task<DashboardStats> GetDashboardStats() {
            var totalReadings = await _db.MotorReadings.CountAsync();
            
            // Calculate average efficiency safely
            var avgEfficiency = 0.0;
            if (totalReadings > 0) {
                var efficiencyReadings = await _db.MotorReadings
                    .Where(r => r.Efficiency.HasValue)
                    .ToListAsync();
                if (efficiencyReadings.Any()) {
                    avgEfficiency = efficiencyReadings.Average(r => r.Efficiency ?? 0);
                }
            }
            
            // Count critical alerts from recent readings (last 24 hours)
            var criticalAlerts = await _db.MotorReadings
                .Where(r => r.Timestamp >= DateTime.UtcNow.AddHours(-24) && 
                           (r.Status == "critical" || 
                            r.Temperature > 85 || 
                            r.Vibration > 4.5 || 
                            r.Efficiency < 80))
                .CountAsync();
            
            // Count maintenance due (readings with maintenance status)
            var maintenanceDue = await _db.MotorReadings
                .Where(r => r.Status == "maintenance")
                .CountAsync();
            
            return new DashboardStats {
                TotalMachines = 1,
                OnlineMachines = 1,
                TotalReadings = totalReadings,
                AverageEfficiency = Math.Round(avgEfficiency, 1),
                CriticalAlerts = criticalAlerts,
                MaintenanceDue = maintenanceDue
            };
        }
    }
}
