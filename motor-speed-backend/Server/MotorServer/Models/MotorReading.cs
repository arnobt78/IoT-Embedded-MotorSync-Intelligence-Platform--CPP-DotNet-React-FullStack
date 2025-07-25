namespace MotorServer.Models {
    public class MotorReading {
        public int Id { get; set; }
        public int Speed { get; set; }
        public int Temperature { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
