using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorServer.Migrations
{
    /// <inheritdoc />
    public partial class AddDailyLifeApplicationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AirConditionerEfficiency",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "AirQuality",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "BatteryLevel",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "BearingWear",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "BladeSharpness",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "BoatEngineEfficiency",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BoatEngineHours",
                table: "MotorReadings",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ComfortLevel",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "DishwasherEfficiency",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EnergySavings",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EngineHealth",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "FuelEfficiency",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "FuelLevel",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "GeneratorFuelEfficiency",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "GeneratorPowerOutput",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "HVACEfficiency",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "OilDegradation",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "PoolPumpEnergyUsage",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "PoolPumpFlowRate",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "RefrigeratorEfficiency",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SmartDevices",
                table: "MotorReadings",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "TirePressure",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "WashingMachineEfficiency",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AirConditionerEfficiency",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "AirQuality",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "BatteryLevel",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "BearingWear",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "BladeSharpness",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "BoatEngineEfficiency",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "BoatEngineHours",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "ComfortLevel",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "DishwasherEfficiency",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "EnergySavings",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "EngineHealth",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "FuelEfficiency",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "FuelLevel",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "GeneratorFuelEfficiency",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "GeneratorPowerOutput",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "HVACEfficiency",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "OilDegradation",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "PoolPumpEnergyUsage",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "PoolPumpFlowRate",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "RefrigeratorEfficiency",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "SmartDevices",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "TirePressure",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "WashingMachineEfficiency",
                table: "MotorReadings");
        }
    }
}
