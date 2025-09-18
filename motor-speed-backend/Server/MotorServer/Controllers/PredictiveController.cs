using Microsoft.AspNetCore.Mvc;
using MotorServer.Models;
using MotorServer.Services;

namespace MotorServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PredictiveController : ControllerBase
    {
        private readonly PredictiveMaintenanceService _predictiveService;

        public PredictiveController(PredictiveMaintenanceService predictiveService)
        {
            _predictiveService = predictiveService;
        }

        [HttpGet("analysis/{machineId?}")]
        public async Task<ActionResult<PredictiveAnalysis>> GetPredictiveAnalysis(string machineId = "MOTOR-001")
        {
            try
            {
                var analysis = await _predictiveService.AnalyzeMotorHealth(machineId);
                return Ok(analysis);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("oee/{machineId?}")]
        public async Task<ActionResult<OEEAnalysis>> GetOEEAnalysis(string machineId = "MOTOR-001")
        {
            try
            {
                var oee = await _predictiveService.CalculateOEE(machineId);
                return Ok(oee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("health-score/{machineId?}")]
        public async Task<ActionResult<object>> GetHealthScore(string machineId = "MOTOR-001")
        {
            try
            {
                var analysis = await _predictiveService.AnalyzeMotorHealth(machineId);
                return Ok(new
                {
                    machineId = analysis.MachineId,
                    healthScore = analysis.OverallHealthScore,
                    riskLevel = analysis.RiskLevel,
                    timestamp = analysis.AnalysisTimestamp,
                    status = GetHealthStatus(analysis.OverallHealthScore)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("trends/{machineId?}")]
        public async Task<ActionResult<TrendAnalysis>> GetTrendAnalysis(string machineId = "MOTOR-001")
        {
            try
            {
                var analysis = await _predictiveService.AnalyzeMotorHealth(machineId);
                return Ok(analysis.TrendAnalysis);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("anomalies/{machineId?}")]
        public async Task<ActionResult<List<AnomalyDetection>>> GetAnomalies(string machineId = "MOTOR-001")
        {
            try
            {
                var analysis = await _predictiveService.AnalyzeMotorHealth(machineId);
                return Ok(analysis.AnomalyDetection);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("predictions/{machineId?}")]
        public async Task<ActionResult<List<MaintenancePrediction>>> GetMaintenancePredictions(string machineId = "MOTOR-001")
        {
            try
            {
                var analysis = await _predictiveService.AnalyzeMotorHealth(machineId);
                return Ok(analysis.Predictions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private string GetHealthStatus(double healthScore)
        {
            return healthScore switch
            {
                >= 90 => "Excellent",
                >= 80 => "Good",
                >= 70 => "Fair",
                >= 60 => "Poor",
                _ => "Critical"
            };
        }
    }
}
