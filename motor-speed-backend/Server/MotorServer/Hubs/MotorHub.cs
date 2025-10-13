using Microsoft.AspNetCore.SignalR;

namespace MotorServer.Hubs
{
    /// <summary>
    /// SignalR Hub for real-time motor data updates
    /// Supports both localhost and production environments
    /// </summary>
    public class MotorHub : Hub
    {
        /// <summary>
        /// Called when a client connects to the hub
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"🔌 Client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Called when a client disconnects from the hub
        /// </summary>
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"🔌 Client disconnected: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Join a motor group for real-time updates
        /// </summary>
        /// <param name="motorId">The motor ID to subscribe to</param>
        public async Task JoinMotorGroup(string motorId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"motor-{motorId}");
            Console.WriteLine($"🔌 Client {Context.ConnectionId} joined motor group: {motorId}");
        }

        /// <summary>
        /// Leave a motor group
        /// </summary>
        /// <param name="motorId">The motor ID to unsubscribe from</param>
        public async Task LeaveMotorGroup(string motorId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"motor-{motorId}");
            Console.WriteLine($"🔌 Client {Context.ConnectionId} left motor group: {motorId}");
        }
    }
}
