import React from "react";

interface AnimatedGearIconProps {
  isActive: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  status?: "live" | "offline";
}

export default function AnimatedGearIcon({
  isActive,
  size = "md",
  className = "",
  status = "offline",
}: AnimatedGearIconProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "w-6 h-6",
      gear: "w-5 h-5",
      border: "border-2",
      dots: "w-1 h-1",
      indicator: "w-2 h-2",
      indicatorOffset: "-top-1 -right-1",
    },
    md: {
      container: "w-10 h-10",
      gear: "w-8 h-8",
      border: "border-4",
      dots: "w-2 h-2",
      indicator: "w-4 h-4",
      indicatorOffset: "-top-1 -right-1",
    },
    lg: {
      container: "w-12 h-12",
      gear: "w-10 h-10",
      border: "border-4",
      dots: "w-3 h-3",
      indicator: "w-5 h-5",
      indicatorOffset: "-top-1 -right-1",
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`${config.container} flex items-center justify-center ${className}`}
    >
      {isActive ? (
        <div className="relative">
          <div
            className={`${config.gear} ${config.border} border-white rounded-full animate-spin`}
          >
            <div
              className={`${config.dots} bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2`}
            ></div>
            <div
              className={`${config.dots} bg-white rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2`}
            ></div>
            <div
              className={`${config.dots} bg-white rounded-full absolute left-0 top-1/2 transform -translate-y-1/2`}
            ></div>
            <div
              className={`${config.dots} bg-white rounded-full absolute right-0 top-1/2 transform -translate-y-1/2`}
            ></div>
          </div>
          <div
            className={`absolute ${config.indicatorOffset} ${
              config.indicator
            } ${
              status === "live" ? "bg-green-400" : "bg-gray-400"
            } rounded-full animate-pulse`}
          ></div>
        </div>
      ) : (
        <div
          className={`${config.gear} ${config.border} border-white rounded-full`}
        >
          <div
            className={`${config.dots} bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
          ></div>
        </div>
      )}
    </div>
  );
}
