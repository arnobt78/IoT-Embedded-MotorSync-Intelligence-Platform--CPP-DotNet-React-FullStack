using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorServer.Migrations
{
    /// <inheritdoc />
    public partial class EnhancedIndustrialSensors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AirPressure",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "AmbientPressure",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "AmbientTemperature",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "BearingHealth",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "CoolantFlowRate",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Current",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Displacement",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "FuelFlowRate",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Humidity",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "HydraulicPressure",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaintenanceStatus",
                table: "MotorReadings",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "OilPressure",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "PowerFactor",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RPM",
                table: "MotorReadings",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ShaftPosition",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "SoundLevel",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "StrainGauge1",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "StrainGauge2",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "StrainGauge3",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SystemHealth",
                table: "MotorReadings",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Torque",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "VibrationX",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "VibrationY",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "VibrationZ",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Voltage",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AirPressure",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "AmbientPressure",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "AmbientTemperature",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "BearingHealth",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "CoolantFlowRate",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "Current",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "Displacement",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "FuelFlowRate",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "Humidity",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "HydraulicPressure",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "MaintenanceStatus",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "OilPressure",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "PowerFactor",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "RPM",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "ShaftPosition",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "SoundLevel",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "StrainGauge1",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "StrainGauge2",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "StrainGauge3",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "SystemHealth",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "Torque",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "VibrationX",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "VibrationY",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "VibrationZ",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "Voltage",
                table: "MotorReadings");
        }
    }
}
