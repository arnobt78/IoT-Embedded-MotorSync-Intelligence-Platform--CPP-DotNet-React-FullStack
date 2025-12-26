// ========================================================================
// DATABASE SEED SCRIPT FOR MOTOR ENGINE
// Migrates data from CSV files to PostgreSQL database
//
// Migration Status: ✅ READY
// - Migrates MotorReadings from CSV to Hetzner VPS PostgreSQL database
//
// Usage:
//   dotnet run -- seed
//
// Note: This script uses upsert pattern, so it's safe to run multiple times.
// It will update existing records or create new ones.
// ========================================================================

using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MotorServer.Data;
using MotorServer.Models;
using DotNetEnv;
using Npgsql;

namespace MotorServer
{
    public class SeedDatabase
    {
        // CSV file directory
        private const string CSV_DIR = "/Users/arnob_t78/Papers/Project Doc/db-migration/motor-engine";

        public static async Task RunSeedAsync(string[] args)
        {
            Console.WriteLine("🚀 Starting database seed...\n");

            // Load .env file if it exists
            var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
            if (File.Exists(envPath))
            {
                Console.WriteLine($"📄 Loading environment variables from: {envPath}");
                Env.Load(envPath);
                Console.WriteLine("✅ .env file loaded successfully");
            }

            // Build configuration
            var configuration = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .Build();

            // Get database connection string
            var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
            if (string.IsNullOrEmpty(databaseUrl))
            {
                Console.WriteLine("❌ ERROR: DATABASE_URL environment variable is required!");
                return;
            }

            // Parse connection string
            var connectionString = ParseConnectionString(databaseUrl);

            // Setup services
            var services = new ServiceCollection();
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            var serviceProvider = services.BuildServiceProvider();

            try
            {
                using (var scope = serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    // Ensure database is created
                    await context.Database.EnsureCreatedAsync();
                    Console.WriteLine("✅ Database connection verified\n");

                    // Seed MotorReadings
                    await SeedMotorReadingsAsync(context);

                    // Seed Alerts (if CSV has data)
                    await SeedAlertsAsync(context);

                    // Seed Machines (if CSV has data)
                    await SeedMachinesAsync(context);

                    Console.WriteLine("\n✨ Database seeded successfully!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error seeding database: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        private static string ParseConnectionString(string databaseUrl)
        {
            try
            {
                var uri = new Uri(databaseUrl);
                var userInfo = uri.UserInfo.Split(':');
                var username = userInfo[0];
                var password = userInfo.Length > 1 ? userInfo[1] : "";
                var host = uri.Host;
                var port = uri.Port > 0 ? uri.Port : 5432;
                var database = uri.AbsolutePath.TrimStart('/');

                // Parse query parameters
                var queryParams = new Dictionary<string, string>();
                if (!string.IsNullOrEmpty(uri.Query))
                {
                    var query = uri.Query.TrimStart('?');
                    foreach (var param in query.Split('&'))
                    {
                        var parts = param.Split('=');
                        if (parts.Length == 2)
                        {
                            queryParams[parts[0]] = parts[1];
                        }
                    }
                }

                // Check if SSL is required
                var requireSsl = queryParams.ContainsKey("sslmode") &&
                                 (queryParams["sslmode"].Equals("require", StringComparison.OrdinalIgnoreCase) ||
                                  queryParams["sslmode"].Equals("prefer", StringComparison.OrdinalIgnoreCase));

                var connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};" +
                                      (requireSsl ? "SSL Mode=Require;" : "SSL Mode=Disable;");

                return connectionString;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Failed to parse DATABASE_URL: {ex.Message}");
                throw;
            }
        }

        private static async Task SeedMotorReadingsAsync(AppDbContext context)
        {
            Console.WriteLine("🌱 Seeding MotorReadings...");

            var csvPath = Path.Combine(CSV_DIR, "MotorReadings.csv");
            if (!File.Exists(csvPath))
            {
                Console.WriteLine($"⚠️  CSV file not found: {csvPath}");
                return;
            }

            var csvContent = File.ReadAllText(csvPath);
            if (string.IsNullOrWhiteSpace(csvContent) || csvContent.Trim().Split('\n').Length <= 1)
            {
                Console.WriteLine($"⚠️  CSV file is empty: {csvPath}");
                return;
            }

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true
            };

            using (var reader = new StringReader(csvContent))
            using (var csv = new CsvReader(reader, config))
            {
                var records = csv.GetRecords<MotorReadingCsvRow>().ToList();

                if (records.Count == 0)
                {
                    Console.WriteLine("⚠️  No MotorReadings to seed");
                    return;
                }

                int successCount = 0;
                int errorCount = 0;

                foreach (var row in records)
                {
                    try
                    {
                        var motorReading = new MotorReading
                        {
                            Id = ParseInt(row.Id),
                            Speed = ParseInt(row.Speed),
                            Temperature = ParseInt(row.Temperature),
                            Timestamp = ParseDateTime(row.Timestamp),
                            Title = row.Title,
                            MachineId = row.MachineId ?? "MOTOR-001",
                            Status = row.Status ?? "normal",
                            VibrationX = ParseDouble(row.VibrationX),
                            VibrationY = ParseDouble(row.VibrationY),
                            VibrationZ = ParseDouble(row.VibrationZ),
                            Vibration = ParseDouble(row.Vibration),
                            OilPressure = ParseDouble(row.OilPressure),
                            AirPressure = ParseDouble(row.AirPressure),
                            HydraulicPressure = ParseDouble(row.HydraulicPressure),
                            CoolantFlowRate = ParseDouble(row.CoolantFlowRate),
                            FuelFlowRate = ParseDouble(row.FuelFlowRate),
                            Voltage = ParseDouble(row.Voltage),
                            Current = ParseDouble(row.Current),
                            PowerFactor = ParseDouble(row.PowerFactor),
                            PowerConsumption = ParseDouble(row.PowerConsumption),
                            RPM = ParseIntNullable(row.RPM),
                            Torque = ParseDouble(row.Torque),
                            Efficiency = ParseDouble(row.Efficiency),
                            Humidity = ParseDouble(row.Humidity),
                            AmbientTemperature = ParseDouble(row.AmbientTemperature),
                            AmbientPressure = ParseDouble(row.AmbientPressure),
                            ShaftPosition = ParseDouble(row.ShaftPosition),
                            Displacement = ParseDouble(row.Displacement),
                            StrainGauge1 = ParseDouble(row.StrainGauge1),
                            StrainGauge2 = ParseDouble(row.StrainGauge2),
                            StrainGauge3 = ParseDouble(row.StrainGauge3),
                            SoundLevel = ParseDouble(row.SoundLevel),
                            BearingHealth = ParseDouble(row.BearingHealth),
                            BearingWear = ParseDouble(row.BearingWear),
                            OilDegradation = ParseDouble(row.OilDegradation),
                            HVACEfficiency = ParseDouble(row.HVACEfficiency),
                            EnergySavings = ParseDouble(row.EnergySavings),
                            ComfortLevel = ParseDouble(row.ComfortLevel),
                            AirQuality = ParseDouble(row.AirQuality),
                            SmartDevices = ParseIntNullable(row.SmartDevices),
                            FuelEfficiency = ParseDouble(row.FuelEfficiency),
                            EngineHealth = ParseDouble(row.EngineHealth),
                            BatteryLevel = ParseDouble(row.BatteryLevel),
                            TirePressure = ParseDouble(row.TirePressure),
                            BoatEngineEfficiency = ParseDouble(row.BoatEngineEfficiency),
                            BoatEngineHours = ParseIntNullable(row.BoatEngineHours),
                            BladeSharpness = ParseDouble(row.BladeSharpness),
                            FuelLevel = ParseDouble(row.FuelLevel),
                            GeneratorPowerOutput = ParseDouble(row.GeneratorPowerOutput),
                            GeneratorFuelEfficiency = ParseDouble(row.GeneratorFuelEfficiency),
                            PoolPumpFlowRate = ParseDouble(row.PoolPumpFlowRate),
                            PoolPumpEnergyUsage = ParseDouble(row.PoolPumpEnergyUsage),
                            WashingMachineEfficiency = ParseDouble(row.WashingMachineEfficiency),
                            DishwasherEfficiency = ParseDouble(row.DishwasherEfficiency),
                            RefrigeratorEfficiency = ParseDouble(row.RefrigeratorEfficiency),
                            AirConditionerEfficiency = ParseDouble(row.AirConditionerEfficiency),
                            OperatingHours = ParseDouble(row.OperatingHours),
                            OperatingMinutes = ParseIntNullable(row.OperatingMinutes),
                            OperatingSeconds = ParseDouble(row.OperatingSeconds),
                            MaintenanceStatus = ParseIntNullable(row.MaintenanceStatus),
                            SystemHealth = ParseIntNullable(row.SystemHealth)
                        };

                        // Upsert pattern
                        var existing = await context.MotorReadings.FindAsync(motorReading.Id);
                        if (existing != null)
                        {
                            // Update existing record
                            context.Entry(existing).CurrentValues.SetValues(motorReading);
                        }
                        else
                        {
                            // Create new record
                            await context.MotorReadings.AddAsync(motorReading);
                        }

                        successCount++;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error seeding MotorReading {row.Id}: {ex.Message}");
                        errorCount++;
                    }
                }

                await context.SaveChangesAsync();
                Console.WriteLine($"✅ Seeded {successCount} MotorReadings");
                if (errorCount > 0)
                {
                    Console.WriteLine($"⚠️  {errorCount} errors occurred");
                }
            }
        }

        private static async Task SeedAlertsAsync(AppDbContext context)
        {
            Console.WriteLine("🌱 Seeding Alerts...");

            var csvPath = Path.Combine(CSV_DIR, "Alerts.csv");
            if (!File.Exists(csvPath))
            {
                Console.WriteLine($"⚠️  CSV file not found: {csvPath}");
                return;
            }

            var csvContent = File.ReadAllText(csvPath);
            if (string.IsNullOrWhiteSpace(csvContent) || csvContent.Trim().Split('\n').Length <= 1)
            {
                Console.WriteLine($"⚠️  CSV file is empty: {csvPath}");
                return;
            }

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true
            };

            using (var reader = new StringReader(csvContent))
            using (var csv = new CsvReader(reader, config))
            {
                var records = csv.GetRecords<AlertCsvRow>().ToList();

                if (records.Count == 0)
                {
                    Console.WriteLine("⚠️  No Alerts to seed");
                    return;
                }

                int successCount = 0;
                foreach (var row in records)
                {
                    try
                    {
                        var alert = new Alert
                        {
                            Id = row.Id ?? Guid.NewGuid().ToString(),
                            Type = row.Type ?? "info",
                            Severity = row.Severity ?? "low",
                            Message = row.Message ?? "",
                            Timestamp = ParseDateTime(row.Timestamp),
                            MachineId = row.MachineId ?? "MOTOR-001",
                            Acknowledged = ParseBoolean(row.Acknowledged)
                        };

                        var existing = await context.Alerts.FindAsync(alert.Id);
                        if (existing != null)
                        {
                            context.Entry(existing).CurrentValues.SetValues(alert);
                        }
                        else
                        {
                            await context.Alerts.AddAsync(alert);
                        }

                        successCount++;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error seeding Alert {row.Id}: {ex.Message}");
                    }
                }

                await context.SaveChangesAsync();
                Console.WriteLine($"✅ Seeded {successCount} Alerts");
            }
        }

        private static async Task SeedMachinesAsync(AppDbContext context)
        {
            Console.WriteLine("🌱 Seeding Machines...");

            var csvPath = Path.Combine(CSV_DIR, "Machines.csv");
            if (!File.Exists(csvPath))
            {
                Console.WriteLine($"⚠️  CSV file not found: {csvPath}");
                return;
            }

            var csvContent = File.ReadAllText(csvPath);
            if (string.IsNullOrWhiteSpace(csvContent) || csvContent.Trim().Split('\n').Length <= 1)
            {
                Console.WriteLine($"⚠️  CSV file is empty: {csvPath}");
                return;
            }

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true
            };

            using (var reader = new StringReader(csvContent))
            using (var csv = new CsvReader(reader, config))
            {
                var records = csv.GetRecords<MachineCsvRow>().ToList();

                if (records.Count == 0)
                {
                    Console.WriteLine("⚠️  No Machines to seed");
                    return;
                }

                int successCount = 0;
                foreach (var row in records)
                {
                    try
                    {
                        var machine = new Machine
                        {
                            Id = row.Id ?? "MOTOR-001",
                            Name = row.Name ?? "Motor 001",
                            Type = row.Type ?? "Motor",
                            Location = row.Location ?? "Factory Floor",
                            Status = row.Status ?? "online",
                            LastSeen = ParseDateTime(row.LastSeen),
                            TotalReadings = ParseInt(row.TotalReadings),
                            AverageEfficiency = ParseDouble(row.AverageEfficiency) ?? 0
                        };

                        var existing = await context.Machines.FindAsync(machine.Id);
                        if (existing != null)
                        {
                            context.Entry(existing).CurrentValues.SetValues(machine);
                        }
                        else
                        {
                            await context.Machines.AddAsync(machine);
                        }

                        successCount++;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error seeding Machine {row.Id}: {ex.Message}");
                    }
                }

                await context.SaveChangesAsync();
                Console.WriteLine($"✅ Seeded {successCount} Machines");
            }
        }

