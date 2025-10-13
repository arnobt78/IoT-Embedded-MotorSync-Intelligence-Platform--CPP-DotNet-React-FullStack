using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorServer.Migrations
{
    /// <inheritdoc />
    public partial class FixDatabaseSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CostPerHour",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "FacilityId",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "LastMaintenanceDate",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "MachineId",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "MaintenanceSchedule",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "NextMaintenanceDate",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "ProductionLineId",
                table: "IndustrialMachines");

            migrationBuilder.RenameColumn(
                name: "TotalReadings",
                table: "IndustrialMachines",
                newName: "MaintenanceStatus");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "IndustrialMachines",
                newName: "LastMaintenance");

            migrationBuilder.RenameColumn(
                name: "EnergyConsumption",
                table: "IndustrialMachines",
                newName: "Voltage");

            migrationBuilder.RenameColumn(
                name: "AverageEfficiency",
                table: "IndustrialMachines",
                newName: "Vibration");

            migrationBuilder.AlterColumn<double>(
                name: "PowerFactor",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "REAL",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Model",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Manufacturer",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "InstallationDate",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Department",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<double>(
                name: "Current",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "CurrentSpeed",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Efficiency",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "FlowRate",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "HealthScore",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<bool>(
                name: "IsRunning",
                table: "IndustrialMachines",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<double>(
                name: "Load",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PowerConsumption",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Pressure",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "TargetSpeed",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Temperature",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Current",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "CurrentSpeed",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "Efficiency",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "FlowRate",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "HealthScore",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "IsRunning",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "Load",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "PowerConsumption",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "Pressure",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "TargetSpeed",
                table: "IndustrialMachines");

            migrationBuilder.DropColumn(
                name: "Temperature",
                table: "IndustrialMachines");

            migrationBuilder.RenameColumn(
                name: "Voltage",
                table: "IndustrialMachines",
                newName: "EnergyConsumption");

            migrationBuilder.RenameColumn(
                name: "Vibration",
                table: "IndustrialMachines",
                newName: "AverageEfficiency");

            migrationBuilder.RenameColumn(
                name: "MaintenanceStatus",
                table: "IndustrialMachines",
                newName: "TotalReadings");

            migrationBuilder.RenameColumn(
                name: "LastMaintenance",
                table: "IndustrialMachines",
                newName: "Status");

            migrationBuilder.AlterColumn<double>(
                name: "PowerFactor",
                table: "IndustrialMachines",
                type: "REAL",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "REAL");

            migrationBuilder.AlterColumn<string>(
                name: "Model",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Manufacturer",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<DateTime>(
                name: "InstallationDate",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Department",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "IndustrialMachines",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<decimal>(
                name: "CostPerHour",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "FacilityId",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastMaintenanceDate",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MachineId",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MaintenanceSchedule",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NextMaintenanceDate",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductionLineId",
                table: "IndustrialMachines",
                type: "TEXT",
                nullable: true);
        }
    }
}
