using Microsoft.EntityFrameworkCore;
using MotorServer.Models;
using MotorServer.Data;
using MotorServer.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MotorServer.Services
{
    public class IndustrialManagementService
    {
        private readonly AppDbContext _db;
        private readonly IHubContext<MotorHub> _hub;

        public IndustrialManagementService(AppDbContext db, IHubContext<MotorHub> hub)
        {
            _db = db;
            _hub = hub;
        }

        public async Task<List<IndustrialMachine>> GetIndustrialMachines()
        {
            return await _db.IndustrialMachines.ToListAsync();
        }

        public async Task<IndustrialMachine> CreateMachine(IndustrialMachine machine)
        {
            _db.IndustrialMachines.Add(machine);
            await _db.SaveChangesAsync();
            
            // Notify clients about new machine
            await _hub.Clients.All.SendAsync("MachineAdded", machine);
            
            return machine;
        }

        public async Task<IndustrialMachine?> UpdateMachine(string machineId, IndustrialMachine updatedMachine)
        {
            var machine = await _db.IndustrialMachines.FirstOrDefaultAsync(m => m.MachineId == machineId);
            if (machine == null) return null;

            machine.Name = updatedMachine.Name;
            machine.Type = updatedMachine.Type;
            machine.Location = updatedMachine.Location;
            machine.Status = updatedMachine.Status;
            machine.LastSeen = updatedMachine.LastSeen;
            machine.TotalReadings = updatedMachine.TotalReadings;
            machine.AverageEfficiency = updatedMachine.AverageEfficiency;
            machine.MaintenanceSchedule = updatedMachine.MaintenanceSchedule;
            machine.OperatingHours = updatedMachine.OperatingHours;
            machine.EnergyConsumption = updatedMachine.EnergyConsumption;
            machine.CostPerHour = updatedMachine.CostPerHour;

            await _db.SaveChangesAsync();
            
            // Notify clients about machine update
            await _hub.Clients.All.SendAsync("MachineUpdated", machine);
            
            return machine;
        }

        public async Task<ProductionLineAnalysis> AnalyzeProductionLine(string lineId)
        {
            var machines = await _db.IndustrialMachines
                .Where(m => m.ProductionLineId == lineId)
                .ToListAsync();

            if (!machines.Any())
            {
                return new ProductionLineAnalysis
                {
                    LineId = lineId,
                    AnalysisTimestamp = DateTime.UtcNow,
                    TotalMachines = 0,
                    OnlineMachines = 0,
                    OverallEfficiency = 0,
                    TotalEnergyConsumption = 0,
                    Bottlenecks = new List<string>(),
                    Recommendations = new List<string> { "No machines found in production line" }
                };
            }

            var onlineMachines = machines.Count(m => m.Status == "online");
            var avgEfficiency = machines.Average(m => m.AverageEfficiency);
            var totalEnergy = machines.Sum(m => m.EnergyConsumption);
            var totalCost = (double)machines.Sum(m => m.CostPerHour);

            // Identify bottlenecks
            var bottlenecks = new List<string>();
            var lowEfficiencyMachines = machines.Where(m => m.AverageEfficiency < 80).ToList();
            if (lowEfficiencyMachines.Any())
            {
                bottlenecks.Add($"Low efficiency machines: {string.Join(", ", lowEfficiencyMachines.Select(m => m.Name))}");
            }

            var offlineMachines = machines.Where(m => m.Status == "offline").ToList();
            if (offlineMachines.Any())
            {
                bottlenecks.Add($"Offline machines: {string.Join(", ", offlineMachines.Select(m => m.Name))}");
            }

            // Generate recommendations
            var recommendations = new List<string>();
            if (avgEfficiency < 85)
            {
                recommendations.Add("🔧 Optimize production line efficiency - consider maintenance scheduling");
            }
            if (totalEnergy > 1000) // High energy consumption threshold
            {
                recommendations.Add("⚡ Review energy consumption - implement energy-saving measures");
            }
            if (onlineMachines < machines.Count)
            {
                recommendations.Add("🚨 Address offline machines to improve production capacity");
            }

            return new ProductionLineAnalysis
            {
                LineId = lineId,
                AnalysisTimestamp = DateTime.UtcNow,
                TotalMachines = machines.Count,
                OnlineMachines = onlineMachines,
                OverallEfficiency = Math.Round(avgEfficiency, 2),
                TotalEnergyConsumption = Math.Round(totalEnergy, 2),
                TotalOperatingCost = Math.Round(totalCost, 2),
                Bottlenecks = bottlenecks,
                Recommendations = recommendations,
                MachineDetails = machines.Select(m => new MachineSummary
                {
                    MachineId = m.MachineId,
                    Name = m.Name,
                    Status = m.Status,
                    Efficiency = m.AverageEfficiency,
                    EnergyConsumption = m.EnergyConsumption,
                    LastSeen = m.LastSeen
                }).ToList()
            };
        }

        public async Task<EnergyAnalysis> AnalyzeEnergyConsumption(string facilityId = "FACILITY-001")
        {
            var machines = await _db.IndustrialMachines
                .Where(m => m.FacilityId == facilityId)
                .ToListAsync();

            if (!machines.Any())
            {
                return new EnergyAnalysis
                {
                    FacilityId = facilityId,
                    AnalysisPeriod = "24 hours",
                    TotalEnergyConsumption = 0,
                    AveragePowerFactor = 0,
                    EnergyEfficiency = 0,
                    CostSavingsPotential = 0,
                    Recommendations = new List<string> { "No machines found in facility" }
                };
            }

            var totalEnergy = machines.Sum(m => m.EnergyConsumption);
            var avgPowerFactor = machines.Average(m => m.PowerFactor ?? 0.9);
            var energyEfficiency = machines.Average(m => m.AverageEfficiency);
            var costSavingsPotential = totalEnergy * 0.15; // 15% potential savings

            var recommendations = new List<string>();
            if (avgPowerFactor < 0.9)
            {
                recommendations.Add("⚡ Improve power factor - consider power factor correction");
            }
            if (energyEfficiency < 85)
            {
                recommendations.Add("🔧 Optimize machine efficiency to reduce energy consumption");
            }
            if (totalEnergy > 500)
            {
                recommendations.Add("💰 Implement energy management system for cost savings");
            }

            return new EnergyAnalysis
            {
                FacilityId = facilityId,
                AnalysisPeriod = "24 hours",
                TotalEnergyConsumption = Math.Round(totalEnergy, 2),
                AveragePowerFactor = Math.Round(avgPowerFactor, 3),
                EnergyEfficiency = Math.Round(energyEfficiency, 2),
                CostSavingsPotential = Math.Round(costSavingsPotential, 2),
                Recommendations = recommendations
            };
        }

        public async Task<MaintenanceSchedule> GenerateMaintenanceSchedule(string facilityId = "FACILITY-001")
        {
            var machines = await _db.IndustrialMachines
                .Where(m => m.FacilityId == facilityId)
                .ToListAsync();

            var schedule = new MaintenanceSchedule
            {
                FacilityId = facilityId,
                GeneratedAt = DateTime.UtcNow,
                ScheduledTasks = new List<MaintenanceTask>()
            };

            foreach (var machine in machines)
            {
                // Determine maintenance priority based on various factors
                var priority = DetermineMaintenancePriority(machine);
                
                if (priority != "None")
                {
                    var task = new MaintenanceTask
                    {
                        TaskId = Guid.NewGuid().ToString(),
                        MachineId = machine.MachineId,
                        MachineName = machine.Name,
                        TaskType = priority == "Critical" ? "Emergency" : priority == "High" ? "Preventive" : "Routine",
                        Priority = priority,
                        ScheduledDate = CalculateScheduledDate(machine, priority),
                        EstimatedDuration = CalculateDuration(machine.Type, priority),
                        RequiredSkills = GetRequiredSkills(machine.Type),
                        EstimatedCost = CalculateCost(machine.Type, priority),
                        Description = GenerateTaskDescription(machine, priority)
                    };

                    schedule.ScheduledTasks.Add(task);
                }
            }

            // Sort by priority and date
            schedule.ScheduledTasks = schedule.ScheduledTasks
                .OrderBy(t => t.Priority == "Critical" ? 1 : t.Priority == "High" ? 2 : t.Priority == "Medium" ? 3 : 4)
                .ThenBy(t => t.ScheduledDate)
                .ToList();

            return schedule;
        }

        private string DetermineMaintenancePriority(IndustrialMachine machine)
        {
            if (machine.Status == "offline") return "Critical";
            if (machine.AverageEfficiency < 70) return "Critical";
            if (machine.OperatingHours > 2000) return "High";
            if (machine.AverageEfficiency < 85) return "High";
            if (machine.OperatingHours > 1500) return "Medium";
            return "None";
        }

        private DateTime CalculateScheduledDate(IndustrialMachine machine, string priority)
        {
            var baseDate = DateTime.UtcNow;
            return priority switch
            {
                "Critical" => baseDate.AddHours(2),
                "High" => baseDate.AddDays(1),
                "Medium" => baseDate.AddDays(7),
                _ => baseDate.AddDays(30)
            };
        }

        private int CalculateDuration(string machineType, string priority)
        {
            var baseHours = machineType switch
            {
                "Motor" => 4,
                "Pump" => 3,
                "Compressor" => 6,
                "Generator" => 8,
                _ => 4
            };

            return priority switch
            {
                "Critical" => baseHours,
                "High" => baseHours + 2,
                "Medium" => baseHours + 4,
                _ => baseHours + 8
            };
        }

        private List<string> GetRequiredSkills(string machineType)
        {
            return machineType switch
            {
                "Motor" => new List<string> { "Electrical", "Mechanical" },
                "Pump" => new List<string> { "Mechanical", "Hydraulic" },
                "Compressor" => new List<string> { "Mechanical", "Pneumatic" },
                "Generator" => new List<string> { "Electrical", "Mechanical", "Control Systems" },
                _ => new List<string> { "General Maintenance" }
            };
        }

        private decimal CalculateCost(string machineType, string priority)
        {
            var baseCost = machineType switch
            {
                "Motor" => 500m,
                "Pump" => 400m,
                "Compressor" => 800m,
                "Generator" => 1200m,
                _ => 500m
            };

            return priority switch
            {
                "Critical" => baseCost * 1.5m,
                "High" => baseCost * 1.2m,
                "Medium" => baseCost,
                _ => baseCost * 0.8m
            };
        }

        private string GenerateTaskDescription(IndustrialMachine machine, string priority)
        {
            return priority switch
            {
                "Critical" => $"Emergency maintenance required for {machine.Name} - {machine.Status} status",
                "High" => $"Preventive maintenance for {machine.Name} - efficiency at {machine.AverageEfficiency}%",
                "Medium" => $"Routine maintenance for {machine.Name} - {machine.OperatingHours} operating hours",
                _ => $"Scheduled maintenance for {machine.Name}"
            };
        }
    }
}
