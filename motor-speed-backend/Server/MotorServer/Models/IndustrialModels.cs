namespace MotorServer.Models
{
    public class IndustrialMachine
    {
        public int Id { get; set; }
        public string MachineId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Motor, Pump, Compressor, Generator
        public string Location { get; set; } = string.Empty;
        public string Status { get; set; } = "offline"; // online, offline, maintenance, error
        public DateTime LastSeen { get; set; } = DateTime.UtcNow;
        public int TotalReadings { get; set; } = 0;
        public double AverageEfficiency { get; set; } = 0;
        public string? MaintenanceSchedule { get; set; }
        public double OperatingHours { get; set; } = 0;
        public double EnergyConsumption { get; set; } = 0;
        public double? PowerFactor { get; set; }
        public decimal CostPerHour { get; set; } = 0;
        public string? ProductionLineId { get; set; }
        public string? FacilityId { get; set; }
        public string? Department { get; set; }
        public string? Manufacturer { get; set; }
        public string? Model { get; set; }
        public DateTime? InstallationDate { get; set; }
        public DateTime? LastMaintenanceDate { get; set; }
        public DateTime? NextMaintenanceDate { get; set; }
    }

    public class ProductionLineAnalysis
    {
        public string LineId { get; set; } = string.Empty;
        public DateTime AnalysisTimestamp { get; set; }
        public int TotalMachines { get; set; }
        public int OnlineMachines { get; set; }
        public double OverallEfficiency { get; set; }
        public double TotalEnergyConsumption { get; set; }
        public double TotalOperatingCost { get; set; }
        public List<string> Bottlenecks { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
        public List<MachineSummary> MachineDetails { get; set; } = new();
    }

    public class MachineSummary
    {
        public string MachineId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public double Efficiency { get; set; }
        public double EnergyConsumption { get; set; }
        public DateTime LastSeen { get; set; }
    }

    public class MaintenanceSchedule
    {
        public string FacilityId { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
        public List<MaintenanceTask> ScheduledTasks { get; set; } = new();
    }

    public class MaintenanceTask
    {
        public string TaskId { get; set; } = string.Empty;
        public string MachineId { get; set; } = string.Empty;
        public string MachineName { get; set; } = string.Empty;
        public string TaskType { get; set; } = string.Empty; // Emergency, Preventive, Routine
        public string Priority { get; set; } = string.Empty; // Critical, High, Medium, Low
        public DateTime ScheduledDate { get; set; }
        public int EstimatedDuration { get; set; } // hours
        public List<string> RequiredSkills { get; set; } = new();
        public decimal EstimatedCost { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? AssignedTechnician { get; set; }
        public string Status { get; set; } = "Scheduled"; // Scheduled, In Progress, Completed, Cancelled
    }

    public class FacilityOverview
    {
        public string FacilityId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int TotalMachines { get; set; }
        public int OnlineMachines { get; set; }
        public double OverallEfficiency { get; set; }
        public double TotalEnergyConsumption { get; set; }
        public decimal TotalOperatingCost { get; set; }
        public List<string> ProductionLines { get; set; } = new();
        public List<string> Departments { get; set; } = new();
        public DateTime LastUpdated { get; set; }
    }

    public class QualityControlMetrics
    {
        public string MachineId { get; set; } = string.Empty;
        public DateTime AnalysisTimestamp { get; set; }
        public double DefectRate { get; set; }
        public double QualityScore { get; set; }
        public int TotalInspections { get; set; }
        public int PassedInspections { get; set; }
        public int FailedInspections { get; set; }
        public List<string> CommonDefects { get; set; } = new();
        public List<string> QualityRecommendations { get; set; } = new();
    }

    public class SupplyChainOptimization
    {
        public string FacilityId { get; set; } = string.Empty;
        public DateTime AnalysisTimestamp { get; set; }
        public double InventoryTurnover { get; set; }
        public decimal InventoryValue { get; set; }
        public int Stockouts { get; set; }
        public int OverstockItems { get; set; }
        public List<string> OptimizationRecommendations { get; set; } = new();
        public List<InventoryItem> CriticalItems { get; set; } = new();
    }

    public class InventoryItem
    {
        public string ItemId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public int MaximumStock { get; set; }
        public decimal UnitCost { get; set; }
        public string Status { get; set; } = string.Empty; // In Stock, Low Stock, Out of Stock
        public DateTime? LastRestocked { get; set; }
        public DateTime? NextRestockDate { get; set; }
    }
}
