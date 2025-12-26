// ========================================================================
// CONSOLIDATED DATABASE CONTEXT
// Real Industrial Motor Physics Engine Database
// ========================================================================

using Microsoft.EntityFrameworkCore;
using MotorServer.Models;

namespace MotorServer.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // ========================================================================
        // DATABASE TABLES
        // ========================================================================
        
        public DbSet<MotorReading> MotorReadings { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<Machine> Machines { get; set; }

        // ========================================================================
        // DATABASE CONFIGURATION
        // ========================================================================

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure MotorReading entity
            modelBuilder.Entity<MotorReading>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd(); // Auto-increment ID
                entity.Property(e => e.Title).HasMaxLength(200);
                entity.Property(e => e.MachineId).HasMaxLength(50);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.MachineId);
            });

            // Configure Alert entity
            modelBuilder.Entity<Alert>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(100);
                entity.Property(e => e.Type).HasMaxLength(50);
                entity.Property(e => e.Severity).HasMaxLength(20);
                entity.Property(e => e.Message).HasMaxLength(500);
                entity.Property(e => e.MachineId).HasMaxLength(50);
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.MachineId);
            });

            // Configure Machine entity
            modelBuilder.Entity<Machine>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Type).HasMaxLength(50);
                entity.Property(e => e.Location).HasMaxLength(100);
                entity.Property(e => e.Status).HasMaxLength(20);
                entity.HasIndex(e => e.LastSeen);
            });
        }
    }
}