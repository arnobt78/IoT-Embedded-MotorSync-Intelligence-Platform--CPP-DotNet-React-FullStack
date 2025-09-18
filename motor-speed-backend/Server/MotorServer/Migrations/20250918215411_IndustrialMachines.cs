using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorServer.Migrations
{
    /// <inheritdoc />
    public partial class IndustrialMachines : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IndustrialMachines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MachineId = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Location = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    LastSeen = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TotalReadings = table.Column<int>(type: "INTEGER", nullable: false),
                    AverageEfficiency = table.Column<double>(type: "REAL", nullable: false),
                    MaintenanceSchedule = table.Column<string>(type: "TEXT", nullable: true),
                    OperatingHours = table.Column<double>(type: "REAL", nullable: false),
                    EnergyConsumption = table.Column<double>(type: "REAL", nullable: false),
                    PowerFactor = table.Column<double>(type: "REAL", nullable: true),
                    CostPerHour = table.Column<decimal>(type: "TEXT", nullable: false),
                    ProductionLineId = table.Column<string>(type: "TEXT", nullable: true),
                    FacilityId = table.Column<string>(type: "TEXT", nullable: true),
                    Department = table.Column<string>(type: "TEXT", nullable: true),
                    Manufacturer = table.Column<string>(type: "TEXT", nullable: true),
                    Model = table.Column<string>(type: "TEXT", nullable: true),
                    InstallationDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    LastMaintenanceDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    NextMaintenanceDate = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndustrialMachines", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IndustrialMachines");
        }
    }
}
