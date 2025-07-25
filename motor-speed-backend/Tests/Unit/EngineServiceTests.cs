using Xunit;
using MotorServer.Services;

namespace Tests.Unit
{
    public class EngineServiceTests
    {
        [Fact]
        public void GetSpeed_ReturnsExpectedValue()
        {
            var service = new EngineService();
            var speed = service.GetSpeed();
            Assert.InRange(speed, 0, 10000);
        }
    }
}
