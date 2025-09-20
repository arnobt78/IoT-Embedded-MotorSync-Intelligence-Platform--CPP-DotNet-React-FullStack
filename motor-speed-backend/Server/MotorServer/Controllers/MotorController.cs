using Microsoft.AspNetCore.Mvc;
using MotorServer.Data;
using MotorServer.Models;
using MotorServer.Services;
using Microsoft.EntityFrameworkCore;

namespace MotorServer.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class MotorController : ControllerBase {
        private readonly EngineService _svc;
        private readonly AppDbContext _db;
        public MotorController(EngineService svc, AppDbContext db) {
            _svc = svc; _db = db;
        }

        [HttpGet("sample")]
        public async Task<MotorReading> GetSample() => await _svc.Sample();

        [HttpGet("test")]
        public IActionResult GetTest() {
            return Ok(new { message = "Backend is working!", timestamp = DateTime.UtcNow });
        }

        [HttpGet("simple")]
        public IActionResult GetSimple() {
            return Ok(new { status = "OK", data = "Simple endpoint working" });
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
        public async Task<DashboardStats> GetStats() => await _svc.GetDashboardStats();

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

        [HttpPost("clear")]
        public async Task<IActionResult> ClearAllReadings()
        {
            var count = await _db.MotorReadings.CountAsync();
            _db.MotorReadings.RemoveRange(_db.MotorReadings);
            await _db.SaveChangesAsync();
            
            return Ok(new { message = $"Cleared {count} readings from database", clearedCount = count });
        }


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
    }
}
