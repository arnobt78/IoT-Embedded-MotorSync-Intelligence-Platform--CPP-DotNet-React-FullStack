using System.Net;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Tests.Integration
{
    public class MotorApiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        public MotorApiTests(WebApplicationFactory<Program> factory) => _factory = factory;

        [Fact]
        public async Task GetMotorReadings_ReturnsOk()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/motor");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
