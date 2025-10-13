// ========================================================================
// CONSOLIDATED MOTOR MODELS
// Real Industrial Physics Data Structures
// ========================================================================

using System;

namespace MotorServer.Models
{
    // ========================================================================
    // MAIN MOTOR READING MODEL
    // ========================================================================
    public class MotorReading
    {
        public int Id { get; set; }
        
        // Basic motor parameters
        public int Speed { get; set; }              // RPM - Current motor speed
        public int Temperature { get; set; }        // °C - Current motor temperature
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
        public double? BearingWear { get; set; }
        public double? OilDegradation { get; set; }
        
        // Daily Life Applications - Home Automation
        public double? HVACEfficiency { get; set; }
        public double? EnergySavings { get; set; }
        public double? ComfortLevel { get; set; }
        public double? AirQuality { get; set; }
        public int? SmartDevices { get; set; }
        
        // Daily Life Applications - Personal Vehicle
        public double? FuelEfficiency { get; set; }
        public double? EngineHealth { get; set; }
        public double? BatteryLevel { get; set; }
        public double? TirePressure { get; set; }
        
        // Daily Life Applications - Recreation Equipment
        public double? BoatEngineEfficiency { get; set; }
        public int? BoatEngineHours { get; set; }
        public double? BladeSharpness { get; set; }
        public double? FuelLevel { get; set; }
        public double? GeneratorPowerOutput { get; set; }
        public double? GeneratorFuelEfficiency { get; set; }
        public double? PoolPumpFlowRate { get; set; }
        public double? PoolPumpEnergyUsage { get; set; }
        
        // Daily Life Applications - Smart Appliances
        public double? WashingMachineEfficiency { get; set; }
        public double? DishwasherEfficiency { get; set; }
        public double? RefrigeratorEfficiency { get; set; }
        public double? AirConditionerEfficiency { get; set; }
        
        // System status
        public double? OperatingHours { get; set; }
        public int? OperatingMinutes { get; set; }
        public double? OperatingSeconds { get; set; }
        public int? MaintenanceStatus { get; set; }
        public int? SystemHealth { get; set; }
    }

    // ========================================================================
    // ENHANCED INDUSTRIAL MACHINE MODEL
    // ========================================================================
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
        public double Voltage { get; set; }
        public double Current { get; set; }
        public double PowerFactor { get; set; }
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

