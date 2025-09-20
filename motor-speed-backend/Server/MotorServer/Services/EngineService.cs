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

        // Basic motor parameters
        // Motor speed
        [DllImport(LIB_NAME)]
        public static extern int GetMotorSpeed();

        // Motor temperature
        [DllImport(LIB_NAME)]
        public static extern int GetMotorTemperature();

        // 3-axis vibration sensors
        // Vibration X
        [DllImport(LIB_NAME)]
        public static extern double GetVibrationX();

        // Vibration Y
        [DllImport(LIB_NAME)]
        public static extern double GetVibrationY();

        // Vibration Z
        [DllImport(LIB_NAME)]
        public static extern double GetVibrationZ();

        // Pressure sensors
        // Oil pressure
        [DllImport(LIB_NAME)]
        public static extern double GetOilPressure();

        // Air pressure
        [DllImport(LIB_NAME)]
        public static extern double GetAirPressure();

        [DllImport(LIB_NAME)]
        public static extern double GetHydraulicPressure();

        // Flow rate sensors
        // Coolant flow rate
        [DllImport(LIB_NAME)]
        public static extern double GetCoolantFlowRate();

        // Fuel flow rate
        [DllImport(LIB_NAME)]
        public static extern double GetFuelFlowRate();

        // Electrical monitoring
        // Voltage
        [DllImport(LIB_NAME)]
        public static extern double GetVoltage();

        // Current
        [DllImport(LIB_NAME)]
        public static extern double GetCurrent();

        // Power factor
        [DllImport(LIB_NAME)]
        public static extern double GetPowerFactor();

        // Power consumption
        [DllImport(LIB_NAME)]
        public static extern double GetPowerConsumption();

        // Mechanical measurements
        // RPM
        [DllImport(LIB_NAME)]
        public static extern int GetRPM();

        // Torque
        [DllImport(LIB_NAME)]
        public static extern double GetTorque();

        // Efficiency
        [DllImport(LIB_NAME)]
        public static extern double GetEfficiency();

        // Environmental sensors
        // Humidity
        [DllImport(LIB_NAME)]
        public static extern double GetHumidity();

        // Ambient temperature
        [DllImport(LIB_NAME)]
        public static extern double GetAmbientTemperature();

        // Ambient pressure
        [DllImport(LIB_NAME)]
        public static extern double GetAmbientPressure();

        // Proximity and position sensors
        // Shaft position
        [DllImport(LIB_NAME)]
        public static extern double GetShaftPosition();

        // Displacement
        [DllImport(LIB_NAME)]
        public static extern double GetDisplacement();

        // Strain and stress sensors
        // Strain gauge 1
        [DllImport(LIB_NAME)]
        public static extern double GetStrainGauge1();

        // Strain gauge 2
        [DllImport(LIB_NAME)]
        public static extern double GetStrainGauge2();

        // Strain gauge 3
        [DllImport(LIB_NAME)]
        public static extern double GetStrainGauge3();

        // Acoustic sensors
        // Sound level
        [DllImport(LIB_NAME)]
        public static extern double GetSoundLevel();

        // Bearing health
        [DllImport(LIB_NAME)]
        public static extern double GetBearingHealth();

        // System status
        // Operating hours
        [DllImport(LIB_NAME)]
        public static extern int GetOperatingHours();

        // Operating minutes (for more precision)
        [DllImport(LIB_NAME)]
        public static extern int GetOperatingMinutes();

        // Operating seconds (most precise)
        [DllImport(LIB_NAME)]
        public static extern double GetOperatingSeconds();

        // Motor control functions
        [DllImport(LIB_NAME)]
        public static extern void StartMotor();

        [DllImport(LIB_NAME)]
        public static extern void StopMotor();

        // Maintenance status
        [DllImport(LIB_NAME)]
        public static extern int GetMaintenanceStatus();

        // System health
        [DllImport(LIB_NAME)]
        public static extern int GetSystemHealth();

        private readonly AppDbContext _db;
        private readonly IHubContext<MotorHub> _hub;
        private readonly Random _random = new Random();
        private static int _readingCounter = 0;

        public EngineService(AppDbContext db, IHubContext<MotorHub> hub) {
            _db = db; _hub = hub;
        }

        public async Task<MotorReading> Sample() {
            _readingCounter++;
            
            // Collect all sensor data from C++ engine
            var speed = GetMotorSpeed();
            var temperature = GetMotorTemperature();
            
            // 3-axis vibration sensors
            var vibrationX = Math.Round(GetVibrationX(), 2);
            var vibrationY = Math.Round(GetVibrationY(), 2);
            var vibrationZ = Math.Round(GetVibrationZ(), 2);
            var vibration = Math.Round(Math.Sqrt(vibrationX * vibrationX + vibrationY * vibrationY + vibrationZ * vibrationZ), 2); // RMS vibration
            
            // Pressure sensors
            var oilPressure = Math.Round(GetOilPressure(), 2);
            var airPressure = Math.Round(GetAirPressure(), 2);
            var hydraulicPressure = Math.Round(GetHydraulicPressure(), 2);
            
            // Flow rate sensors
            var coolantFlowRate = Math.Round(GetCoolantFlowRate(), 2);
            var fuelFlowRate = Math.Round(GetFuelFlowRate(), 2);
            
            // Electrical monitoring
            var voltage = Math.Round(GetVoltage(), 2);
            var current = Math.Round(GetCurrent(), 2);
            var powerFactor = Math.Round(GetPowerFactor(), 3);
            var powerConsumption = Math.Round(GetPowerConsumption(), 2);
            
            // Mechanical measurements
            var rpm = GetRPM();
            var torque = Math.Round(GetTorque(), 2);
            var efficiency = Math.Round(GetEfficiency(), 1);
            
            // Environmental sensors
            var humidity = Math.Round(GetHumidity(), 1);
            var ambientTemperature = Math.Round(GetAmbientTemperature(), 1);
            var ambientPressure = Math.Round(GetAmbientPressure(), 2);
            
            // Proximity and position sensors
            var shaftPosition = Math.Round(GetShaftPosition(), 2);
            var displacement = Math.Round(GetDisplacement(), 3);
            
            // Strain and stress sensors
            var strainGauge1 = Math.Round(GetStrainGauge1(), 1);
            var strainGauge2 = Math.Round(GetStrainGauge2(), 1);
            var strainGauge3 = Math.Round(GetStrainGauge3(), 1);
            
            // Acoustic sensors
            var soundLevel = Math.Round(GetSoundLevel(), 1);
            var bearingHealth = Math.Round(GetBearingHealth(), 1);
            
            // System status
            var operatingHours = GetOperatingHours();
            var operatingMinutes = GetOperatingMinutes();
            var operatingSeconds = GetOperatingSeconds();
            var maintenanceStatus = GetMaintenanceStatus();
            var systemHealth = GetSystemHealth();
            
            // Determine status based on readings
            var status = DetermineAdvancedStatus(speed, temperature, vibration, efficiency, oilPressure, bearingHealth, systemHealth);
            
            // Generate a descriptive title
            var title = GenerateAdvancedReadingTitle(speed, temperature, status, systemHealth);

            var reading = new MotorReading {
                // Basic motor parameters
                Speed = speed,
                Temperature = temperature,
                Timestamp = DateTime.UtcNow,
                Title = title,
                MachineId = "MOTOR-001",
                Status = status,
                
                // 3-axis vibration sensors
                VibrationX = vibrationX,
                VibrationY = vibrationY,
                VibrationZ = vibrationZ,
                Vibration = vibration, // Legacy field for backward compatibility
                
                // Pressure sensors
                OilPressure = oilPressure,
                AirPressure = airPressure,
                HydraulicPressure = hydraulicPressure,
                
                // Flow rate sensors
                CoolantFlowRate = coolantFlowRate,
                FuelFlowRate = fuelFlowRate,
                
                // Electrical monitoring
                Voltage = voltage,
                Current = current,
                PowerFactor = powerFactor,
                PowerConsumption = powerConsumption,
                
                // Mechanical measurements
                RPM = rpm,
                Torque = torque,
                Efficiency = efficiency,
                
                // Environmental sensors
                Humidity = humidity,
                AmbientTemperature = ambientTemperature,
                AmbientPressure = ambientPressure,
                
                // Proximity and position sensors
                ShaftPosition = shaftPosition,
                Displacement = displacement,
                
                // Strain and stress sensors
                StrainGauge1 = strainGauge1,
                StrainGauge2 = strainGauge2,
                StrainGauge3 = strainGauge3,
                
                // Acoustic sensors
                SoundLevel = soundLevel,
                BearingHealth = bearingHealth,
                
                // System status
                OperatingHours = operatingHours,
                OperatingMinutes = operatingMinutes,
                OperatingSeconds = Math.Round(operatingSeconds, 2),
                MaintenanceStatus = maintenanceStatus,
                SystemHealth = systemHealth
            };
            
            _db.MotorReadings.Add(reading);
            await _db.SaveChangesAsync();
            
            // Send real-time update
            await _hub.Clients.All.SendAsync("NewReading", reading);
            
            // Check for alerts and send if needed
            await CheckAndSendAdvancedAlerts(reading);
            
            return reading;
        }

        // Determine status based on readings
        private string DetermineStatus(int speed, int temperature, double vibration, double efficiency) {
            if (temperature > 85 || vibration > 4.5 || efficiency < 80) return "critical";
            if (temperature > 75 || vibration > 3.5 || efficiency < 85) return "warning";
            if (_readingCounter % 100 == 0) return "maintenance"; // Simulate maintenance needed
            return "normal";
        }

        // Determine advanced status based on readings
        private string DetermineAdvancedStatus(int speed, int temperature, double vibration, double efficiency, 
            double oilPressure, double bearingHealth, int systemHealth) {
            // Critical conditions
            if (temperature > 90 || vibration > 5.0 || efficiency < 75 || oilPressure < 2.0 || bearingHealth < 70 || systemHealth < 60) {
                return "critical";
            }
            
            // Warning conditions
            if (temperature > 80 || vibration > 4.0 || efficiency < 85 || oilPressure < 2.5 || bearingHealth < 80 || systemHealth < 75) {
                return "warning";
            }
            
            // Maintenance conditions
            if (_readingCounter % 50 == 0 || systemHealth < 85) {
                return "maintenance";
            }
            
            return "normal";
        }

        // Generate reading title
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

        // Generate advanced reading title
        private string GenerateAdvancedReadingTitle(int speed, int temperature, string status, int systemHealth) {
            var prefixes = new[] { "Routine", "Peak", "Standard", "High-load", "Idle", "Optimal", "Efficient", "Stable" };
            var prefix = prefixes[_random.Next(prefixes.Length)];
            
            var statusEmoji = status switch {
                "critical" => "🚨",
                "warning" => "⚠️",
                "maintenance" => "🔧",
                _ => "✅"
            };
            
            var healthIndicator = systemHealth switch {
                >= 90 => "🟢",
                >= 75 => "🟡",
                >= 60 => "🟠",
                _ => "🔴"
            };
            
            // Add unique identifier to prevent duplicate keys
            var uniqueId = Guid.NewGuid().ToString("N")[..8];
            
            return $"{statusEmoji} {healthIndicator} {prefix} Operation - {speed}RPM @ {temperature}°C (Health: {systemHealth}%) [{uniqueId}]";
        }

        // Check for alerts and send if needed
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

        // Check for advanced alerts and send if needed
        private async Task CheckAndSendAdvancedAlerts(MotorReading reading) {
            var alerts = new List<Alert>();
            
            // Temperature alerts
            if (reading.Temperature > 90) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "temperature",
                    Severity = "critical",
                    Message = $"🚨 CRITICAL: Temperature {reading.Temperature}°C exceeds safe limits!",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            } else if (reading.Temperature > 80) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "temperature",
                    Severity = "warning",
                    Message = $"⚠️ WARNING: High temperature {reading.Temperature}°C detected",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            // Vibration alerts
            if (reading.Vibration > 5.0) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "vibration",
                    Severity = "critical",
                    Message = $"🚨 CRITICAL: Excessive vibration {reading.Vibration} mm/s detected!",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            } else if (reading.Vibration > 4.0) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "vibration",
                    Severity = "warning",
                    Message = $"⚠️ WARNING: High vibration {reading.Vibration} mm/s detected",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            // Oil pressure alerts
            if (reading.OilPressure < 2.0) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "pressure",
                    Severity = "critical",
                    Message = $"🚨 CRITICAL: Low oil pressure {reading.OilPressure} bar!",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            } else if (reading.OilPressure < 2.5) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "pressure",
                    Severity = "warning",
                    Message = $"⚠️ WARNING: Low oil pressure {reading.OilPressure} bar",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            // Bearing health alerts
            if (reading.BearingHealth < 70) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "bearing",
                    Severity = "critical",
                    Message = $"🚨 CRITICAL: Bearing health {reading.BearingHealth}% - immediate attention required!",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            } else if (reading.BearingHealth < 80) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "bearing",
                    Severity = "warning",
                    Message = $"⚠️ WARNING: Bearing health {reading.BearingHealth}% - monitor closely",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            // System health alerts
            if (reading.SystemHealth < 60) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "system",
                    Severity = "critical",
                    Message = $"🚨 CRITICAL: System health {reading.SystemHealth}% - shutdown recommended!",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            } else if (reading.SystemHealth < 75) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "system",
                    Severity = "warning",
                    Message = $"⚠️ WARNING: System health {reading.SystemHealth}% - performance degraded",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            // Efficiency alerts
            if (reading.Efficiency < 75) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "efficiency",
                    Severity = "critical",
                    Message = $"🚨 CRITICAL: Low efficiency {reading.Efficiency}% - energy waste detected!",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            } else if (reading.Efficiency < 85) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "efficiency",
                    Severity = "warning",
                    Message = $"⚠️ WARNING: Low efficiency {reading.Efficiency}% - optimization needed",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            // Maintenance alerts
            if (reading.MaintenanceStatus == 3) {
                alerts.Add(new Alert {
                    Id = Guid.NewGuid().ToString(),
                    Type = "maintenance",
                    Severity = "info",
                    Message = $"🔧 MAINTENANCE: Scheduled maintenance due - {reading.OperatingHours} operating hours",
                    Timestamp = DateTime.UtcNow,
                    MachineId = reading.MachineId,
                    Acknowledged = false
                });
            }
            
            foreach (var alert in alerts) {
                await _hub.Clients.All.SendAsync("NewAlert", alert);
            }
        }

        // Get dashboard stats
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
            
            // Count critical alerts from recent readings (last 24 hours) - more accurate
            var criticalAlerts = await _db.MotorReadings
                .Where(r => r.Timestamp >= DateTime.UtcNow.AddHours(-24) && 
                           (r.Status == "critical"))
                .CountAsync();
            
            // Count maintenance due - readings with maintenance status in last 7 days
            var maintenanceDue = await _db.MotorReadings
                .Where(r => r.Timestamp >= DateTime.UtcNow.AddDays(-7) && 
                           r.Status == "maintenance")
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
