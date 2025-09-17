using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorServer.Migrations
{
    /// <inheritdoc />
    public partial class EnhancedMotorReading : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Efficiency",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MachineId",
                table: "MotorReadings",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "OperatingHours",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "PowerConsumption",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "MotorReadings",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "MotorReadings",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Vibration",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Efficiency",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "MachineId",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "OperatingHours",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "PowerConsumption",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "Vibration",
                table: "MotorReadings");
        }
    }
}
