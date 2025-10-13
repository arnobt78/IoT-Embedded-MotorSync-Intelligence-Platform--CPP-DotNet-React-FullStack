import { PhysicsTooltip } from "./tooltip";

interface PhysicsFormulaTooltipProps {
  type: "speed" | "temperature" | "vibration" | "efficiency" | "power";
  className?: string;
}

export function PhysicsFormulaTooltip({
  type,
  className,
}: PhysicsFormulaTooltipProps) {
  const getFormulaContent = () => {
    switch (type) {
      case "speed":
        return (
          <div>
            <p className="font-semibold mb-2">⚡ Speed Formula</p>
            <p className="mb-1">
              <strong>📊 Formula:</strong> Base Speed + Load Variation -
              Temperature Impact + Random
            </p>
            <p className="mb-1">
              <strong>🔬 Physics:</strong> Speed = 2500 + (Load-0.7)×500 -
              (Temp-65°C)×2 ±1%
            </p>
            <p className="mb-1">
              <strong>Thresholds:</strong>
            </p>
            <ul className="ml-4 space-y-1">
              <li>• Low: &lt;1500 RPM</li>
              <li>• Optimal: 1500-2500 RPM</li>
              <li>• High: 2500-3000 RPM</li>
              <li>• Overload: &gt;3000 RPM</li>
            </ul>
          </div>
        );
      case "temperature":
        return (
          <div>
            <p className="font-semibold mb-2">🌡️ Temperature Formula</p>
            <p className="mb-1">
              <strong>📊 Formula:</strong> Base Temp + Load Impact + Efficiency
              Loss - Cooling
            </p>
            <p className="mb-1">
              <strong>🔬 Physics:</strong> Temp = 65°C + (Load-0.5)×2 +
              (100-Efficiency)×0.1 - Thermal Equilibrium
            </p>
            <p className="mb-1">
              <strong>Thresholds:</strong>
            </p>
            <ul className="ml-4 space-y-1">
              <li>• Normal: &lt;75°C</li>
              <li>• Warning: 75-85°C</li>
              <li>• Critical: &gt;85°C</li>
            </ul>
          </div>
        );
      case "vibration":
        return (
          <div>
            <p className="font-semibold mb-2">📳 Vibration Formula</p>
            <p className="mb-1">
              <strong>📊 Formula:</strong> RMS Vibration = √(VibrationX² +
              VibrationY² + VibrationZ²)
            </p>
            <p className="mb-1">
              <strong>🔬 Physics:</strong> Base Vibration + (Speed/2500)×0.2 +
              Bearing Wear×0.8 + Random Variation
            </p>
            <p className="mb-1">
              <strong>Thresholds:</strong>
            </p>
            <ul className="ml-4 space-y-1">
              <li>• Normal: &lt;4.5mm/s</li>
              <li>• Warning: 4.5-6.0mm/s</li>
              <li>• Critical: &gt;6.0mm/s</li>
            </ul>
          </div>
        );
      case "efficiency":
        return (
          <div>
            <p className="font-semibold mb-2">⚙️ Efficiency Formula</p>
            <p className="mb-1">
              <strong>📊 Formula:</strong> Base Efficiency - Bearing Wear - Oil
              Degradation
            </p>
            <p className="mb-1">
              <strong>🔬 Physics:</strong> Efficiency = 92% - (Bearing Wear×5) -
              (Oil Degradation×2.5) - Temperature Losses
            </p>
            <p className="mb-1">
              <strong>Thresholds:</strong>
            </p>
            <ul className="ml-4 space-y-1">
              <li>• Critical: &lt;75%</li>
              <li>• Warning: 75-80%</li>
              <li>• Optimal: &gt;85%</li>
            </ul>
          </div>
        );
      case "power":
        return (
          <div>
            <p className="font-semibold mb-2">⚡ Power Formula</p>
            <p className="mb-1">
              <strong>📊 Formula:</strong> Base Power + Load Factor + Efficiency
              Loss
            </p>
            <p className="mb-1">
              <strong>🔬 Physics:</strong> Power = 4.5kW + (Load×1.5kW) +
              ((100-Efficiency)×0.1kW)
            </p>
            <p className="mb-1">
              <strong>Range:</strong> 3.0-7.0 kW (Typical: 4.0-5.0 kW)
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return <PhysicsTooltip content={getFormulaContent()} className={className} />;
}
