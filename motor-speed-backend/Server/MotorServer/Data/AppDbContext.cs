using Microsoft.EntityFrameworkCore;
using MotorServer.Models;

namespace MotorServer.Data {
    public class AppDbContext : DbContext {
        public DbSet<MotorReading> MotorReadings { get; set; }
        public DbSet<IndustrialMachine> IndustrialMachines { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }
    }
}
