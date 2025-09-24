using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using MotorServer.Models;

namespace MotorServer.Services
{
    public class EnhancedEngineService
    {
        // Import the enhanced C++ engine functions
        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetIndustrialMachineCount();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr GetMachineId(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr GetMachineName(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetMachineType(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern bool GetMachineRunning(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMachineSpeed(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMachineTemperature(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMachineLoad(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMachineEfficiency(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMachinePowerConsumption(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMachineVibration(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMachineHealthScore(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetMachineMaintenanceStatus(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern void StartMachine(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern void StopMachine(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern void SetMachineTargetSpeed(int index, double speed);

        // Edge Computing Functions
        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetEdgeNodeCount();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr GetEdgeNodeId(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr GetEdgeNodeName(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetEdgeNodeCpuUsage(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetEdgeNodeMemoryUsage(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetEdgeNodeNetworkLatency(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetEdgeNodeProcessingTime(int index);

        // ML Model Functions
        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetMLModelCount();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr GetMLModelId(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr GetMLModelName(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMLModelAccuracy(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMLModelConfidence(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMLModelFailureProbability(int index);

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetMLModelRemainingUsefulLife(int index);

        // System Status Functions
        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetSystemOverallEfficiency();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetSystemTotalPowerConsumption();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetSystemHealthScore();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern bool GetIsWorkingHours();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetSeasonalFactor();

        // Legacy Functions
        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetMotorSpeed();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetMotorTemperature();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetVibrationX();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetVibrationY();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetVibrationZ();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetOilPressure();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetAirPressure();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetHydraulicPressure();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetCoolantFlowRate();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetFuelFlowRate();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetVoltage();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetCurrent();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetPowerFactor();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetPowerConsumption();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetRPM();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetTorque();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetEfficiency();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetHumidity();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetAmbientTemperature();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetAmbientPressure();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetShaftPosition();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetDisplacement();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetStrainGauge1();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetStrainGauge2();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetStrainGauge3();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetSoundLevel();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetBearingHealth();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetOperatingHours();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetOperatingMinutes();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern double GetOperatingSeconds();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetMaintenanceStatus();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern int GetSystemHealth();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern void StartMotor();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern void StopMotor();

        [DllImport("enhanced_motor_engine", CallingConvention = CallingConvention.Cdecl)]
        private static extern void ResetMotorState();

        // Helper method to convert IntPtr to string
        private static string IntPtrToString(IntPtr ptr)
        {
            return Marshal.PtrToStringAnsi(ptr) ?? "Unknown";
        }

        // Machine Type to String conversion
        private static string GetMachineTypeString(int machineType)
        {
            return machineType switch
            {
                0 => "Motor",
                1 => "Pump",
                2 => "Conveyor",
                3 => "Compressor",
                4 => "Fan",
                5 => "Generator",
                6 => "Turbine",
                7 => "Crusher",
                8 => "Mixer",
                9 => "Press",
                _ => "Unknown"
            };
        }

        // Get all industrial machines
        public async Task<List<IndustrialMachine>> GetIndustrialMachinesAsync()
        {
            var machines = new List<IndustrialMachine>();
            int machineCount = GetIndustrialMachineCount();

            for (int i = 0; i < machineCount; i++)
            {
                var machine = new IndustrialMachine
                {
                    Id = IntPtrToString(GetMachineId(i)),
                    Name = IntPtrToString(GetMachineName(i)),
                    Type = GetMachineTypeString(GetMachineType(i)),
                    IsRunning = GetMachineRunning(i),
                    CurrentSpeed = GetMachineSpeed(i),
                    Temperature = GetMachineTemperature(i),
                    Load = GetMachineLoad(i),
                    Efficiency = GetMachineEfficiency(i),
                    PowerConsumption = GetMachinePowerConsumption(i),
                    Vibration = GetMachineVibration(i),
                    HealthScore = GetMachineHealthScore(i),
                    MaintenanceStatus = GetMachineMaintenanceStatus(i),
                    LastSeen = DateTime.UtcNow,
                    Location = $"Building {i % 3 + 1}, Floor {(i % 2) + 1}",
                    Department = i < 3 ? "Production" : i < 6 ? "Utilities" : "Maintenance"
                };

                machines.Add(machine);
            }

            return await Task.FromResult(machines);
        }

        // Get edge computing nodes
        public async Task<List<EdgeNode>> GetEdgeNodesAsync()
        {
            var nodes = new List<EdgeNode>();
            int nodeCount = GetEdgeNodeCount();

            for (int i = 0; i < nodeCount; i++)
            {
                // Get dynamic values from C++ engine
                var cpuUsage = GetEdgeNodeCpuUsage(i);
                var memoryUsage = GetEdgeNodeMemoryUsage(i);
                var networkLatency = GetEdgeNodeNetworkLatency(i);
                var processingTime = GetEdgeNodeProcessingTime(i);
                
                // Calculate dynamic status based on real-world physics formulas
                // Edge node is considered online if:
                // 1. CPU usage is reasonable (< 95%)
                // 2. Memory usage is reasonable (< 90%)
                // 3. Network latency is acceptable (< 100ms)
                // 4. Processing time is within limits (< 5 seconds)
                var isHealthy = cpuUsage < 95.0 && 
                               memoryUsage < 90.0 && 
                               networkLatency < 100.0 && 
                               processingTime < 5.0;
                
                // Calculate temperature based on CPU usage and processing load
                // Physics formula: T = T_ambient + (CPU_usage * 0.3) + (Processing_time * 0.1)
                var ambientTemp = 25.0; // Room temperature
                var temperature = ambientTemp + (cpuUsage * 0.3) + (processingTime * 0.1);
                
                // Calculate power consumption based on CPU, memory, and processing load
                // Physics formula: P = P_base + (CPU * 0.8) + (Memory * 0.2) + (Processing * 0.5)
                var basePower = 15.0; // Base power consumption in watts
                var powerConsumption = basePower + (cpuUsage * 0.8) + (memoryUsage * 0.2) + (processingTime * 0.5);
                
                var node = new EdgeNode
                {
                    Id = IntPtrToString(GetEdgeNodeId(i)),
                    Name = IntPtrToString(GetEdgeNodeName(i)),
                    Location = $"Building {i % 3 + 1}, Floor {(i % 2) + 1}",
                    CpuUsage = cpuUsage,
                    MemoryUsage = memoryUsage,
                    NetworkLatency = networkLatency,
                    ProcessingTime = processingTime,
                    StorageUsed = 8.2 + (i * 2.5),
                    BandwidthUsage = 65.0 + (i * 10),
                    IsOnline = isHealthy,
                    Status = isHealthy ? "online" : "offline", // Set status based on health calculation
                    ConnectedMachines = 2 + i,
                    LastSync = DateTime.UtcNow,
                    Temperature = temperature,
                    PowerConsumption = powerConsumption
                };

                nodes.Add(node);
            }

            return await Task.FromResult(nodes);
        }

        // Get ML models
        public async Task<List<MLModel>> GetMLModelsAsync()
        {
            var models = new List<MLModel>();
            int modelCount = GetMLModelCount();

            for (int i = 0; i < modelCount; i++)
            {
                var model = new MLModel
                {
                    Id = IntPtrToString(GetMLModelId(i)),
                    Name = IntPtrToString(GetMLModelName(i)),
                    Accuracy = GetMLModelAccuracy(i),
                    Confidence = GetMLModelConfidence(i),
                    FailureProbability = GetMLModelFailureProbability(i),
                    RemainingUsefulLife = GetMLModelRemainingUsefulLife(i),
                    LastTraining = DateTime.UtcNow.AddDays(-7),
                    PredictionCount = 1000 + (i * 500)
                };

                models.Add(model);
            }

            return await Task.FromResult(models);
        }

        // Get system overview
        public async Task<SystemOverview> GetSystemOverviewAsync()
        {
            var overview = new SystemOverview
            {
                TotalMachines = GetIndustrialMachineCount(),
                OnlineMachines = GetIndustrialMachineCount(), // All machines are online in mock
                OverallEfficiency = GetSystemOverallEfficiency(),
                TotalPowerConsumption = GetSystemTotalPowerConsumption(),
                SystemHealthScore = GetSystemHealthScore(),
                IsWorkingHours = GetIsWorkingHours(),
                SeasonalFactor = GetSeasonalFactor(),
                LastUpdated = DateTime.UtcNow
            };

            return await Task.FromResult(overview);
        }

        // Control functions
        public async Task<bool> StartMachineAsync(int machineIndex)
        {
            try
            {
                StartMachine(machineIndex);
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<bool> StopMachineAsync(int machineIndex)
        {
            try
            {
                StopMachine(machineIndex);
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<bool> SetMachineTargetSpeedAsync(int machineIndex, double speed)
        {
            try
            {
                SetMachineTargetSpeed(machineIndex, speed);
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        // Legacy functions for backward compatibility
        public async Task<MotorReading> GetMotorReadingAsync()
        {
            var reading = new MotorReading
            {
                Speed = GetMotorSpeed(),
                Temperature = GetMotorTemperature(),
                VibrationX = GetVibrationX(),
                VibrationY = GetVibrationY(),
                VibrationZ = GetVibrationZ(),
                OilPressure = GetOilPressure(),
                AirPressure = GetAirPressure(),
                HydraulicPressure = GetHydraulicPressure(),
                CoolantFlowRate = GetCoolantFlowRate(),
                FuelFlowRate = GetFuelFlowRate(),
                Voltage = GetVoltage(),
                Current = GetCurrent(),
                PowerFactor = GetPowerFactor(),
                PowerConsumption = GetPowerConsumption(),
                RPM = GetRPM(),
                Torque = GetTorque(),
                Efficiency = GetEfficiency(),
                Humidity = GetHumidity(),
                AmbientTemperature = GetAmbientTemperature(),
                AmbientPressure = GetAmbientPressure(),
                ShaftPosition = GetShaftPosition(),
                Displacement = GetDisplacement(),
                StrainGauge1 = GetStrainGauge1(),
                StrainGauge2 = GetStrainGauge2(),
                StrainGauge3 = GetStrainGauge3(),
                SoundLevel = GetSoundLevel(),
                BearingHealth = GetBearingHealth(),
                OperatingHours = GetOperatingHours(),
                OperatingMinutes = GetOperatingMinutes(),
                OperatingSeconds = GetOperatingSeconds(),
                MaintenanceStatus = GetMaintenanceStatus(),
                SystemHealth = GetSystemHealth(),
                Timestamp = DateTime.UtcNow
            };

            return await Task.FromResult(reading);
        }

        public async Task<bool> StartMotorAsync()
        {
            try
            {
                StartMotor();
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<bool> StopMotorAsync()
        {
            try
            {
                StopMotor();
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<bool> ResetMotorStateAsync()
        {
            try
            {
                ResetMotorState();
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }
    }
}