        // Helper methods for parsing
        private static int ParseInt(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return 0;
            return int.TryParse(value, out var result) ? result : 0;
        }

        private static int? ParseIntNullable(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return null;
            return int.TryParse(value, out var result) ? result : null;
        }

        private static double? ParseDouble(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return null;
            return double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result) ? result : null;
        }

        private static DateTime ParseDateTime(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return DateTime.UtcNow;
            if (DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var result))
            {
                return result;
            }
            return DateTime.UtcNow;
        }

        private static bool ParseBoolean(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return false;
            return value.Equals("true", StringComparison.OrdinalIgnoreCase) ||
                   value.Equals("1", StringComparison.OrdinalIgnoreCase) ||
                   value.Equals("t", StringComparison.OrdinalIgnoreCase);
        }

        // CSV row classes
        private class MotorReadingCsvRow
        {
            public string? Id { get; set; }
            public string? Speed { get; set; }
            public string? Temperature { get; set; }
            public string? Timestamp { get; set; }
            public string? Title { get; set; }
            public string? MachineId { get; set; }
            public string? Status { get; set; }
            public string? VibrationX { get; set; }
            public string? VibrationY { get; set; }
            public string? VibrationZ { get; set; }
            public string? Vibration { get; set; }
            public string? OilPressure { get; set; }
            public string? AirPressure { get; set; }
            public string? HydraulicPressure { get; set; }
            public string? CoolantFlowRate { get; set; }
            public string? FuelFlowRate { get; set; }
            public string? Voltage { get; set; }
            public string? Current { get; set; }
            public string? PowerFactor { get; set; }
            public string? PowerConsumption { get; set; }
            public string? RPM { get; set; }
            public string? Torque { get; set; }
            public string? Efficiency { get; set; }
            public string? Humidity { get; set; }
            public string? AmbientTemperature { get; set; }
            public string? AmbientPressure { get; set; }
            public string? ShaftPosition { get; set; }
            public string? Displacement { get; set; }
            public string? StrainGauge1 { get; set; }
            public string? StrainGauge2 { get; set; }
            public string? StrainGauge3 { get; set; }
            public string? SoundLevel { get; set; }
            public string? BearingHealth { get; set; }
            public string? BearingWear { get; set; }
            public string? OilDegradation { get; set; }
            public string? HVACEfficiency { get; set; }
            public string? EnergySavings { get; set; }
            public string? ComfortLevel { get; set; }
            public string? AirQuality { get; set; }
            public string? SmartDevices { get; set; }
            public string? FuelEfficiency { get; set; }
            public string? EngineHealth { get; set; }
            public string? BatteryLevel { get; set; }
            public string? TirePressure { get; set; }
            public string? BoatEngineEfficiency { get; set; }
            public string? BoatEngineHours { get; set; }
            public string? BladeSharpness { get; set; }
            public string? FuelLevel { get; set; }
            public string? GeneratorPowerOutput { get; set; }
            public string? GeneratorFuelEfficiency { get; set; }
            public string? PoolPumpFlowRate { get; set; }
            public string? PoolPumpEnergyUsage { get; set; }
            public string? WashingMachineEfficiency { get; set; }
            public string? DishwasherEfficiency { get; set; }
            public string? RefrigeratorEfficiency { get; set; }
            public string? AirConditionerEfficiency { get; set; }
            public string? OperatingHours { get; set; }
            public string? OperatingMinutes { get; set; }
            public string? OperatingSeconds { get; set; }
            public string? MaintenanceStatus { get; set; }
            public string? SystemHealth { get; set; }
        }

        private class AlertCsvRow
        {
            public string? Id { get; set; }
            public string? Type { get; set; }
            public string? Severity { get; set; }
            public string? Message { get; set; }
            public string? Timestamp { get; set; }
            public string? MachineId { get; set; }
            public string? Acknowledged { get; set; }
        }

        private class MachineCsvRow
        {
            public string? Id { get; set; }
            public string? Name { get; set; }
            public string? Type { get; set; }
            public string? Location { get; set; }
            public string? Status { get; set; }
            public string? LastSeen { get; set; }
            public string? TotalReadings { get; set; }
            public string? AverageEfficiency { get; set; }
        }
    }
}

