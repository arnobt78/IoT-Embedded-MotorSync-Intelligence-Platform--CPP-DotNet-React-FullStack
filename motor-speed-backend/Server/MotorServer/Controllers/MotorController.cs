// ========================================================================
// CONSOLIDATED MOTOR CONTROLLER
// All API endpoints for Real Industrial Motor Physics Engine
// ========================================================================

using Microsoft.AspNetCore.Mvc;
using MotorServer.Data;
using MotorServer.Models;
using MotorServer.Services;
using Microsoft.EntityFrameworkCore;

namespace MotorServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MotorController : ControllerBase
    {
        private readonly EngineService _engineService;
        private readonly AppDbContext _db;

        public MotorController(EngineService engineService, AppDbContext db)
        {
            _engineService = engineService;
            _db = db;
        }

        // ========================================================================
        // BASIC MOTOR ENDPOINTS
        // ========================================================================

        [HttpGet("sample")]
        public async Task<MotorReading> GetSample() => await _engineService.Sample();

        [HttpGet("test")]
        public IActionResult GetTest()
        {
            return Ok(new { message = "Real Industrial Motor Physics Engine is working!", timestamp = DateTime.UtcNow });
        }

        [HttpGet("simple")]
        public IActionResult GetSimple()
        {
            return Ok(new { status = "OK", data = "Simple endpoint working with real physics calculations" });
        }

        [HttpGet]
        public async Task<List<MotorReading>> GetAll()
        {
            var list = await _db.MotorReadings
                .OrderByDescending(r => r.Timestamp)
                .Take(100)
                .ToListAsync();
            
            // Debug: log all timestamps to console
            foreach (var r in list)
            {
                Console.WriteLine($"[DEBUG] MotorReading Id={r.Id} Timestamp={r.Timestamp:O}");
            }
            return list;
        }

        [HttpGet("stats")]
        public async Task<DashboardStats> GetStats() => await _engineService.GetDashboardStats();

        [HttpGet("business-insights")]
        public async Task<ActionResult<BusinessInsights>> GetBusinessInsights()
        {
            try
            {
                var insights = await _engineService.GetBusinessInsightsAsync();
                return Ok(insights);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting business insights: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get business insights", details = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<List<MotorReading>> Search([FromQuery] string? status, [FromQuery] string? machineId, [FromQuery] int? limit = 50)
        {
            var query = _db.MotorReadings.AsQueryable();
            
            if (!string.IsNullOrEmpty(status))
                query = query.Where(r => r.Status == status);
                
            if (!string.IsNullOrEmpty(machineId))
                query = query.Where(r => r.MachineId == machineId);
            
            return await query
                .OrderByDescending(r => r.Timestamp)
                .Take(limit ?? 50)
                .ToListAsync();
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportData([FromQuery] string format = "json")
        {
            var readings = await _db.MotorReadings
                .OrderByDescending(r => r.Timestamp)
                .Take(1000)
                .ToListAsync();

            return format.ToLower() switch
            {
                "csv" => File(
                    System.Text.Encoding.UTF8.GetBytes(GenerateCsv(readings)),
                    "text/csv",
                    $"motor_readings_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv"
                ),
                "json" => File(
                    System.Text.Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(readings)),
                    "application/json",
                    $"motor_readings_{DateTime.UtcNow:yyyyMMdd_HHmmss}.json"
                ),
                _ => BadRequest("Unsupported format. Use 'csv' or 'json'")
            };
        }

        [HttpPost("generate")]
        public async Task<MotorReading> GenerateReading()
        {
            return await _engineService.Sample();
        }

        [HttpPost("clear")]
        public async Task<IActionResult> ClearAllReadings()
        {
            var count = await _db.MotorReadings.CountAsync();
            _db.MotorReadings.RemoveRange(_db.MotorReadings);
            await _db.SaveChangesAsync();
            
            return Ok(new { message = $"Cleared {count} readings from database", clearedCount = count });
        }

        // ========================================================================
        // ENHANCED INDUSTRIAL ENDPOINTS
        // ========================================================================

        [HttpGet("machines")]
        public async Task<ActionResult<List<IndustrialMachine>>> GetIndustrialMachines()
        {
            try
            {
                var machines = await _engineService.GetIndustrialMachinesAsync();
                return Ok(machines);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting industrial machines: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get industrial machines", details = ex.Message });
            }
        }

        [HttpGet("machines/{index}")]
        public async Task<ActionResult<IndustrialMachine>> GetMachine(int index)
        {
            try
            {
                var machines = await _engineService.GetIndustrialMachinesAsync();
                if (index < 0 || index >= machines.Count)
                {
                    return NotFound(new { error = "Machine not found", index = index });
                }
                return Ok(machines[index]);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting machine {index}: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get machine", details = ex.Message });
            }
        }

        [HttpPost("machines/{index}/start")]
        public async Task<ActionResult> StartMachine(int index)
        {
            try
            {
                var success = await _engineService.StartMachineAsync(index);
                if (success)
                {
                    return Ok(new { message = $"Machine {index} started successfully" });
                }
                else
                {
                    return BadRequest(new { error = "Failed to start machine", index = index });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error starting machine {index}: {ex.Message}");
                return StatusCode(500, new { error = "Failed to start machine", details = ex.Message });
            }
        }

        [HttpPost("machines/{index}/stop")]
        public async Task<ActionResult> StopMachine(int index)
        {
            try
            {
                var success = await _engineService.StopMachineAsync(index);
                if (success)
                {
                    return Ok(new { message = $"Machine {index} stopped successfully" });
                }
                else
                {
                    return BadRequest(new { error = "Failed to stop machine", index = index });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error stopping machine {index}: {ex.Message}");
                return StatusCode(500, new { error = "Failed to stop machine", details = ex.Message });
            }
        }

        [HttpPost("machines/{index}/speed")]
        public async Task<ActionResult> SetMachineSpeed(int index, [FromBody] SetSpeedRequest request)
        {
            try
            {
                var success = await _engineService.SetMachineTargetSpeedAsync(index, request.Speed);
                if (success)
                {
                    return Ok(new { message = $"Machine {index} speed set to {request.Speed} RPM" });
                }
                else
                {
                    return BadRequest(new { error = "Failed to set machine speed", index = index, speed = request.Speed });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error setting machine {index} speed: {ex.Message}");
                return StatusCode(500, new { error = "Failed to set machine speed", details = ex.Message });
            }
        }

        [HttpGet("edge-nodes")]
        public async Task<ActionResult<List<EdgeNode>>> GetEdgeNodes()
        {
            try
            {
                var edgeNodes = await _engineService.GetEdgeNodesAsync();
                return Ok(edgeNodes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting edge nodes: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get edge nodes", details = ex.Message });
            }
        }

        [HttpGet("ml-models")]
        public async Task<ActionResult<List<MLModel>>> GetMLModels()
        {
            try
            {
                var mlModels = await _engineService.GetMLModelsAsync();
                return Ok(mlModels);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting ML models: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get ML models", details = ex.Message });
            }
        }

        [HttpGet("system-overview")]
        public async Task<ActionResult<SystemOverview>> GetSystemOverview()
        {
            try
            {
                var systemOverview = await _engineService.GetSystemOverviewAsync();
                return Ok(systemOverview);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting system overview: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get system overview", details = ex.Message });
            }
        }

        [HttpGet("enhanced-reading")]
        public async Task<ActionResult<EnhancedMotorReading>> GetEnhancedReading()
        {
            try
            {
                var enhancedReading = new EnhancedMotorReading
                {
                    // Basic motor reading from C++ engine
                    Speed = (int)await _engineService.GetMotorSpeedAsync(),
                    Temperature = (int)await _engineService.GetMotorTemperatureAsync(),
                    Timestamp = DateTime.UtcNow,
                    MachineId = "MOTOR-001",
                    Status = "normal",
                    
                    // Enhanced industrial data
                    IndustrialMachines = await _engineService.GetIndustrialMachinesAsync(),
                    EdgeNodes = await _engineService.GetEdgeNodesAsync(),
                    MLModels = await _engineService.GetMLModelsAsync(),
                    SystemOverview = await _engineService.GetSystemOverviewAsync(),
                    IsWorkingHours = await _engineService.GetIsWorkingHoursAsync(),
                    SeasonalFactor = await _engineService.GetSeasonalFactorAsync()
                };
                
                return Ok(enhancedReading);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting enhanced reading: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get enhanced reading", details = ex.Message });
            }
        }

        // ========================================================================
        // PRODUCTION LINE ENDPOINTS
        // ========================================================================

        [HttpGet("production-line/{lineId}/business-insights")]
        public async Task<ActionResult<ProductionLineAnalysis>> GetProductionLineAnalysis(string lineId)
        {
            try
            {
                // Get all industrial machines dynamically
                var machines = await _engineService.GetIndustrialMachinesAsync();
                
                // Calculate real-time production line metrics
                int totalMachines = machines.Count;
                int onlineMachines = machines.Count(m => m.IsRunning);
                
                // Calculate weighted efficiency (power-weighted average)
                double totalPower = machines.Where(m => m.IsRunning).Sum(m => m.PowerConsumption);
                double overallEfficiency = machines.Where(m => m.IsRunning).Any() && totalPower > 0
                    ? machines.Where(m => m.IsRunning).Sum(m => m.Efficiency * m.PowerConsumption) / totalPower
                    : 0;
                
                double totalEnergyConsumption = machines.Where(m => m.IsRunning).Sum(m => m.PowerConsumption);
                
                // Throughput based on efficiency and online machines
                double throughput = onlineMachines > 0 ? (overallEfficiency * onlineMachines / totalMachines) : 0;
                
                // Quality rate based on machine health
                double avgHealth = machines.Where(m => m.IsRunning).Any() 
                    ? machines.Where(m => m.IsRunning).Average(m => m.HealthScore) 
                    : 0;
                double qualityRate = Math.Min(99, 85 + (avgHealth - 80) * 0.5);

                // Identify bottlenecks (machines with low efficiency or health)
                var bottlenecks = machines
                    .Where(m => m.IsRunning && (m.Efficiency < 85 || m.HealthScore < 70))
                    .Select(m => $"{m.Name} ({m.Id}): Efficiency={m.Efficiency:F1}%, Health={m.HealthScore:F1}%")
                    .ToList();

                // Generate recommendations based on bottlenecks
                var recommendations = new List<string>();
                if (bottlenecks.Count > 0)
                {
                    recommendations.Add($"Schedule maintenance for {bottlenecks.Count} underperforming machine(s)");
                    recommendations.Add("Optimize machine load distribution to improve overall efficiency");
                }
                if (onlineMachines < totalMachines * 0.8)
                {
                    recommendations.Add($"Bring more machines online - only {onlineMachines}/{totalMachines} currently operational");
                }
                if (totalEnergyConsumption > 100)
                {
                    recommendations.Add($"High energy consumption detected ({totalEnergyConsumption:F1}kW) - review energy optimization strategies");
                }
                if (recommendations.Count == 0)
                {
                    recommendations.Add("Production line operating optimally - maintain current performance");
                    recommendations.Add("Continue regular maintenance schedule to sustain efficiency");
                }

                Console.WriteLine($"📈 Production Line Analysis ({lineId}): Efficiency={overallEfficiency:F1}%, Bottlenecks={bottlenecks.Count}, Quality={qualityRate:F1}%");

                var analysis = new ProductionLineAnalysis
                {
                    LineId = lineId,
                    LineName = $"Production Line {lineId}",
                    TotalMachines = totalMachines,
                    OnlineMachines = onlineMachines,
                    OverallEfficiency = Math.Round(overallEfficiency, 1),
                    TotalEnergyConsumption = Math.Round(totalEnergyConsumption, 1),
                    Throughput = Math.Round(throughput, 1),
                    QualityRate = Math.Round(qualityRate, 1),
                    LastAnalysis = DateTime.UtcNow,
                    Bottlenecks = bottlenecks,
                    Recommendations = recommendations
                };
                
                return Ok(analysis);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting production line analysis: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get production line analysis", details = ex.Message });
            }
        }

        // ========================================================================
        // MAINTENANCE ENDPOINTS
        // ========================================================================

        [HttpGet("maintenance-schedule/{facilityId}")]
        public async Task<ActionResult<MaintenanceSchedule>> GetMaintenanceSchedule(string facilityId)
        {
            try
            {
                // Get all industrial machines dynamically
                var machines = await _engineService.GetIndustrialMachinesAsync();
                
                // Generate maintenance tasks based on machine conditions
                var scheduledTasks = new List<MaintenanceTask>();
                int taskCounter = 1;

                foreach (var machine in machines)
                {
                    // MOTOR-001 always gets routine maintenance
                    if (machine.Id == "MOTOR-001")
                    {
                        scheduledTasks.Add(new MaintenanceTask
                        {
                            TaskId = $"MNT-{taskCounter++:D3}",
                            MachineName = machine.Name,
                            Description = "Routine bearing inspection and lubrication",
                            TaskType = "Preventive",
                            Priority = "Medium",
                            ScheduledDate = DateTime.UtcNow.AddDays(7),
                            EstimatedDuration = 2.0 + (machine.PowerConsumption / 10.0),
                            EstimatedCost = 150.0 + (machine.PowerConsumption * 15),
                            RequiredSkills = new List<string> { "Mechanical", "Lubrication" },
                            Status = "Scheduled"
                        });
                    }

                    // Generate tasks for machines with maintenance status > 0
                    if (machine.MaintenanceStatus > 0)
                    {
                        string priority = machine.MaintenanceStatus == 2 ? "Critical" : "High";
                        string taskType = machine.MaintenanceStatus == 2 ? "Emergency" : "Predictive";
                        int daysAhead = machine.MaintenanceStatus == 2 ? 1 : 3;

                        scheduledTasks.Add(new MaintenanceTask
                        {
                            TaskId = $"MNT-{taskCounter++:D3}",
                            MachineName = machine.Name,
                            Description = $"{taskType} maintenance required - {(machine.MaintenanceStatus == 2 ? "Critical alert detected" : "Warning indicators present")}",
                            TaskType = taskType,
                            Priority = priority,
                            ScheduledDate = DateTime.UtcNow.AddDays(daysAhead),
                            EstimatedDuration = 3.0 + (machine.PowerConsumption / 15.0),
                            EstimatedCost = 250.0 + (machine.PowerConsumption * 25),
                            RequiredSkills = new List<string> { "Mechanical", "Electrical", "Diagnostics" },
                            Status = "Scheduled"
                        });
                    }

                    // Generate tasks for machines with low health score
                    if (machine.HealthScore < 80 && machine.MaintenanceStatus == 0)
                    {
                        scheduledTasks.Add(new MaintenanceTask
                        {
                            TaskId = $"MNT-{taskCounter++:D3}",
                            MachineName = machine.Name,
                            Description = $"Health score monitoring - Current: {machine.HealthScore:F1}%. Preventive inspection recommended.",
                            TaskType = "Predictive",
                            Priority = machine.HealthScore < 70 ? "High" : "Medium",
                            ScheduledDate = DateTime.UtcNow.AddDays(machine.HealthScore < 70 ? 2 : 10),
                            EstimatedDuration = 2.0 + (machine.PowerConsumption / 20.0),
                            EstimatedCost = 180.0 + (machine.PowerConsumption * 18),
                            RequiredSkills = new List<string> { "Diagnostics", "Mechanical" },
                            Status = "Scheduled"
                        });
                    }

                    // Generate tasks for machines with high operating hours
                    if (machine.OperatingHours > 1000)
                    {
                        scheduledTasks.Add(new MaintenanceTask
                        {
                            TaskId = $"MNT-{taskCounter++:D3}",
                            MachineName = machine.Name,
                            Description = $"Scheduled maintenance at {machine.OperatingHours:F0} operating hours - Wear inspection required",
                            TaskType = "Preventive",
                            Priority = "Low",
                            ScheduledDate = DateTime.UtcNow.AddDays(14),
                            EstimatedDuration = 1.5 + (machine.PowerConsumption / 30.0),
                            EstimatedCost = 120.0 + (machine.PowerConsumption * 12),
                            RequiredSkills = new List<string> { "Mechanical" },
                            Status = "Scheduled"
                        });
                    }
                }

                int totalTasks = scheduledTasks.Count + 10; // Some completed tasks
                int completedTasks = totalTasks - scheduledTasks.Count;
                int overdueTasks = scheduledTasks.Count(t => t.Priority == "Critical");

                Console.WriteLine($"🔧 Maintenance Schedule ({facilityId}): Total={totalTasks}, Scheduled={scheduledTasks.Count}, Overdue={overdueTasks}");

                var schedule = new MaintenanceSchedule
                {
                    FacilityId = facilityId,
                    LastUpdated = DateTime.UtcNow,
                    TotalTasks = totalTasks,
                    CompletedTasks = completedTasks,
                    OverdueTasks = overdueTasks,
                    ScheduledTasks = scheduledTasks
                };
                
                return Ok(schedule);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting maintenance schedule: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get maintenance schedule", details = ex.Message });
            }
        }

        // ========================================================================
        // QUALITY CONTROL ENDPOINTS
        // ========================================================================

        [HttpGet("quality-control/{machineId}")]
        public async Task<ActionResult<QualityControlMetrics>> GetQualityControlMetrics(string machineId)
        {
            try
            {
                // Get all industrial machines dynamically
                var machines = await _engineService.GetIndustrialMachinesAsync();
                
                // Calculate quality score based on machine health and efficiency
                double avgHealth = machines.Where(m => m.IsRunning).Any() 
                    ? machines.Where(m => m.IsRunning).Average(m => m.HealthScore) 
                    : 0;
                double avgEfficiency = machines.Where(m => m.IsRunning).Any() 
                    ? machines.Where(m => m.IsRunning).Average(m => m.Efficiency) 
                    : 0;
                double qualityScore = (avgHealth * 0.6) + (avgEfficiency * 0.4);

                // Calculate defect rate based on maintenance issues and health
                int maintenanceIssues = machines.Count(m => m.MaintenanceStatus > 0);
                int healthIssues = machines.Count(m => m.HealthScore < 80);
                double defectRate = (maintenanceIssues + healthIssues) / (double)machines.Count * 100.0;

                // Calculate inspections (proportional to online machines)
                int onlineMachines = machines.Count(m => m.IsRunning);
                int totalInspections = onlineMachines * 50 + (int)(Math.Sin(DateTime.Now.Ticks * 0.0001) * 20 + 20);
                int passedInspections = (int)(totalInspections * (1.0 - defectRate / 100.0));
                int failedInspections = totalInspections - passedInspections;

                // Generate common defects based on machine issues
                var commonDefects = new List<string>();
                if (machines.Any(m => m.Vibration > 5.0))
                    commonDefects.Add("Excessive vibration detected - bearing alignment issue");
                if (machines.Any(m => m.Temperature > 85))
                    commonDefects.Add("High temperature readings - cooling system degradation");
                if (machines.Any(m => m.Efficiency < 75))
                    commonDefects.Add("Low efficiency performance - mechanical wear detected");
                if (commonDefects.Count == 0)
                    commonDefects.Add("No significant defects detected - quality within acceptable range");

                // Generate quality recommendations
                var recommendations = new List<string>();
                if (defectRate > 5.0)
                    recommendations.Add($"High defect rate ({defectRate:F1}%) - implement enhanced quality monitoring");
                if (maintenanceIssues > 0)
                    recommendations.Add($"Address {maintenanceIssues} machine(s) requiring maintenance to improve quality");
                if (healthIssues > 0)
                    recommendations.Add($"Monitor {healthIssues} machine(s) with health scores < 80%");
                if (recommendations.Count == 0)
                {
                    recommendations.Add("Quality performance is excellent - maintain current standards");
                    recommendations.Add("Continue regular quality audits and machine maintenance");
                }

                Console.WriteLine($"✅ Quality Control ({machineId}): Score={qualityScore:F1}%, Defects={defectRate:F1}%, Inspections={totalInspections}");

                var metrics = new QualityControlMetrics
                {
                    MachineId = machineId,
                    QualityScore = Math.Round(qualityScore, 1),
                    DefectRate = Math.Round(defectRate, 1),
                    TotalInspections = totalInspections,
                    PassedInspections = passedInspections,
                    FailedInspections = failedInspections,
                    LastUpdated = DateTime.UtcNow,
                    CommonDefects = commonDefects,
                    QualityRecommendations = recommendations
                };
                
                return Ok(metrics);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting quality control metrics: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get quality control metrics", details = ex.Message });
            }
        }

        // ========================================================================
        // SUPPLY CHAIN ENDPOINTS
        // ========================================================================

        [HttpGet("supply-chain/{facilityId}")]
        public async Task<ActionResult<SupplyChainOptimization>> GetSupplyChainOptimization(string facilityId)
        {
            try
            {
                // Get all industrial machines dynamically
                var machines = await _engineService.GetIndustrialMachinesAsync();
                
                // Calculate inventory metrics based on machine performance
                int totalMachines = machines.Count;
                int onlineMachines = machines.Count(m => m.IsRunning);
                double avgEfficiency = machines.Where(m => m.IsRunning).Any() 
                    ? machines.Where(m => m.IsRunning).Average(m => m.Efficiency) 
                    : 0;
                double totalPower = machines.Where(m => m.IsRunning).Sum(m => m.PowerConsumption);

                // Inventory turnover based on efficiency and power usage
                double inventoryTurnover = Math.Round((avgEfficiency / 10.0) * (1.0 + totalPower / 100.0), 1);
                
                // Inventory value based on machine count and power
                double inventoryValue = 50000 + (totalMachines * 8000) + (totalPower * 200);
                
                // Stockouts based on maintenance issues
                int maintenanceIssues = machines.Count(m => m.MaintenanceStatus > 0);
                int healthIssues = machines.Count(m => m.HealthScore < 80);
                int stockouts = maintenanceIssues + healthIssues;
                
                // Overstock based on offline machines
                int overstockItems = 5 + (totalMachines - onlineMachines);

                // Generate critical items based on machine maintenance needs
                var criticalItems = new List<InventoryItem>();
                
                // Bearings (always critical for rotating equipment)
                criticalItems.Add(new InventoryItem
                {
                    ItemId = "BEARING-001",
                    Name = "Ball Bearing 6205-2RS",
                    CurrentStock = 45 + (int)(Math.Sin(DateTime.Now.Ticks * 0.0001) * 10),
                    MinimumStock = 50,
                    MaximumStock = 200,
                    UnitCost = 25.50,
                    Status = stockouts > 2 ? "Low Stock" : "Adequate",
                    NextRestockDate = DateTime.UtcNow.AddDays(5),
                    Supplier = "Bearings Inc."
                });
                
                // Oil (critical for motors, pumps, compressors)
                criticalItems.Add(new InventoryItem
                {
                    ItemId = "OIL-002",
                    Name = "Industrial Oil ISO VG 46",
                    CurrentStock = 120 + (int)(Math.Cos(DateTime.Now.Ticks * 0.0001) * 20),
                    MinimumStock = 100,
                    MaximumStock = 500,
                    UnitCost = 45.75,
                    Status = "Adequate",
                    NextRestockDate = DateTime.UtcNow.AddDays(30),
                    Supplier = "Lubricants Ltd."
                });

                // Generate recommendations
                var recommendations = new List<string>();
                if (stockouts > 3)
                    recommendations.Add($"Critical: {stockouts} machine maintenance issues detected - order spare parts urgently");
                if (overstockItems > 10)
                    recommendations.Add($"Excess inventory detected ({overstockItems} items) - review ordering policies");
                if (inventoryTurnover < 5)
                    recommendations.Add("Low inventory turnover - optimize stock levels to free up capital");
                if (recommendations.Count == 0)
                {
                    recommendations.Add("Supply chain operating efficiently - maintain current inventory levels");
                    recommendations.Add("Continue monitoring stock levels and reorder points");
                }

                Console.WriteLine($"📦 Supply Chain ({facilityId}): Turnover={inventoryTurnover}, Value=${inventoryValue:F0}, Stockouts={stockouts}");

                var optimization = new SupplyChainOptimization
                {
                    FacilityId = facilityId,
                    InventoryTurnover = inventoryTurnover,
                    InventoryValue = Math.Round(inventoryValue, 0),
                    Stockouts = stockouts,
                    OverstockItems = overstockItems,
                    LastUpdated = DateTime.UtcNow,
                    CriticalItems = criticalItems,
                    OptimizationRecommendations = recommendations
                };
                
                return Ok(optimization);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting supply chain optimization: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get supply chain optimization", details = ex.Message });
            }
        }

        // ========================================================================
        // FACILITY ENDPOINTS
        // ========================================================================

        [HttpGet("facility-overview/{facilityId}")]
        public async Task<ActionResult<FacilityOverview>> GetFacilityOverview(string facilityId)
        {
            try
            {
                // Get all industrial machines dynamically
                var machines = await _engineService.GetIndustrialMachinesAsync();
                
                // Calculate real-time facility metrics
                int totalMachines = machines.Count; // Should be 17 (1 MOTOR-001 + 16 industrial machines)
                int onlineMachines = machines.Count(m => m.IsRunning);
                double totalEnergyConsumption = machines.Where(m => m.IsRunning).Sum(m => m.PowerConsumption);
                double overallEfficiency = machines.Where(m => m.IsRunning).Any() 
                    ? machines.Where(m => m.IsRunning).Average(m => m.Efficiency) 
                    : 0;
                double totalOperatingCost = totalEnergyConsumption * 0.12; // $0.12/kWh

                Console.WriteLine($"🏢 Facility Overview ({facilityId}): Total={totalMachines}, Online={onlineMachines}, Energy={totalEnergyConsumption:F1}kW, Efficiency={overallEfficiency:F1}%, Cost=${totalOperatingCost:F2}/h");

                var overview = new FacilityOverview
                {
                    FacilityId = facilityId,
                    TotalMachines = totalMachines,
                    OnlineMachines = onlineMachines,
                    OverallEfficiency = Math.Round(overallEfficiency, 1),
                    TotalEnergyConsumption = Math.Round(totalEnergyConsumption, 1),
                    TotalOperatingCost = Math.Round(totalOperatingCost, 2),
                    LastUpdated = DateTime.UtcNow,
                    ProductionLines = new List<string>
                    {
                        "Assembly Line A",
                        "Assembly Line B",
                        "Packaging Line",
                        "Quality Control Station"
                    },
                    Departments = new List<string>
                    {
                        "Production",
                        "Maintenance",
                        "Quality Control",
                        "Logistics"
                    }
                };
                
                return Ok(overview);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting facility overview: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get facility overview", details = ex.Message });
            }
        }

        // ========================================================================
        // PREDICTIVE MAINTENANCE ENDPOINTS
        // ========================================================================

        [HttpGet("predictive/analysis/{machineId?}")]
        public async Task<ActionResult<PredictiveAnalysis>> GetPredictiveAnalysis(string machineId = "MOTOR-001")
        {
            try
            {
                var analysis = await _engineService.AnalyzeMotorHealth(machineId);
                return Ok(analysis);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting predictive analysis: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get predictive analysis", details = ex.Message });
            }
        }

        [HttpGet("predictive/oee/{machineId?}")]
        public async Task<ActionResult<OEEAnalysis>> GetOEEAnalysis(string machineId = "MOTOR-001")
        {
            try
            {
                var oeeAnalysis = await _engineService.CalculateOEE(machineId);
                return Ok(oeeAnalysis);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting OEE analysis: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get OEE analysis", details = ex.Message });
            }
        }

        [HttpGet("predictive/health-score/{machineId?}")]
        public async Task<ActionResult<object>> GetHealthScore(string machineId = "MOTOR-001")
        {
            try
            {
                var readings = await _db.MotorReadings
                    .Where(r => r.MachineId == machineId)
                    .OrderByDescending(r => r.Timestamp)
                    .Take(10)
                    .ToListAsync();

                var healthScore = readings.Any() ? readings.Average(r => r.SystemHealth ?? 85) : 85.0;
                var riskLevel = healthScore switch
                {
                    >= 90 => "Low Risk",
                    >= 75 => "Medium Risk",
                    >= 60 => "High Risk",
                    _ => "Critical Risk"
                };

                return Ok(new
                {
                    MachineId = machineId,
                    HealthScore = healthScore,
                    RiskLevel = riskLevel,
                    LastUpdated = DateTime.UtcNow,
                    ReadingsAnalyzed = readings.Count
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting health score: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get health score", details = ex.Message });
            }
        }

        [HttpGet("predictive/trends/{machineId?}")]
        public async Task<ActionResult<TrendAnalysis>> GetTrendAnalysis(string machineId = "MOTOR-001")
        {
            try
            {
                var readings = await _db.MotorReadings
                    .Where(r => r.MachineId == machineId)
                    .OrderByDescending(r => r.Timestamp)
                    .Take(50)
                    .ToListAsync();

                var trendAnalysis = new TrendAnalysis
                {
                    TemperatureTrend = readings.Any() ? CalculateTrend(readings.Select(r => (double)r.Temperature).ToList()) : 0.0,
                    VibrationTrend = readings.Any() ? CalculateTrend(readings.Select(r => r.Vibration ?? 0.0).ToList()) : 0.0,
                    EfficiencyTrend = readings.Any() ? CalculateTrend(readings.Select(r => r.Efficiency ?? 0.0).ToList()) : 0.0,
                    PowerTrend = readings.Any() ? CalculateTrend(readings.Select(r => r.PowerConsumption ?? 0.0).ToList()) : 0.0,
                    AnalysisPeriod = "Last 50 readings"
                };

                return Ok(trendAnalysis);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting trend analysis: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get trend analysis", details = ex.Message });
            }
        }

        [HttpGet("predictive/anomalies/{machineId?}")]
        public async Task<ActionResult<List<AnomalyDetection>>> GetAnomalies(string machineId = "MOTOR-001")
        {
            try
            {
                var anomalies = await _engineService.DetectAnomalies(machineId);
                return Ok(anomalies);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting anomalies: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get anomalies", details = ex.Message });
            }
        }

        [HttpGet("predictive/predictions/{machineId?}")]
        public async Task<ActionResult<List<MaintenancePrediction>>> GetMaintenancePredictions(string machineId = "MOTOR-001")
        {
            try
            {
                var predictions = await _engineService.GenerateMaintenancePredictions(machineId);
                return Ok(predictions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting maintenance predictions: {ex.Message}");
                return StatusCode(500, new { error = "Failed to get maintenance predictions", details = ex.Message });
            }
        }

        // ========================================================================
        // HELPER METHODS
        // ========================================================================

        private string GenerateCsv(List<MotorReading> readings)
        {
            var csv = new System.Text.StringBuilder();
            csv.AppendLine("Id,Speed,Temperature,Timestamp,Title,MachineId,Status,Vibration,PowerConsumption,Efficiency,OperatingHours");
            
            foreach (var r in readings)
            {
                csv.AppendLine($"{r.Id},{r.Speed},{r.Temperature},{r.Timestamp:O},{r.Title},{r.MachineId},{r.Status},{r.Vibration},{r.PowerConsumption},{r.Efficiency},{r.OperatingHours}");
            }
            
            return csv.ToString();
        }

        private double CalculateTrend(List<double> values)
        {
            if (values.Count < 2) return 0.0;
            
            var firstHalf = values.Take(values.Count / 2).Average();
            var secondHalf = values.Skip(values.Count / 2).Average();
            
            return secondHalf - firstHalf;
        }
    }

    // ========================================================================
    // REQUEST MODELS
    // ========================================================================
    public class SetSpeedRequest
    {
        public double Speed { get; set; }
    }
}