    // ========================================================================
    // EDGE COMPUTING NODE MODEL
    // ========================================================================
    public class EdgeNode
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public double CpuUsage { get; set; }
        public double MemoryUsage { get; set; }
        public double NetworkLatency { get; set; }
        public double ProcessingTime { get; set; }
        public double ProcessingPower { get; set; }  // Processing power = 100 - CPU usage
        public double StorageUsed { get; set; }
        public double StorageTotal { get; set; }  // Total storage capacity (100GB)
        public double BandwidthUsage { get; set; }
        public bool IsOnline { get; set; }
        public int ConnectedMachines { get; set; }
        public DateTime LastSync { get; set; }
        public string LastSeen { get; set; } = string.Empty;  // ISO 8601 timestamp
        public string Status { get; set; } = "Online";
        public string Version { get; set; } = "1.0.0";
        public double Temperature { get; set; }
        public double PowerConsumption { get; set; }
    }

    // ========================================================================
    // ML MODEL FOR PREDICTIVE MAINTENANCE
    // ========================================================================
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

    // ========================================================================
    // SYSTEM OVERVIEW MODEL
    // ========================================================================
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

    // ========================================================================
    // PRODUCTION LINE ANALYSIS MODEL
    // ========================================================================
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

    // ========================================================================
    // MAINTENANCE SCHEDULE MODEL
    // ========================================================================
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

    // ========================================================================
    // QUALITY CONTROL METRICS MODEL
    // ========================================================================
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

    // ========================================================================
    // SUPPLY CHAIN OPTIMIZATION MODEL
    // ========================================================================
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

    // ========================================================================
    // FACILITY OVERVIEW MODEL
    // ========================================================================
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

    // ========================================================================
    // ENHANCED MOTOR READING MODEL (extends existing)
    // ========================================================================
    public class EnhancedMotorReading : MotorReading
    {
        public List<IndustrialMachine> IndustrialMachines { get; set; } = new List<IndustrialMachine>();
        public List<EdgeNode> EdgeNodes { get; set; } = new List<EdgeNode>();
        public List<MLModel> MLModels { get; set; } = new List<MLModel>();
        public SystemOverview SystemOverview { get; set; } = new SystemOverview();
        public bool IsWorkingHours { get; set; }
        public double SeasonalFactor { get; set; }
    }

    // ========================================================================
    // PREDICTIVE MAINTENANCE MODELS
    // ========================================================================
    public class PredictiveAnalysis
    {
        public string MachineId { get; set; } = string.Empty;
        public DateTime AnalysisTimestamp { get; set; }
        public double OverallHealthScore { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
        public List<MaintenancePrediction> Predictions { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
        public TrendAnalysis TrendAnalysis { get; set; } = new();
        public List<AnomalyDetection> AnomalyDetection { get; set; } = new();
    }

    public class MaintenancePrediction
    {
        public string Component { get; set; } = string.Empty;
        public string Issue { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime PredictedFailureTime { get; set; }
        public double Confidence { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class TrendAnalysis
    {
        public double TemperatureTrend { get; set; }
        public double VibrationTrend { get; set; }
        public double EfficiencyTrend { get; set; }
        public double PowerTrend { get; set; }
        public string AnalysisPeriod { get; set; } = string.Empty;
    }

    public class AnomalyDetection
    {
        public DateTime Timestamp { get; set; }
        public string SensorType { get; set; } = string.Empty;
        public double Value { get; set; }
        public string ExpectedRange { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class OEEAnalysis
    {
        public string MachineId { get; set; } = string.Empty;
        public string AnalysisPeriod { get; set; } = string.Empty;
        public double Availability { get; set; }
        public double Performance { get; set; }
        public double Quality { get; set; }
        public double OverallOEE { get; set; }
        public List<string> Recommendations { get; set; } = new();
    }

    public class EnergyAnalysis
    {
        public string MachineId { get; set; } = string.Empty;
        public string FacilityId { get; set; } = string.Empty;
        public string AnalysisPeriod { get; set; } = string.Empty;
        public double TotalEnergyConsumption { get; set; }
        public double AveragePowerFactor { get; set; }
        public double EnergyEfficiency { get; set; }
        public double CostSavingsPotential { get; set; }
        public List<string> Recommendations { get; set; } = new();
    }

    public class PerformanceBenchmark
    {
        public string MachineId { get; set; } = string.Empty;
        public string BenchmarkPeriod { get; set; } = string.Empty;
        public double CurrentPerformance { get; set; }
        public double IndustryAverage { get; set; }
        public double BestInClass { get; set; }
        public string PerformanceRating { get; set; } = string.Empty;
        public List<string> ImprovementAreas { get; set; } = new();
    }

    // ========================================================================
    // CONTROL AND ALERT MODELS
    // ========================================================================
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

    public class Alert
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string MachineId { get; set; } = string.Empty;
        public bool Acknowledged { get; set; }
    }

    // ========================================================================
    // PERFORMANCE METRICS MODEL
    // ========================================================================
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

    // ========================================================================
    // BENCHMARK MODEL
    // ========================================================================
    public class Benchmark
    {
        public string Metric { get; set; } = string.Empty;
        public double Current { get; set; }
        public double Target { get; set; }
        public double Industry { get; set; }
        public string Unit { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
    }

    // ========================================================================
    // DASHBOARD STATS MODEL
    // ========================================================================
    public class DashboardStats
    {
        public int TotalMachines { get; set; }
        public int OnlineMachines { get; set; }
        public int TotalReadings { get; set; }
        public double AverageEfficiency { get; set; }
        public int CriticalAlerts { get; set; }
        public int MaintenanceDue { get; set; }
    }

    // ========================================================================
    // MACHINE MODEL
    // ========================================================================
    public class Machine
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Status { get; set; } = "online";
        public DateTime LastSeen { get; set; }
        public int TotalReadings { get; set; }
        public double AverageEfficiency { get; set; }
    }

    // ========================================================================
    // BUSINESS INSIGHTS MODEL
    // Comprehensive business analytics and KPIs
    // ========================================================================
    public class BusinessInsights
    {
        // Executive Summary
        public ExecutiveSummary Executive { get; set; } = new();
        
        // Financial Metrics
        public FinancialMetrics Financial { get; set; } = new();
        
        // Operational KPIs
        public OperationalKPIs Operational { get; set; } = new();
        
        // Trend Analysis
        public TrendMetrics Trends { get; set; } = new();
        
        // Comparative Analysis
        public ComparativeAnalysis Comparative { get; set; } = new();
        
        // Predictive Insights
        public PredictiveInsights Predictive { get; set; } = new();
    }

    public class ExecutiveSummary
    {
        public int SystemHealthScore { get; set; }  // 0-100
        public double TotalUptime { get; set; }  // Percentage
        public int TotalMachines { get; set; }
        public int OnlineMachines { get; set; }
        public double OverallEfficiency { get; set; }
        public int CriticalIssues { get; set; }
        public string[] TopRecommendations { get; set; } = Array.Empty<string>();
        public DateTime LastUpdated { get; set; }
    }

    public class FinancialMetrics
    {
        public double TotalEnergyCost24h { get; set; }
        public double TotalEnergyCost7d { get; set; }
        public double TotalEnergyCost30d { get; set; }
        public double AverageCostPerMachine { get; set; }
        public double EstimatedSavings { get; set; }
        public double MaintenanceCost7d { get; set; }
        public double MaintenanceCost30d { get; set; }
        public double ROI { get; set; }  // Return on Investment percentage
        public double CostPerKWh { get; set; }
        public double TotalPowerConsumption { get; set; }  // kW
    }

    public class OperationalKPIs
    {
        public double OEE { get; set; }  // Overall Equipment Effectiveness
        public double Availability { get; set; }  // Percentage
        public double Performance { get; set; }  // Percentage
        public double Quality { get; set; }  // Percentage
        public double MTBF { get; set; }  // Mean Time Between Failures (hours)
        public double MTTR { get; set; }  // Mean Time To Repair (hours)
        public int PlannedDowntime { get; set; }  // minutes
        public int UnplannedDowntime { get; set; }  // minutes
        public double ProductionOutput { get; set; }  // units
        public double TargetOutput { get; set; }  // units
    }

    public class TrendMetrics
    {
        public List<TrendDataPoint> EfficiencyTrend { get; set; } = new();
        public List<TrendDataPoint> EnergyCostTrend { get; set; } = new();
        public List<TrendDataPoint> UptimeTrend { get; set; } = new();
        public List<TrendDataPoint> MaintenanceTrend { get; set; } = new();
    }

    public class TrendDataPoint
    {
        public string Date { get; set; } = string.Empty;
        public double Value { get; set; }
        public string Label { get; set; } = string.Empty;
    }

    public class ComparativeAnalysis
    {
        public List<MachineComparison> MachinePerformance { get; set; } = new();
        public DepartmentComparison Departments { get; set; } = new();
        public ShiftComparison Shifts { get; set; } = new();
        public MachineComparison BestPerformer { get; set; } = new();
        public MachineComparison WorstPerformer { get; set; } = new();
    }

    public class MachineComparison
    {
        public string MachineId { get; set; } = string.Empty;
        public string MachineName { get; set; } = string.Empty;
        public double Efficiency { get; set; }
        public double Uptime { get; set; }
        public double EnergyCost { get; set; }
        public int MaintenanceEvents { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class DepartmentComparison
    {
        public double ProductionEfficiency { get; set; }
        public double MaintenanceEfficiency { get; set; }
        public double WarehouseEfficiency { get; set; }
    }

    public class ShiftComparison
    {
        public double DayShiftEfficiency { get; set; }
        public double NightShiftEfficiency { get; set; }
        public double DayShiftUptime { get; set; }
        public double NightShiftUptime { get; set; }
    }

    public class PredictiveInsights
    {
        public double ForecastedMaintenanceCost30d { get; set; }
        public int ExpectedDowntimeEvents { get; set; }
        public double EnergyProjection30d { get; set; }
        public List<string> CapacityRecommendations { get; set; } = new();
        public List<MaintenanceForecast> UpcomingMaintenance { get; set; } = new();
    }

    public class MaintenanceForecast
    {
        public string MachineId { get; set; } = string.Empty;
        public string MachineName { get; set; } = string.Empty;
        public DateTime PredictedDate { get; set; }
        public string MaintenanceType { get; set; } = string.Empty;
        public double Confidence { get; set; }  // 0-100
        public double EstimatedCost { get; set; }
    }
}
