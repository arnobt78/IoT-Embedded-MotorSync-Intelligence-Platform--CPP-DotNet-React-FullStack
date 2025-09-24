using System;
using System.Collections.Generic;

namespace MotorServer.Models
{
    // Enhanced Industrial Machine Model
    public class IndustrialMachine
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRunning { get; set; }
        public double CurrentSpeed { get; set; }
        public double TargetSpeed { get; set; }
        public double Temperature { get; set; }
        public double Load { get; set; }
        public double Efficiency { get; set; }
        public double PowerConsumption { get; set; }
        public double Vibration { get; set; }
        public double Pressure { get; set; }
        public double FlowRate { get; set; }
        public double HealthScore { get; set; }
        public int MaintenanceStatus { get; set; } // 0=Good, 1=Warning, 2=Critical, 3=Maintenance Due
        public DateTime LastSeen { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = "Industrial Systems Inc.";
        public string Model { get; set; } = "IS-2024";
        public double OperatingHours { get; set; }
        public DateTime LastMaintenance { get; set; }
        public DateTime InstallationDate { get; set; }
    }

    // Edge Computing Node Model
    public class EdgeNode
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public double CpuUsage { get; set; }
        public double MemoryUsage { get; set; }
        public double NetworkLatency { get; set; }
        public double ProcessingTime { get; set; }
        public double StorageUsed { get; set; }
        public double BandwidthUsage { get; set; }
        public bool IsOnline { get; set; }
        public int ConnectedMachines { get; set; }
        public DateTime LastSync { get; set; }
        public string Status { get; set; } = "Online";
        public string Version { get; set; } = "1.0.0";
        public double Temperature { get; set; }
        public double PowerConsumption { get; set; }
    }

    // ML Model for Predictive Maintenance
    public class MLModel
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public double Accuracy { get; set; }
        public double Confidence { get; set; }
        public double FailureProbability { get; set; }
        public double RemainingUsefulLife { get; set; }
        public List<double> FeatureWeights { get; set; } = new List<double>();
        public DateTime LastTraining { get; set; }
        public int PredictionCount { get; set; }
        public string ModelType { get; set; } = "Predictive Maintenance";
        public string Algorithm { get; set; } = "Random Forest";
        public double TrainingDataSize { get; set; }
        public double ValidationScore { get; set; }
    }

    // System Overview Model
    public class SystemOverview
    {
        public int TotalMachines { get; set; }
        public int OnlineMachines { get; set; }
        public double OverallEfficiency { get; set; }
        public double TotalPowerConsumption { get; set; }
        public int SystemHealthScore { get; set; }
        public bool IsWorkingHours { get; set; }
        public double SeasonalFactor { get; set; }
        public DateTime LastUpdated { get; set; }
        public double TotalEnergyCost { get; set; }
        public int MaintenanceAlerts { get; set; }
        public int CriticalAlerts { get; set; }
        public double AverageUptime { get; set; }
    }

    // Production Line Analysis Model
    public class ProductionLineAnalysis
    {
        public string LineId { get; set; } = string.Empty;
        public string LineName { get; set; } = string.Empty;
        public int TotalMachines { get; set; }
        public int OnlineMachines { get; set; }
        public double OverallEfficiency { get; set; }
        public double TotalEnergyConsumption { get; set; }
        public List<string> Bottlenecks { get; set; } = new List<string>();
        public List<string> Recommendations { get; set; } = new List<string>();
        public double Throughput { get; set; }
        public double QualityRate { get; set; }
        public DateTime LastAnalysis { get; set; }
    }

    // Maintenance Schedule Model
    public class MaintenanceSchedule
    {
        public string FacilityId { get; set; } = string.Empty;
        public List<MaintenanceTask> ScheduledTasks { get; set; } = new List<MaintenanceTask>();
        public DateTime LastUpdated { get; set; }
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
        public int OverdueTasks { get; set; }
    }

    public class MaintenanceTask
    {
        public string TaskId { get; set; } = string.Empty;
        public string MachineName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string TaskType { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public double EstimatedDuration { get; set; }
        public double EstimatedCost { get; set; }
        public List<string> RequiredSkills { get; set; } = new List<string>();
        public string Status { get; set; } = "Scheduled";
    }

    // Quality Control Metrics Model
    public class QualityControlMetrics
    {
        public string MachineId { get; set; } = string.Empty;
        public double QualityScore { get; set; }
        public double DefectRate { get; set; }
        public int TotalInspections { get; set; }
        public int PassedInspections { get; set; }
        public int FailedInspections { get; set; }
        public List<string> CommonDefects { get; set; } = new List<string>();
        public List<string> QualityRecommendations { get; set; } = new List<string>();
        public DateTime LastUpdated { get; set; }
    }

    // Supply Chain Optimization Model
    public class SupplyChainOptimization
    {
        public string FacilityId { get; set; } = string.Empty;
        public double InventoryTurnover { get; set; }
        public double InventoryValue { get; set; }
        public int Stockouts { get; set; }
        public int OverstockItems { get; set; }
        public List<InventoryItem> CriticalItems { get; set; } = new List<InventoryItem>();
        public List<string> OptimizationRecommendations { get; set; } = new List<string>();
        public DateTime LastUpdated { get; set; }
    }

    public class InventoryItem
    {
        public string ItemId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int MinimumStock { get; set; }
        public int MaximumStock { get; set; }
        public double UnitCost { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? NextRestockDate { get; set; }
        public string Supplier { get; set; } = string.Empty;
    }

    // Facility Overview Model
    public class FacilityOverview
    {
        public string FacilityId { get; set; } = string.Empty;
        public int TotalMachines { get; set; }
        public int OnlineMachines { get; set; }
        public double OverallEfficiency { get; set; }
        public double TotalEnergyConsumption { get; set; }
        public double TotalOperatingCost { get; set; }
        public List<string> ProductionLines { get; set; } = new List<string>();
        public List<string> Departments { get; set; } = new List<string>();
        public DateTime LastUpdated { get; set; }
    }

    // Enhanced Motor Reading Model (extends existing)
    public class EnhancedMotorReading : MotorReading
    {
        public List<IndustrialMachine> IndustrialMachines { get; set; } = new List<IndustrialMachine>();
        public List<EdgeNode> EdgeNodes { get; set; } = new List<EdgeNode>();
        public List<MLModel> MLModels { get; set; } = new List<MLModel>();
        public SystemOverview SystemOverview { get; set; } = new SystemOverview();
        public bool IsWorkingHours { get; set; }
        public double SeasonalFactor { get; set; }
    }

    // Control Command Model
    public class ControlCommand
    {
        public string CommandId { get; set; } = string.Empty;
        public string MachineId { get; set; } = string.Empty;
        public string CommandType { get; set; } = string.Empty;
        public double? Value { get; set; }
        public DateTime Timestamp { get; set; }
        public string Status { get; set; } = "Pending";
        public string Response { get; set; } = string.Empty;
        public double ResponseTime { get; set; }
    }

    // Alert Model (already defined in MotorReading.cs)

    // Performance Metrics Model
    public class PerformanceMetrics
    {
        public string MachineId { get; set; } = string.Empty;
        public double Availability { get; set; }
        public double MTBF { get; set; } // Mean Time Between Failures
        public double MTTR { get; set; } // Mean Time To Repair
        public double OEE { get; set; } // Overall Equipment Effectiveness
        public double Throughput { get; set; }
        public double QualityRate { get; set; }
        public DateTime LastCalculated { get; set; }
    }

    // Benchmark Model
    public class Benchmark
    {
        public string Metric { get; set; } = string.Empty;
        public double Current { get; set; }
        public double Target { get; set; }
        public double Industry { get; set; }
        public string Unit { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }
}
