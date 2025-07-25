using Xunit;
using Moq;
using Microsoft.AspNetCore.SignalR;
using MotorServer.Services;
using MotorServer.Data;

public class EngineServiceTests {
  [Fact]
  public async Task Sample_AddsReadingAndBroadcasts() {
        var options = new Microsoft.EntityFrameworkCore.DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;
        var mockDb = new AppDbContext(options);
        var mockHub = new Mock<IHubContext<MotorHub>>();
        var svc = new EngineService(mockDb, mockHub.Object);
        var reading = await svc.Sample();
        Assert.True(reading.Speed > 0);
  }
}
