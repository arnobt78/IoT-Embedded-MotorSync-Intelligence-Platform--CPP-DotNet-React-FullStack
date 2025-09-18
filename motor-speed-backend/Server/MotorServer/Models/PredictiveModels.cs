namespace MotorServer.Models
{
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
}
