using Microsoft.AspNetCore.Mvc;
using MotorServer.Models;
using MotorServer.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MotorServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnhancedIndustrialController : ControllerBase
    {
        private readonly EnhancedEngineService _enhancedEngineService;

        public EnhancedIndustrialController(EnhancedEngineService enhancedEngineService)
        {
            _enhancedEngineService = enhancedEngineService;
        }

        // Get all industrial machines
        [HttpGet("machines")]
        public async Task<ActionResult<List<IndustrialMachine>>> GetIndustrialMachines()
        {
            try
            {
                var machines = await _enhancedEngineService.GetIndustrialMachinesAsync();
                return Ok(machines);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving industrial machines: {ex.Message}");
            }
        }

        // Get specific machine by index
        [HttpGet("machines/{index}")]
        public async Task<ActionResult<IndustrialMachine>> GetMachine(int index)
        {
            try
            {
                var machines = await _enhancedEngineService.GetIndustrialMachinesAsync();
                if (index >= 0 && index < machines.Count)
                {
                    return Ok(machines[index]);
                }
                return NotFound($"Machine with index {index} not found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving machine: {ex.Message}");
            }
        }

        // Start a machine
        [HttpPost("machines/{index}/start")]
        public async Task<ActionResult> StartMachine(int index)
        {
            try
            {
                var result = await _enhancedEngineService.StartMachineAsync(index);
                if (result)
                {
                    return Ok(new { message = $"Machine {index} started successfully" });
                }
                return BadRequest($"Failed to start machine {index}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error starting machine: {ex.Message}");
            }
        }

        // Stop a machine
        [HttpPost("machines/{index}/stop")]
        public async Task<ActionResult> StopMachine(int index)
        {
            try
            {
                var result = await _enhancedEngineService.StopMachineAsync(index);
                if (result)
                {
                    return Ok(new { message = $"Machine {index} stopped successfully" });
                }
                return BadRequest($"Failed to stop machine {index}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error stopping machine: {ex.Message}");
            }
        }

        // Set machine target speed
        [HttpPost("machines/{index}/speed")]
        public async Task<ActionResult> SetMachineSpeed(int index, [FromBody] SetSpeedRequest request)
        {
            try
            {
                var result = await _enhancedEngineService.SetMachineTargetSpeedAsync(index, request.Speed);
                if (result)
                {
                    return Ok(new { message = $"Machine {index} target speed set to {request.Speed}" });
                }
                return BadRequest($"Failed to set machine {index} speed");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error setting machine speed: {ex.Message}");
            }
        }

        // Get edge computing nodes
        [HttpGet("edge-nodes")]
        public async Task<ActionResult<List<EdgeNode>>> GetEdgeNodes()
        {
            try
            {
                var nodes = await _enhancedEngineService.GetEdgeNodesAsync();
                return Ok(nodes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving edge nodes: {ex.Message}");
            }
        }

        // Get ML models
        [HttpGet("ml-models")]
        public async Task<ActionResult<List<MLModel>>> GetMLModels()
        {
            try
            {
                var models = await _enhancedEngineService.GetMLModelsAsync();
                return Ok(models);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving ML models: {ex.Message}");
            }
        }

        // Get system overview
        [HttpGet("system-overview")]
        public async Task<ActionResult<SystemOverview>> GetSystemOverview()
        {
            try
            {
                var overview = await _enhancedEngineService.GetSystemOverviewAsync();
                return Ok(overview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving system overview: {ex.Message}");
            }
        }

        // Get enhanced motor reading (includes all industrial data)
        [HttpGet("enhanced-reading")]
        public async Task<ActionResult<EnhancedMotorReading>> GetEnhancedReading()
        {
            try
            {
                var motorReading = await _enhancedEngineService.GetMotorReadingAsync();
                var machines = await _enhancedEngineService.GetIndustrialMachinesAsync();
                var edgeNodes = await _enhancedEngineService.GetEdgeNodesAsync();
                var mlModels = await _enhancedEngineService.GetMLModelsAsync();
                var systemOverview = await _enhancedEngineService.GetSystemOverviewAsync();

                var enhancedReading = new EnhancedMotorReading
                {
                    // Copy all motor reading properties
                    Speed = motorReading.Speed,
                    Temperature = motorReading.Temperature,
                    VibrationX = motorReading.VibrationX,
                    VibrationY = motorReading.VibrationY,
                    VibrationZ = motorReading.VibrationZ,
                    OilPressure = motorReading.OilPressure,
                    AirPressure = motorReading.AirPressure,
                    HydraulicPressure = motorReading.HydraulicPressure,
                    CoolantFlowRate = motorReading.CoolantFlowRate,
                    FuelFlowRate = motorReading.FuelFlowRate,
                    Voltage = motorReading.Voltage,
                    Current = motorReading.Current,
                    PowerFactor = motorReading.PowerFactor,
                    PowerConsumption = motorReading.PowerConsumption,
                    RPM = motorReading.RPM,
                    Torque = motorReading.Torque,
                    Efficiency = motorReading.Efficiency,
                    Humidity = motorReading.Humidity,
                    AmbientTemperature = motorReading.AmbientTemperature,
                    AmbientPressure = motorReading.AmbientPressure,
                    ShaftPosition = motorReading.ShaftPosition,
                    Displacement = motorReading.Displacement,
                    StrainGauge1 = motorReading.StrainGauge1,
                    StrainGauge2 = motorReading.StrainGauge2,
                    StrainGauge3 = motorReading.StrainGauge3,
                    SoundLevel = motorReading.SoundLevel,
                    BearingHealth = motorReading.BearingHealth,
                    OperatingHours = motorReading.OperatingHours,
                    OperatingMinutes = motorReading.OperatingMinutes,
                    OperatingSeconds = motorReading.OperatingSeconds,
                    MaintenanceStatus = motorReading.MaintenanceStatus,
                    SystemHealth = motorReading.SystemHealth,
                    Timestamp = motorReading.Timestamp,

                    // Add enhanced data
                    IndustrialMachines = machines,
                    EdgeNodes = edgeNodes,
                    MLModels = mlModels,
                    SystemOverview = systemOverview,
                    IsWorkingHours = systemOverview.IsWorkingHours,
                    SeasonalFactor = systemOverview.SeasonalFactor
                };

                return Ok(enhancedReading);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving enhanced reading: {ex.Message}");
            }
        }

        // Get production line analysis
        [HttpGet("production-line/{lineId}/business-insights")]
        public async Task<ActionResult<ProductionLineAnalysis>> GetProductionLineAnalysis(string lineId)
        {
            try
            {
                var machines = await _enhancedEngineService.GetIndustrialMachinesAsync();
                
                // Calculate dynamic production line metrics from actual machine data
                var onlineMachines = machines.Where(m => m.IsRunning).ToList();
                var totalMachines = machines.Count;
                var onlineCount = onlineMachines.Count;
                
                // Calculate weighted average efficiency based on power consumption
                var totalPower = machines.Sum(m => m.PowerConsumption);
                var weightedEfficiency = totalPower > 0 
                    ? machines.Sum(m => m.Efficiency * m.PowerConsumption) / totalPower 
                    : machines.Average(m => m.Efficiency);
                
                // Calculate total energy consumption
                var totalEnergyConsumption = machines.Sum(m => m.PowerConsumption);
                
                // Identify bottlenecks (machines with low efficiency or high maintenance needs)
                var bottlenecks = new List<string>();
                foreach (var machine in machines)
                {
                    if (machine.Efficiency < 85.0)
                    {
                        bottlenecks.Add($"{machine.Name} - Low efficiency ({machine.Efficiency:F1}%)");
                    }
                    if (machine.HealthScore < 70.0)
                    {
                        bottlenecks.Add($"{machine.Name} - Poor health score ({machine.HealthScore:F1}%)");
                    }
                }
                
                // Generate dynamic recommendations based on actual data
                var recommendations = new List<string>();
                
                if (weightedEfficiency < 90.0)
                {
                    recommendations.Add("Improve overall line efficiency through preventive maintenance");
                }
                
                if (onlineCount < totalMachines * 0.8)
                {
                    recommendations.Add("Increase machine uptime during working hours");
                }
                
                if (totalEnergyConsumption > 100.0)
                {
                    recommendations.Add("Optimize energy consumption through load balancing");
                }
                
                if (bottlenecks.Any())
                {
                    recommendations.Add("Address identified bottlenecks to improve throughput");
                }
                
                // Default recommendations if no specific issues found
                if (!recommendations.Any())
                {
                    recommendations.Add("Maintain current performance levels");
                    recommendations.Add("Consider capacity expansion opportunities");
                }

                var analysis = new ProductionLineAnalysis
                {
                    LineId = lineId,
                    LineName = $"Production Line {lineId}",
                    TotalMachines = totalMachines,
                    OnlineMachines = onlineCount,
                    OverallEfficiency = weightedEfficiency,
                    TotalEnergyConsumption = totalEnergyConsumption,
                    Bottlenecks = bottlenecks,
                    Recommendations = recommendations,
                    Throughput = Math.Min(100.0, weightedEfficiency * 0.95), // Throughput based on efficiency
                    QualityRate = Math.Min(100.0, weightedEfficiency * 1.02), // Quality rate slightly higher than efficiency
                    LastAnalysis = DateTime.UtcNow
                };

                return Ok(analysis);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving production line analysis: {ex.Message}");
            }
        }

        // Get maintenance schedule
        [HttpGet("maintenance-schedule/{facilityId}")]
        public async Task<ActionResult<MaintenanceSchedule>> GetMaintenanceSchedule(string facilityId)
        {
            try
            {
                var machines = await _enhancedEngineService.GetIndustrialMachinesAsync();
                var tasks = new List<MaintenanceTask>();
                var taskCounter = 1;

                // Generate dynamic maintenance tasks based on machine conditions
                foreach (var machine in machines)
                {
                    // Always include MOTOR-001 for routine maintenance
                    if (machine.Id == "MOTOR-001")
                    {
                        tasks.Add(new MaintenanceTask
                        {
                            TaskId = $"TASK-{taskCounter++:000}",
                            MachineName = machine.Name,
                            Description = "Routine maintenance for main drive motor",
                            TaskType = "Preventive",
                            Priority = "Medium",
                            ScheduledDate = DateTime.UtcNow.AddDays(1),
                            EstimatedDuration = 2.0,
                            EstimatedCost = 500.0,
                            RequiredSkills = new List<string> { "Mechanical", "Electrical", "Safety" },
                            Status = "Scheduled"
                        });
                    }

                    // Add tasks based on maintenance status
                    if (machine.MaintenanceStatus > 0)
                    {
                        var taskType = machine.MaintenanceStatus switch
                        {
                            1 => "Preventive",
                            2 => "Emergency",
                            3 => "Scheduled",
                            _ => "Preventive"
                        };

                        var priority = machine.MaintenanceStatus switch
                        {
                            1 => "High",
                            2 => "Critical",
                            3 => "Medium",
                            _ => "Medium"
                        };

                        var description = machine.MaintenanceStatus switch
                        {
                            1 => $"Performance degradation detected - {machine.Type.ToLower()} requires attention",
                            2 => $"Critical failure risk - immediate {machine.Type.ToLower()} maintenance required",
                            3 => $"Scheduled maintenance due for {machine.Type.ToLower()}",
                            _ => $"Routine maintenance for {machine.Type.ToLower()}"
                        };

                        var duration = machine.MaintenanceStatus switch
                        {
                            1 => 4.0 + (machine.PowerConsumption / 10.0), // Longer for high-power machines
                            2 => 8.0 + (machine.PowerConsumption / 5.0),  // Emergency repairs take longer
                            3 => 2.0 + (machine.PowerConsumption / 15.0), // Scheduled maintenance
                            _ => 2.0
                        };

                        var cost = machine.MaintenanceStatus switch
                        {
                            1 => 750.0 + (machine.PowerConsumption * 25.0), // Higher cost for complex machines
                            2 => 1500.0 + (machine.PowerConsumption * 50.0), // Emergency repairs are expensive
                            3 => 400.0 + (machine.PowerConsumption * 15.0), // Scheduled maintenance
                            _ => 500.0
                        };

                        var skills = new List<string> { "Mechanical" };
                        if (machine.PowerConsumption > 10.0) skills.Add("Electrical");
                        if (machine.PowerConsumption > 50.0) skills.Add("Heavy Machinery");
                        skills.Add("Safety");

                        tasks.Add(new MaintenanceTask
                        {
                            TaskId = $"TASK-{taskCounter++:000}",
                            MachineName = machine.Name,
                            Description = description,
                            TaskType = taskType,
                            Priority = priority,
                            ScheduledDate = DateTime.UtcNow.AddDays(machine.MaintenanceStatus == 2 ? 0 : machine.MaintenanceStatus),
                            EstimatedDuration = duration,
                            EstimatedCost = cost,
                            RequiredSkills = skills,
                            Status = "Scheduled"
                        });
                    }

                    // Add predictive maintenance tasks based on health score and operating hours
                    if (machine.HealthScore < 80.0 || machine.OperatingHours > 1000.0)
                    {
                        var urgency = machine.HealthScore < 60.0 ? 0 : 3; // Immediate if very low health
                        var predictiveDescription = machine.HealthScore < 60.0 
                            ? $"Predictive maintenance required - {machine.Type.ToLower()} health critical ({machine.HealthScore:F1}%)"
                            : $"Predictive maintenance recommended - {machine.Type.ToLower()} showing wear signs";

                        tasks.Add(new MaintenanceTask
                        {
                            TaskId = $"TASK-{taskCounter++:000}",
                            MachineName = machine.Name,
                            Description = predictiveDescription,
                            TaskType = "Predictive",
                            Priority = machine.HealthScore < 60.0 ? "Critical" : "High",
                            ScheduledDate = DateTime.UtcNow.AddDays(urgency),
                            EstimatedDuration = 3.0 + (machine.PowerConsumption / 20.0),
                            EstimatedCost = 600.0 + (machine.PowerConsumption * 20.0),
                            RequiredSkills = new List<string> { "Mechanical", "Predictive Analytics", "Safety" },
                            Status = "Scheduled"
                        });
                    }
                }

                // Calculate overdue tasks (tasks scheduled for yesterday or earlier)
                var overdueCount = tasks.Count(t => t.ScheduledDate < DateTime.UtcNow.AddDays(-1));

                var schedule = new MaintenanceSchedule
                {
                    FacilityId = facilityId,
                    ScheduledTasks = tasks,
                    LastUpdated = DateTime.UtcNow,
                    TotalTasks = tasks.Count,
                    CompletedTasks = 0, // Could be enhanced to track completed tasks
                    OverdueTasks = overdueCount
                };

                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving maintenance schedule: {ex.Message}");
            }
        }

        // Get quality control metrics
        [HttpGet("quality-control/{machineId}")]
        public async Task<ActionResult<QualityControlMetrics>> GetQualityControlMetrics(string machineId)
        {
            try
            {
                var machines = await _enhancedEngineService.GetIndustrialMachinesAsync();
                
                // Calculate dynamic quality metrics based on machine performance
                var totalMachines = machines.Count;
                var onlineMachines = machines.Where(m => m.IsRunning).Count();
                
                // Calculate overall quality score based on machine health and efficiency
                var averageHealth = machines.Average(m => m.HealthScore);
                var averageEfficiency = machines.Average(m => m.Efficiency);
                var qualityScore = Math.Min(100.0, (averageHealth * 0.6 + averageEfficiency * 0.4));
                
                // Calculate defect rate based on maintenance status and health
                var machinesNeedingMaintenance = machines.Count(m => m.MaintenanceStatus > 0);
                var machinesWithPoorHealth = machines.Count(m => m.HealthScore < 70.0);
                var totalIssues = machinesNeedingMaintenance + machinesWithPoorHealth;
                var defectRate = Math.Min(10.0, (double)totalIssues / totalMachines * 100.0);
                
                // Generate inspection data based on machine activity
                var baseInspections = onlineMachines * 50; // More inspections for online machines
                var randomFactor = new Random().Next(80, 120); // Add some variation
                var totalInspections = (int)(baseInspections * randomFactor / 100.0);
                
                // Calculate passed/failed inspections based on quality score
                var passRate = qualityScore / 100.0;
                var passedInspections = (int)(totalInspections * passRate);
                var failedInspections = totalInspections - passedInspections;
                
                // Generate dynamic common defects based on machine conditions
                var commonDefects = new List<string>();
                
                if (machines.Any(m => m.HealthScore < 75.0))
                    commonDefects.Add("Component wear and tear");
                
                if (machines.Any(m => m.Efficiency < 85.0))
                    commonDefects.Add("Performance degradation");
                
                if (machines.Any(m => m.MaintenanceStatus == 2))
                    commonDefects.Add("Critical component failure");
                
                if (machines.Any(m => m.PowerConsumption > 50.0 && m.Efficiency < 90.0))
                    commonDefects.Add("Energy efficiency issues");
                
                if (machines.Any(m => m.OperatingHours > 800.0))
                    commonDefects.Add("Age-related deterioration");
                
                // Add some standard defects if no specific issues found
                if (!commonDefects.Any())
                {
                    commonDefects.AddRange(new List<string>
                    {
                        "Surface finish variation",
                        "Dimensional tolerance",
                        "Assembly alignment"
                    });
                }
                
                // Generate dynamic quality recommendations based on actual issues
                var recommendations = new List<string>();
                
                if (averageHealth < 80.0)
                    recommendations.Add("Implement preventive maintenance program");
                
                if (averageEfficiency < 90.0)
                    recommendations.Add("Optimize machine operating parameters");
                
                if (machinesWithPoorHealth > totalMachines * 0.3)
                    recommendations.Add("Schedule comprehensive equipment overhaul");
                
                if (defectRate > 5.0)
                    recommendations.Add("Enhance quality control procedures");
                
                if (machines.Any(m => m.MaintenanceStatus == 2))
                    recommendations.Add("Address critical maintenance issues immediately");
                
                if (onlineMachines < totalMachines * 0.8)
                    recommendations.Add("Improve machine uptime and availability");
                
                // Default recommendations if no specific issues
                if (!recommendations.Any())
                {
                    recommendations.AddRange(new List<string>
                    {
                        "Maintain current quality standards",
                        "Continue regular inspection schedule",
                        "Monitor performance trends"
                    });
                }

                var metrics = new QualityControlMetrics
                {
                    MachineId = machineId,
                    QualityScore = Math.Round(qualityScore, 1),
                    DefectRate = Math.Round(defectRate, 1),
                    TotalInspections = totalInspections,
                    PassedInspections = passedInspections,
                    FailedInspections = failedInspections,
                    CommonDefects = commonDefects.Take(5).ToList(), // Limit to 5 most relevant
                    QualityRecommendations = recommendations.Take(3).ToList(), // Limit to 3 recommendations
                    LastUpdated = DateTime.UtcNow
                };

                return Ok(metrics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving quality control metrics: {ex.Message}");
            }
        }

        // Get supply chain optimization
        [HttpGet("supply-chain/{facilityId}")]
        public async Task<ActionResult<SupplyChainOptimization>> GetSupplyChainOptimization(string facilityId)
        {
            try
            {
                var machines = await _enhancedEngineService.GetIndustrialMachinesAsync();
                
                // Calculate dynamic supply chain metrics based on machine performance
                var totalMachines = machines.Count;
                var onlineMachines = machines.Where(m => m.IsRunning).Count();
                var totalPowerConsumption = machines.Sum(m => m.PowerConsumption);
                var averageEfficiency = machines.Average(m => m.Efficiency);
                var averageHealth = machines.Average(m => m.HealthScore);
                
                // Calculate inventory turnover based on machine efficiency and usage
                var baseTurnover = averageEfficiency / 10.0; // More efficient machines = higher turnover
                var powerFactor = Math.Min(2.0, totalPowerConsumption / 100.0); // High power = more consumption
                var inventoryTurnover = Math.Round(baseTurnover * powerFactor, 1);
                
                // Calculate inventory value based on machine complexity and power
                var baseInventoryValue = 50000.0; // Base value
                var machineValue = totalMachines * 8000.0; // Value per machine
                var powerValue = totalPowerConsumption * 200.0; // Value based on power consumption
                var inventoryValue = baseInventoryValue + machineValue + powerValue;
                
                // Calculate stockouts based on maintenance status and health
                var machinesNeedingMaintenance = machines.Count(m => m.MaintenanceStatus > 0);
                var machinesWithPoorHealth = machines.Count(m => m.HealthScore < 70.0);
                var stockouts = Math.Min(10, machinesNeedingMaintenance + machinesWithPoorHealth);
                
                // Calculate overstock items based on efficiency and health
                var overstockThreshold = averageEfficiency < 85.0 || averageHealth < 80.0 ? 8 : 3;
                var overstockItems = Math.Min(15, overstockThreshold + (totalMachines - onlineMachines));
                
                // Generate dynamic critical inventory items based on machine types and conditions
                var criticalItems = new List<InventoryItem>();
                
                // Motor bearings based on MOTOR-001 condition
                var motorMachine = machines.FirstOrDefault(m => m.Id == "MOTOR-001");
                if (motorMachine != null)
                {
                    var bearingStock = Math.Max(10, 50 - (int)(motorMachine.OperatingHours / 100));
                    var bearingStatus = bearingStock < 50 ? "Low Stock" : "In Stock";
                    criticalItems.Add(new InventoryItem
                    {
                        ItemId = "ITEM-001",
                        Name = "Motor Bearings",
                        CurrentStock = bearingStock,
                        MinimumStock = 50,
                        MaximumStock = 200,
                        UnitCost = 125.50,
                        Status = bearingStatus,
                        NextRestockDate = DateTime.UtcNow.AddDays(bearingStatus == "Low Stock" ? 2 : 7),
                        Supplier = "Bearings Inc."
                    });
                }
                
                // Hydraulic oil based on machine count and power consumption
                var oilConsumption = (int)(totalPowerConsumption / 20.0);
                var oilStock = Math.Max(50, 150 - oilConsumption);
                var oilStatus = oilStock < 100 ? "Low Stock" : "In Stock";
                criticalItems.Add(new InventoryItem
                {
                    ItemId = "ITEM-002",
                    Name = "Hydraulic Oil",
                    CurrentStock = oilStock,
                    MinimumStock = 100,
                    MaximumStock = 500,
                    UnitCost = 45.75,
                    Status = oilStatus,
                    NextRestockDate = DateTime.UtcNow.AddDays(oilStatus == "Low Stock" ? 3 : 12),
                    Supplier = "Lubricants Co."
                });
                
                // Electrical components based on high-power machines
                var highPowerMachines = machines.Count(m => m.PowerConsumption > 20.0);
                if (highPowerMachines > 0)
                {
                    var electricalStock = Math.Max(20, 80 - (highPowerMachines * 5));
                    var electricalStatus = electricalStock < 40 ? "Low Stock" : "In Stock";
                    criticalItems.Add(new InventoryItem
                    {
                        ItemId = "ITEM-003",
                        Name = "Electrical Components",
                        CurrentStock = electricalStock,
                        MinimumStock = 40,
                        MaximumStock = 150,
                        UnitCost = 89.25,
                        Status = electricalStatus,
                        NextRestockDate = DateTime.UtcNow.AddDays(electricalStatus == "Low Stock" ? 1 : 10),
                        Supplier = "ElectroParts Ltd."
                    });
                }
                
                // Safety equipment based on maintenance needs
                var maintenanceNeeded = machines.Count(m => m.MaintenanceStatus > 1);
                if (maintenanceNeeded > 0)
                {
                    var safetyStock = Math.Max(15, 50 - (maintenanceNeeded * 3));
                    var safetyStatus = safetyStock < 25 ? "Low Stock" : "In Stock";
                    criticalItems.Add(new InventoryItem
                    {
                        ItemId = "ITEM-004",
                        Name = "Safety Equipment",
                        CurrentStock = safetyStock,
                        MinimumStock = 25,
                        MaximumStock = 100,
                        UnitCost = 156.80,
                        Status = safetyStatus,
                        NextRestockDate = DateTime.UtcNow.AddDays(safetyStatus == "Low Stock" ? 1 : 8),
                        Supplier = "SafetyFirst Corp."
                    });
                }
                
                // Generate dynamic recommendations based on actual conditions
                var recommendations = new List<string>();
                
                if (inventoryTurnover < 6.0)
                    recommendations.Add("Improve inventory turnover through better demand forecasting");
                
                if (stockouts > 3)
                    recommendations.Add("Increase safety stock levels for critical items");
                
                if (overstockItems > 5)
                    recommendations.Add("Implement just-in-time inventory management");
                
                if (averageEfficiency < 85.0)
                    recommendations.Add("Optimize procurement based on machine performance data");
                
                if (averageHealth < 80.0)
                    recommendations.Add("Adjust inventory levels based on equipment health trends");
                
                if (onlineMachines < totalMachines * 0.8)
                    recommendations.Add("Reduce inventory holding costs during low production periods");
                
                // Default recommendations if no specific issues
                if (!recommendations.Any())
                {
                    recommendations.AddRange(new List<string>
                    {
                        "Maintain current inventory optimization levels",
                        "Continue monitoring supplier performance",
                        "Regular review of reorder points"
                    });
                }

                var optimization = new SupplyChainOptimization
                {
                    FacilityId = facilityId,
                    InventoryTurnover = inventoryTurnover,
                    InventoryValue = Math.Round(inventoryValue, 0),
                    Stockouts = stockouts,
                    OverstockItems = overstockItems,
                    CriticalItems = criticalItems,
                    OptimizationRecommendations = recommendations.Take(3).ToList(),
                    LastUpdated = DateTime.UtcNow
                };

                return Ok(optimization);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving supply chain optimization: {ex.Message}");
            }
        }

        // Get facility overview
        [HttpGet("facility-overview/{facilityId}")]
        public async Task<ActionResult<FacilityOverview>> GetFacilityOverview(string facilityId)
        {
            try
            {
                var systemOverview = await _enhancedEngineService.GetSystemOverviewAsync();
                var machines = await _enhancedEngineService.GetIndustrialMachinesAsync();

                // Generate dynamic production lines based on machine distribution
                var productionLines = new List<string>();
                var machinesPerLine = Math.Max(1, machines.Count / 3); // Distribute machines across 3 lines
                
                for (int i = 0; i < 3; i++)
                {
                    var lineName = $"Line {(char)('A' + i)}";
                    var lineMachines = machines.Skip(i * machinesPerLine).Take(machinesPerLine);
                    var onlineInLine = lineMachines.Count(m => m.IsRunning);
                    
                    if (onlineInLine > 0 || lineMachines.Any())
                    {
                        productionLines.Add(lineName);
                    }
                }
                
                // Generate dynamic departments based on machine types and operational needs
                var departments = new List<string> { "Production" }; // Always have production
                
                // Add Quality department if there are machines with maintenance issues
                if (machines.Any(m => m.MaintenanceStatus > 0 || m.HealthScore < 80.0))
                {
                    departments.Add("Quality");
                }
                
                // Add Maintenance department if there are machines needing maintenance
                if (machines.Any(m => m.MaintenanceStatus > 1))
                {
                    departments.Add("Maintenance");
                }
                
                // Add Logistics department if there are multiple machine types
                var machineTypes = machines.Select(m => m.Type).Distinct().Count();
                if (machineTypes > 3)
                {
                    departments.Add("Logistics");
                }
                
                // Add Engineering department if there are high-power machines
                if (machines.Any(m => m.PowerConsumption > 30.0))
                {
                    departments.Add("Engineering");
                }

                var overview = new FacilityOverview
                {
                    FacilityId = facilityId,
                    TotalMachines = systemOverview.TotalMachines,
                    OnlineMachines = systemOverview.OnlineMachines,
                    OverallEfficiency = systemOverview.OverallEfficiency,
                    TotalEnergyConsumption = systemOverview.TotalPowerConsumption,
                    TotalOperatingCost = systemOverview.TotalPowerConsumption * 0.12, // $0.12 per kWh
                    ProductionLines = productionLines,
                    Departments = departments,
                    LastUpdated = DateTime.UtcNow
                };

                return Ok(overview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving facility overview: {ex.Message}");
            }
        }
    }

    // Request models
    public class SetSpeedRequest
    {
        public double Speed { get; set; }
    }
}
