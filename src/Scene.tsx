import { ThreeCanvas } from '@remotion/three';
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const StickmanRunner: React.FC<{ frame: number }> = ({ frame }) => {
  // Douranor speed (10x fast bujhanor jonno multiplier barano hoyeche)
  const speed = frame * 0.45;
  const legSwing = Math.sin(speed) * 0.85;
  const armSwing = Math.cos(speed) * 0.75;
  const bounce = Math.abs(Math.sin(speed * 2)) * 0.08;

  return (
    <group position={[0, 0.35 + bounce, 0]}>
      {/* Gol Kalo Matha */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} />
      </mesh>

      {/* Shorir (Blue Vest) */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.16, 0.14, 0.75, 16]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.5} />
      </mesh>

      {/* Ba Haat */}
      <group position={[-0.24, 1.25, 0]} rotation={[armSwing, 0, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.55, 12]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      </group>

      {/* Dan Haat */}
      <group position={[0.24, 1.25, 0]} rotation={[-armSwing, 0, 0]}>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.55, 12]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      </group>

      {/* Ba Pa */}
      <group position={[-0.1, 0.6, 0]} rotation={[legSwing, 0, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.7, 12]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      </group>

      {/* Dan Pa */}
      <group position={[0.1, 0.6, 0]} rotation={[-legSwing, 0, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.7, 12]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      </group>
    </group>
  );
};

const TreadmillAndLab: React.FC = () => {
  return (
    <group>
      {/* Lab Floor & Walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 4, -4]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Treadmill Base (Blue Border + Black Belt) */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.4, 0.2, 3.2]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[1.0, 0.05, 2.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Treadmill Front Bar & Display */}
      <mesh position={[-0.6, 0.7, 1.3]}>
        <cylinderGeometry args={[0.04, 0.04, 1.3]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0.6, 0.7, 1.3]}>
        <cylinderGeometry args={[0.04, 0.04, 1.3]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, 1.35, 1.3]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.9, 0.4, 0.08]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
    </group>
  );
};

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Camera halka pan korbe cinematic look-er jonno
  const camX = 3.2 + Math.sin(frame * 0.02) * 0.3;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [camX, 2.2, 3.8], fov: 45 }}
    >
      <color attach="background" args={['#cbd5e1']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      
      <group rotation={[0, -0.4, 0]}>
        <TreadmillAndLab />
        <StickmanRunner frame={frame} />
      </group>
    </ThreeCanvas>
  );
};
