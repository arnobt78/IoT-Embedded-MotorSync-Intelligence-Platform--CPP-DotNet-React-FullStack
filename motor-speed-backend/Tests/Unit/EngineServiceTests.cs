using Xunit;
using MotorServer.Services;
using Moq;
using Microsoft.AspNetCore.SignalR;
using MotorServer.Data;
using MotorServer.Hubs;
using Microsoft.EntityFrameworkCore;

namespace Tests.Unit
{
    public class EngineServiceTests
    {
        [Fact]
        public async Task Sample_IncludesBearingWearAndOilDegradation()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb2")
                .Options;
            var mockDb = new AppDbContext(options);
            
            // Create a proper mock for the hub context
            var mockHub = new Mock<IHubContext<MotorHub>>();
            var mockClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            
            mockHub.Setup(h => h.Clients).Returns(mockClients.Object);
            mockClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            // Don't mock SendAsync since it's an extension method - just let it fail gracefully
            
            var svc = new EngineService(mockDb, mockHub.Object);
            var reading = await svc.Sample();
            
            // Verify new fields are populated
            Assert.NotNull(reading.BearingWear);
            Assert.NotNull(reading.OilDegradation);
            Assert.True(reading.BearingWear >= 0.0);
            Assert.True(reading.OilDegradation >= 0.0);
            Assert.True(reading.BearingWear <= 1.0); // Should be reasonable range
            Assert.True(reading.OilDegradation <= 1.0); // Should be reasonable range
        }
    }
}
