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

        [HttpGet]
        public async Task<List<MotorReading>> GetAll()
        {
            var list = await _db.MotorReadings
                .OrderByDescending(r => r.Timestamp)
                .Take(20)
                .ToListAsync();
            // Debug: log all timestamps to console
            foreach (var r in list)
            {
                Console.WriteLine($"[DEBUG] MotorReading Id={r.Id} Timestamp={r.Timestamp:O}");
            }
            return list;
        }
    }
}
