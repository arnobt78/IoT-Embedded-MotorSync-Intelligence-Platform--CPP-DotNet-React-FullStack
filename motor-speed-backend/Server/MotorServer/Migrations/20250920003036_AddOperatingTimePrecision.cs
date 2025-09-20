using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorServer.Migrations
{
    /// <inheritdoc />
    public partial class AddOperatingTimePrecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OperatingMinutes",
                table: "MotorReadings",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "OperatingSeconds",
                table: "MotorReadings",
                type: "REAL",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OperatingMinutes",
                table: "MotorReadings");

            migrationBuilder.DropColumn(
                name: "OperatingSeconds",
                table: "MotorReadings");
        }
    }
}
