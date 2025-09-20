namespace MotorServer.Models {
    public class MotorReading {
        public int Id { get; set; }
        
        // Basic motor parameters
        public int Speed { get; set; }
        public int Temperature { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Title { get; set; }
        public string MachineId { get; set; } = "MOTOR-001";
        public string Status { get; set; } = "normal";
        
        // 3-axis vibration sensors (mm/s)
        public double? VibrationX { get; set; }
        public double? VibrationY { get; set; }
        public double? VibrationZ { get; set; }
        public double? Vibration { get; set; } // Legacy field for backward compatibility
        
        // Pressure sensors (bar)
        public double? OilPressure { get; set; }
        public double? AirPressure { get; set; }
        public double? HydraulicPressure { get; set; }
        
        // Flow rate sensors (L/min)
        public double? CoolantFlowRate { get; set; }
        public double? FuelFlowRate { get; set; }
        
        // Electrical monitoring
        public double? Voltage { get; set; }
        public double? Current { get; set; }
        public double? PowerFactor { get; set; }
        public double? PowerConsumption { get; set; }
        
        // Mechanical measurements
        public int? RPM { get; set; }
        public double? Torque { get; set; }
        public double? Efficiency { get; set; }
        
        // Environmental sensors
        public double? Humidity { get; set; }
        public double? AmbientTemperature { get; set; }
        public double? AmbientPressure { get; set; }
        
        // Proximity and position sensors
        public double? ShaftPosition { get; set; }
        public double? Displacement { get; set; }
        
        // Strain and stress sensors (microstrain)
        public double? StrainGauge1 { get; set; }
        public double? StrainGauge2 { get; set; }
        public double? StrainGauge3 { get; set; }
        
        // Acoustic sensors
        public double? SoundLevel { get; set; }
        public double? BearingHealth { get; set; }
        
        // System status
        public double? OperatingHours { get; set; }
        public int? OperatingMinutes { get; set; }
        public double? OperatingSeconds { get; set; }
        public int? MaintenanceStatus { get; set; }
        public int? SystemHealth { get; set; }
    }

    public class Machine {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Status { get; set; } = "online";
        public DateTime LastSeen { get; set; }
        public int TotalReadings { get; set; }
        public double AverageEfficiency { get; set; }
    }

    public class Alert {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string MachineId { get; set; } = string.Empty;
        public bool Acknowledged { get; set; }
    }

    public class DashboardStats {
        public int TotalMachines { get; set; }
        public int OnlineMachines { get; set; }
        public int TotalReadings { get; set; }
        public double AverageEfficiency { get; set; }
        public int CriticalAlerts { get; set; }
        public int MaintenanceDue { get; set; }
    }
}
