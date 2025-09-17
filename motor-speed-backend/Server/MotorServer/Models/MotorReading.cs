namespace MotorServer.Models {
    public class MotorReading {
        public int Id { get; set; }
        public int Speed { get; set; }
        public int Temperature { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Title { get; set; }
        public string MachineId { get; set; } = "MOTOR-001";
        public string Status { get; set; } = "normal";
        public double? Vibration { get; set; }
        public double? PowerConsumption { get; set; }
        public double? Efficiency { get; set; }
        public double? OperatingHours { get; set; }
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
