using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorServer.Models;
using MotorServer.Services;
using MotorServer.Data;

namespace MotorServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IndustrialController : ControllerBase
    {
        private readonly IndustrialManagementService _industrialService;
        private readonly AppDbContext _db;

        public IndustrialController(IndustrialManagementService industrialService, AppDbContext db)
        {
            _industrialService = industrialService;
            _db = db;
        }

        [HttpGet("machines")]
        public async Task<ActionResult<List<IndustrialMachine>>> GetMachines()
        {
            try
            {
                var machines = await _industrialService.GetIndustrialMachines();
                return Ok(machines);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("machines")]
        public async Task<ActionResult<IndustrialMachine>> CreateMachine([FromBody] IndustrialMachine machine)
        {
            try
            {
                var createdMachine = await _industrialService.CreateMachine(machine);
                return Ok(createdMachine);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("machines/{machineId}")]
        public async Task<ActionResult<IndustrialMachine>> UpdateMachine(string machineId, [FromBody] IndustrialMachine machine)
        {
            try
            {
                var updatedMachine = await _industrialService.UpdateMachine(machineId, machine);
                if (updatedMachine == null)
                    return NotFound(new { error = "Machine not found" });
                
                return Ok(updatedMachine);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("production-line/{lineId}/analysis")]
        public async Task<ActionResult<ProductionLineAnalysis>> AnalyzeProductionLine(string lineId)
        {
            try
            {
                var analysis = await _industrialService.AnalyzeProductionLine(lineId);
                return Ok(analysis);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("energy-analysis/{facilityId?}")]
        public async Task<ActionResult<EnergyAnalysis>> AnalyzeEnergyConsumption(string facilityId = "FACILITY-001")
        {
            try
            {
                var analysis = await _industrialService.AnalyzeEnergyConsumption(facilityId);
                return Ok(analysis);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("maintenance-schedule/{facilityId?}")]
        public async Task<ActionResult<MaintenanceSchedule>> GetMaintenanceSchedule(string facilityId = "FACILITY-001")
        {
            try
            {
                var schedule = await _industrialService.GenerateMaintenanceSchedule(facilityId);
                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("facility-overview/{facilityId?}")]
        public async Task<ActionResult<FacilityOverview>> GetFacilityOverview(string facilityId = "FACILITY-001")
        {
            try
            {
                var machines = await _db.IndustrialMachines
                    .Where(m => m.FacilityId == facilityId)
                    .ToListAsync();

                var overview = new FacilityOverview
                {
                    FacilityId = facilityId,
                    Name = $"Industrial Facility {facilityId}",
                    Location = "Industrial Zone A",
                    TotalMachines = machines.Count,
                    OnlineMachines = machines.Count(m => m.Status == "online"),
                    OverallEfficiency = machines.Any() ? machines.Average(m => m.AverageEfficiency) : 0,
                    TotalEnergyConsumption = machines.Sum(m => m.EnergyConsumption),
                    TotalOperatingCost = (decimal)machines.Sum(m => m.CostPerHour),
                    ProductionLines = machines.Select(m => m.ProductionLineId).Where(id => !string.IsNullOrEmpty(id)).Cast<string>().Distinct().ToList(),
                    Departments = machines.Select(m => m.Department).Where(dept => !string.IsNullOrEmpty(dept)).Cast<string>().Distinct().ToList(),
                    LastUpdated = DateTime.UtcNow
                };

                return Ok(overview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("quality-control/{machineId}")]
        public ActionResult<QualityControlMetrics> GetQualityControlMetrics(string machineId)
        {
            try
            {
                // Simulate quality control metrics
                var random = new Random();
                var totalInspections = random.Next(50, 200);
                var passedInspections = (int)(totalInspections * (0.85 + random.NextDouble() * 0.1)); // 85-95% pass rate
                var failedInspections = totalInspections - passedInspections;
                var defectRate = (double)failedInspections / totalInspections * 100;
                var qualityScore = 100 - defectRate;

                var metrics = new QualityControlMetrics
                {
                    MachineId = machineId,
                    AnalysisTimestamp = DateTime.UtcNow,
                    DefectRate = Math.Round(defectRate, 2),
                    QualityScore = Math.Round(qualityScore, 2),
                    TotalInspections = totalInspections,
                    PassedInspections = passedInspections,
                    FailedInspections = failedInspections,
                    CommonDefects = GenerateCommonDefects(failedInspections),
                    QualityRecommendations = GenerateQualityRecommendations(qualityScore)
                };

                return Ok(metrics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("supply-chain/{facilityId?}")]
        public ActionResult<SupplyChainOptimization> GetSupplyChainOptimization(string facilityId = "FACILITY-001")
        {
            try
            {
                var random = new Random();
                var optimization = new SupplyChainOptimization
                {
                    FacilityId = facilityId,
                    AnalysisTimestamp = DateTime.UtcNow,
                    InventoryTurnover = Math.Round(2.5 + random.NextDouble() * 2, 2), // 2.5-4.5 turnover
                    InventoryValue = (decimal)Math.Round(50000 + random.NextDouble() * 100000, 2), // $50k-$150k
                    Stockouts = random.Next(0, 10),
                    OverstockItems = random.Next(5, 20),
                    OptimizationRecommendations = GenerateSupplyChainRecommendations(),
                    CriticalItems = GenerateCriticalItems()
                };

                return Ok(optimization);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private List<string> GenerateCommonDefects(int failedInspections)
        {
            var defects = new List<string>();
            if (failedInspections > 0) defects.Add("Dimensional variance");
            if (failedInspections > 2) defects.Add("Surface finish issues");
            if (failedInspections > 5) defects.Add("Material contamination");
            if (failedInspections > 8) defects.Add("Assembly misalignment");
            return defects;
        }

        private List<string> GenerateQualityRecommendations(double qualityScore)
        {
            var recommendations = new List<string>();
            if (qualityScore < 90) recommendations.Add("🔧 Implement stricter quality control measures");
            if (qualityScore < 85) recommendations.Add("📊 Review manufacturing processes");
            if (qualityScore < 80) recommendations.Add("🚨 Immediate quality improvement required");
            if (qualityScore >= 95) recommendations.Add("✅ Excellent quality performance - maintain standards");
            return recommendations;
        }

        private List<string> GenerateSupplyChainRecommendations()
        {
            return new List<string>
            {
                "📦 Implement automated inventory tracking",
                "🔄 Optimize supplier relationships",
                "📊 Use demand forecasting for better planning",
                "💰 Negotiate bulk purchasing discounts",
                "🚚 Improve logistics coordination"
            };
        }

        private List<InventoryItem> GenerateCriticalItems()
        {
            return new List<InventoryItem>
            {
                new InventoryItem
                {
                    ItemId = "BEARING-001",
                    Name = "Motor Bearings",
                    Category = "Mechanical",
                    CurrentStock = 15,
                    MinimumStock = 20,
                    MaximumStock = 100,
                    UnitCost = 45.50m,
                    Status = "Low Stock",
                    LastRestocked = DateTime.UtcNow.AddDays(-30),
                    NextRestockDate = DateTime.UtcNow.AddDays(5)
                },
                new InventoryItem
                {
                    ItemId = "FILTER-002",
                    Name = "Oil Filters",
                    Category = "Maintenance",
                    CurrentStock = 8,
                    MinimumStock = 10,
                    MaximumStock = 50,
                    UnitCost = 12.75m,
                    Status = "Low Stock",
                    LastRestocked = DateTime.UtcNow.AddDays(-15),
                    NextRestockDate = DateTime.UtcNow.AddDays(2)
                },
                new InventoryItem
                {
                    ItemId = "BELT-003",
                    Name = "Drive Belts",
                    Category = "Mechanical",
                    CurrentStock = 25,
                    MinimumStock = 15,
                    MaximumStock = 75,
                    UnitCost = 28.90m,
                    Status = "In Stock",
                    LastRestocked = DateTime.UtcNow.AddDays(-7),
                    NextRestockDate = DateTime.UtcNow.AddDays(23)
                }
            };
        }
    }
}
