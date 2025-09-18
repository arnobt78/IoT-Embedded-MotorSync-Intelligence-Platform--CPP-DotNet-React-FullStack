import { render } from "@testing-library/react";
import AnimatedMotor from "../AnimatedMotor";

describe("AnimatedMotor", () => {
  it("renders without crashing", () => {
    const mockReading = {
      id: 1,
      speed: 1000,
      temperature: 50,
      timestamp: new Date().toISOString(),
      title: "Test Reading",
      machineId: "TEST-001",
      status: "normal" as const,
      vibration: 3.0,
      efficiency: 90,
    };
    render(<AnimatedMotor reading={mockReading} />);
  });
});
