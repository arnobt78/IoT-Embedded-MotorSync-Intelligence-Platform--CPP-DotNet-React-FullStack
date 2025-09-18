import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Environment, Lightformer } from '@react-three/drei';
import type { MotorReading } from '../types/types';
import * as THREE from 'three';

interface Motor3DProps {
  reading: MotorReading | null;
  className?: string;
}

// 3D Motor Component
function Motor({ reading }: { reading: MotorReading | null }) {
  const motorRef = useRef<THREE.Group>(null);
  const shaftRef = useRef<THREE.Group>(null);
  
  // Calculate rotation speed based on RPM
  const rotationSpeed = useMemo(() => {
    if (!reading?.rpm) return 0;
    return (reading.rpm / 60) * 0.1; // Convert RPM to rotation per frame
  }, [reading?.rpm]);

  // Calculate temperature-based color
  const temperatureColor = useMemo(() => {
    if (!reading?.temperature) return '#4a5568'; // Default gray
    
    const temp = reading.temperature;
    if (temp < 30) return '#3b82f6'; // Blue - cold
    if (temp < 50) return '#10b981'; // Green - normal
    if (temp < 70) return '#f59e0b'; // Yellow - warm
    if (temp < 85) return '#f97316'; // Orange - hot
    return '#ef4444'; // Red - critical
  }, [reading?.temperature]);

  // Calculate vibration intensity
  const vibrationIntensity = useMemo(() => {
    if (!reading?.vibration) return 0;
    return Math.min(reading.vibration / 5.0, 1.0); // Normalize to 0-1
  }, [reading?.vibration]);

  // Animate motor rotation
  useFrame((state) => {
    if (shaftRef.current && reading?.rpm) {
      shaftRef.current.rotation.y += rotationSpeed;
    }
    
    // Add vibration effect
    if (motorRef.current && vibrationIntensity > 0) {
      const time = state.clock.getElapsedTime();
      motorRef.current.position.x = Math.sin(time * 10) * vibrationIntensity * 0.1;
      motorRef.current.position.z = Math.cos(time * 8) * vibrationIntensity * 0.1;
    }
  });

  return (
    <group ref={motorRef}>
      {/* Motor Housing */}
      <Cylinder args={[1.5, 1.5, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color={temperatureColor} metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Motor Shaft */}
      <group ref={shaftRef}>
        <Cylinder args={[0.1, 0.1, 3]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#2d3748" metalness={0.9} roughness={0.1} />
        </Cylinder>
        
        {/* Shaft End */}
        <Sphere args={[0.15]} position={[1.5, 0, 0]}>
          <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.1} />
        </Sphere>
      </group>
      
      {/* Cooling Fins */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box
          key={i}
          args={[0.1, 0.3, 0.8]}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * 1.6,
            Math.sin((i * Math.PI * 2) / 8) * 1.6,
            0
          ]}
          rotation={[0, 0, (i * Math.PI * 2) / 8]}
        >
          <meshStandardMaterial color="#718096" metalness={0.7} roughness={0.3} />
        </Box>
      ))}
      
      {/* Status Indicator */}
      {reading?.status && (
        <Sphere args={[0.2]} position={[0, 0, 1.2]}>
          <meshStandardMaterial 
            color={
              reading.status === 'critical' ? '#ef4444' :
              reading.status === 'warning' ? '#f59e0b' :
              reading.status === 'maintenance' ? '#3b82f6' :
              '#10b981'
            }
            emissive={
              reading.status === 'critical' ? '#ef4444' :
              reading.status === 'warning' ? '#f59e0b' :
              reading.status === 'maintenance' ? '#3b82f6' :
              '#10b981'
            }
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}
    </group>
  );
}

// Floating Data Points Component
function DataPoints({ reading }: { reading: MotorReading | null }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const dataPoints = useMemo(() => {
    if (!reading) return [];
    
    const points = [];
    
    // Temperature data point
    if (reading.temperature) {
      points.push({
        position: [2, 1, 0],
        value: reading.temperature,
        unit: '°C',
        color: '#f97316'
      });
    }
    
    // Vibration data point
    if (reading.vibration) {
      points.push({
        position: [-2, 1, 0],
        value: reading.vibration,
        unit: 'mm/s',
        color: '#8b5cf6'
      });
    }
    
    // Efficiency data point
    if (reading.efficiency) {
      points.push({
        position: [0, 2, 0],
        value: reading.efficiency,
        unit: '%',
        color: '#10b981'
      });
    }
    
    // System Health data point
    if (reading.systemHealth) {
      points.push({
        position: [0, -2, 0],
        value: reading.systemHealth,
        unit: '%',
        color: reading.systemHealth > 80 ? '#10b981' : reading.systemHealth > 60 ? '#f59e0b' : '#ef4444'
      });
    }
    
    return points;
  }, [reading]);

  return (
    <>
      {dataPoints.map((point, index) => (
        <group key={index} position={point.position as [number, number, number]}>
          <Sphere args={[0.1]}>
            <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={0.5} />
          </Sphere>
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.2}
            color={point.color}
            anchorX="center"
            anchorY="middle"
          >
            {point.value}{point.unit}
          </Text>
        </group>
      ))}
    </>
  );
}

// Main 3D Motor Component
export default function Motor3D({ reading, className = "" }: Motor3DProps) {
  return (
    <div className={`w-full h-96 ${className}`}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="warehouse" />
        
        {/* Motor */}
        <Motor reading={reading} />
        
        {/* Data Points */}
        <DataPoints reading={reading} />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
        />
        
        {/* Grid */}
        <gridHelper args={[10, 10]} position={[0, -2, 0]} />
      </Canvas>
      
      {/* Info Panel */}
      {reading && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
          <div className="font-semibold mb-2">Motor Status</div>
          <div className="space-y-1">
            <div>Speed: {reading.speed} RPM</div>
            <div>Temperature: {reading.temperature}°C</div>
            <div>Efficiency: {reading.efficiency}%</div>
            <div>System Health: {reading.systemHealth}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
