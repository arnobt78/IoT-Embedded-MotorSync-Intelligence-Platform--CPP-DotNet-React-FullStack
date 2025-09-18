import { render } from "@testing-library/react";
import AnimatedMotor from "./AnimatedMotor";

test("renders without crashing", () => {
  const mockReading = {
    id: 1,
    speed: 1200,
    temperature: 45,
    timestamp: new Date().toISOString(),
    title: "Test Reading",
    machineId: "TEST-001",
    status: "normal" as const,
    vibration: 2.5,
    efficiency: 85,
  };
  render(<AnimatedMotor reading={mockReading} />);
});
