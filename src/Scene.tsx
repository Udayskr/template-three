import { ThreeCanvas } from '@remotion/three';
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Reusable Detailed Stickman Component (Chokh, Choshma, Cap, Bag, Joint Motion)
const Stickman: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  shirtColor?: string;
  hasGlasses?: boolean;
  hasCap?: boolean;
  hasBackpack?: boolean;
  pose?: 'hug' | 'run' | 'sit' | 'coach';
  frame?: number;
  speedMultiplier?: number;
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  shirtColor = '#2563eb',
  hasGlasses = false,
  hasCap = false,
  hasBackpack = false,
  pose = 'run',
  frame = 0,
  speedMultiplier = 1,
}) => {
  const t = frame * 0.35 * speedMultiplier;
  let leftArmRot: [number, number, number] = [0, 0, 0.15];
  let rightArmRot: [number, number, number] = [0, 0, -0.15];
  let leftLegRot: [number, number, number] = [0, 0, 0];
  let rightLegRot: [number, number, number] = [0, 0, 0];
  let bounce = 0;

  if (pose === 'run') {
    leftLegRot = [Math.sin(t) * 0.95, 0, 0];
    rightLegRot = [-Math.sin(t) * 0.95, 0, 0];
    leftArmRot = [-Math.sin(t) * 0.85, 0, 0.15];
    rightArmRot = [Math.sin(t) * 0.85, 0, -0.15];
    bounce = Math.abs(Math.cos(t * 2)) * 0.08;
  } else if (pose === 'hug') {
    const breathe = Math.sin(frame * 0.08) * 0.05;
    leftArmRot = [-0.7 + breathe, 0.4, 0.2];
    rightArmRot = [-0.7 + breathe, -0.4, -0.2];
  } else if (pose === 'sit') {
    leftLegRot = [-1.4, 0, 0];
    rightLegRot = [-1.4, 0, 0];
    leftArmRot = [-0.6, 0, 0];
    rightArmRot = [-0.6 + Math.sin(frame * 0.3) * 0.1, 0, 0];
  } else if (pose === 'coach') {
    leftArmRot = [-0.8, 0.3, 0.2];
    rightArmRot = [-0.9, -0.2, -0.2];
  }

  return (
    <group position={[position[0], position[1] + bounce, position[2]]} rotation={rotation} scale={scale}>
      {/* Head */}
      <group position={[0, 1.55, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial color="#111111" roughness={0.35} />
        </mesh>
        {/* Expressive White Eyes */}
        <mesh position={[-0.08, 0.02, 0.23]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.08, 0.02, 0.23]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Blue Glasses on Head (Scene 1 style) */}
        {hasGlasses && (
          <group position={[0, 0.18, 0.16]} rotation={[-0.35, 0, 0]}>
            <mesh position={[-0.09, 0, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.02, 16]} />
              <meshBasicMaterial color="#60a5fa" />
            </mesh>
            <mesh position={[0.09, 0, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.02, 16]} />
              <meshBasicMaterial color="#60a5fa" />
            </mesh>
          </group>
        )}
        {/* Coach Blue Cap (Scene 3 style) */}
        {hasCap && (
          <group position={[0, 0.12, 0.05]} rotation={[0.2, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.27, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#1e3a8a" />
            </mesh>
            <mesh position={[0, -0.02, 0.22]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.32, 0.03, 0.25]} />
              <meshStandardMaterial color="#1e3a8a" />
            </mesh>
          </group>
        )}
      </group>

      {/* Torso / Jacket */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.46, 16, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>

      {/* Kid Yellow Backpack */}
      {hasBackpack && (
        <mesh position={[0, 1.0, -0.18]} castShadow>
          <boxGeometry args={[0.26, 0.34, 0.14]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      )}

      {/* Left Arm */}
      <group position={[-0.22, 1.22, 0]} rotation={leftArmRot}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <capsuleGeometry args={[0.042, 0.44, 8, 16]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.22, 1.22, 0]} rotation={rightArmRot}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <capsuleGeometry args={[0.042, 0.44, 8, 16]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-0.09, 0.65, 0]} rotation={leftLegRot}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.048, 0.54, 8, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.09, 0.65, 0]} rotation={rightLegRot}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.048, 0.54, 8, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>
    </group>
  );
};

// SCENE 1: Street Hugging Scene (Frames 0 - 300)
const Scene1Street: React.FC<{ frame: number }> = ({ frame }) => {
  const camZ = interpolate(frame, [0, 300], [3.6, 2.8]);
  const camX = interpolate(frame, [0, 300], [-0.8, 0.4]);

  return (
    <ThreeCanvas
      shadows
      width={1920}
      height={1080}
      camera={{ position: [camX, 1.45, camZ], fov: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, 1.1, 0)}
    >
      <color attach="background" args={['#fde68a']} />
      <ambientLight intensity={0.65} />
      <directionalLight castShadow position={[-5, 6, 4]} intensity={1.4} color="#fef08a" />

      {/* Lawn, Sidewalk & Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 30]} />
        <meshStandardMaterial color="#65a30d" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[2.5, 30]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 30]} />
        <meshStandardMaterial color="#292524" />
      </mesh>

      {/* Background House & Trees */}
      <mesh position={[-4.5, 1.8, -3]} castShadow receiveShadow>
        <boxGeometry args={[4, 3.6, 5]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
      <group position={[-2.2, 0, -4]}>
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 2]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <sphereGeometry args={[0.85, 16, 16]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
      </group>

      {/* Main Character (Yellow Jacket + Glasses) */}
      <Stickman position={[0.1, 0, 0]} rotation={[0, -0.3, 0]} shirtColor="#eab308" hasGlasses pose="hug" frame={frame} />
      {/* Partner (Purple Top) */}
      <Stickman position={[-0.38, 0, 0.15]} rotation={[0, 1.1, 0]} shirtColor="#c084fc" pose="hug" frame={frame} />
      {/* Kid (Orange Top + Yellow Backpack) */}
      <Stickman position={[0.02, 0, 0.35]} rotation={[0, 3.1, 0]} scale={0.68} shirtColor="#ea580c" hasBackpack pose="hug" frame={frame} />
    </ThreeCanvas>
  );
};

// SCENE 2: Lab Treadmill Test (Frames 300 - 600)
const Scene2Lab: React.FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - 300;
  const camX = interpolate(localFrame, [0, 300], [3.2, 2.2]);
  const camZ = interpolate(localFrame, [0, 300], [3.4, 2.7]);

  return (
    <ThreeCanvas
      shadows
      width={1920}
      height={1080}
      camera={{ position: [camX, 1.7, camZ], fov: 42 }}
      onCreated={({ camera }) => camera.lookAt(0.3, 1.0, 0)}
    >
      <color attach="background" args={['#94a3b8']} />
      <ambientLight intensity={0.6} />
      <directionalLight castShadow position={[4, 7, 5]} intensity={1.3} />

      <group rotation={[0, -0.35, 0]}>
        {/* Lab Floor & Walls */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[25, 25]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, 3, -2.5]} receiveShadow>
          <boxGeometry args={[14, 6, 0.2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>

        {/* Wall Heartbeat / Speed Monitors */}
        <mesh position={[-1.4, 2.1, -2.35]}>
          <boxGeometry args={[1.6, 0.9, 0.05]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.5, 2.1, -2.35]}>
          <boxGeometry args={[1.6, 0.9, 0.05]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        {/* Treadmill */}
        <mesh position={[-0.4, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.18, 3.0]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-0.4, 0.2, 0]} receiveShadow>
          <boxGeometry args={[0.95, 0.04, 2.6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.4, 1.2, 1.2]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.7, 0.35, 0.06]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Fast Runner on Treadmill */}
        <Stickman position={[-0.4, 0.22, 0]} shirtColor="#1d4ed8" pose="run" frame={localFrame} speedMultiplier={2.2} />

        {/* Scientist Desk & 2 Seated Researchers (Right Side) */}
        <mesh position={[1.8, 0.45, -0.3]} castShadow>
          <boxGeometry args={[1.1, 0.06, 1.8]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[1.6, 0.7, -0.5]}>
          <boxGeometry args={[0.08, 0.4, 0.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <Stickman position={[2.2, -0.15, -0.5]} rotation={[0, -Math.PI / 2, 0]} scale={0.85} shirtColor="#f8fafc" pose="sit" frame={localFrame} />
        <Stickman position={[2.2, -0.15, 0.2]} rotation={[0, -Math.PI / 2, 0]} scale={0.85} shirtColor="#f8fafc" pose="sit" frame={localFrame} />
      </group>
    </ThreeCanvas>
  );
};

// SCENE 3: Outdoor Track & Coach (Frames 600 - 900)
const Scene3Track: React.FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - 600;
  // Runner zooms across the track repeatedly at super speed
  const runnerZ = ((localFrame * 0.6) % 18) - 9;

  return (
    <ThreeCanvas
      shadows
      width={1920}
      height={1080}
      camera={{ position: [0, 1.5, 2.8], fov: 42 }}
      onCreated={({ camera }) => camera.lookAt(0.2, 1.2, 0)}
    >
      <color attach="background" args={['#bae6fd']} />
      <ambientLight intensity={0.7} />
      <directionalLight castShadow position={[5, 8, 4]} intensity={1.4} color="#fef9c3" />

      {/* Green Field & Red Running Track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 30]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.8, 0.01, 0]} receiveShadow>
        <planeGeometry args={[2.8, 30]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Background Tree */}
      <group position={[-2.5, 0, -4]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.6]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 1.9, 0]} castShadow>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
      </group>

      {/* Coach in Red Tracksuit & Blue Cap holding Clipboard */}
      <Stickman position={[-0.2, 0, 0.6]} rotation={[0, 0.3, 0]} shirtColor="#b91c1c" hasCap pose="coach" frame={localFrame} />
      {/* Clipboard */}
      <mesh position={[-0.05, 1.05, 0.95]} rotation={[-0.4, 0.3, 0]}>
        <boxGeometry args={[0.22, 0.3, 0.03]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>

      {/* Super Speed Runner on the Red Track */}
      <Stickman position={[1.6, 0, runnerZ]} shirtColor="#2563eb" pose="run" frame={localFrame} speedMultiplier={3.5} />
    </ThreeCanvas>
  );
};

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();

  let subtitle = '';
  if (frame < 300) {
    subtitle = 'What if you suddenly became 10x faster than everyone else?';
  } else if (frame < 600) {
    subtitle = 'Scientists test your limits... your legs move like an absolute blur!';
  } else {
    subtitle = 'Super speed sounds amazing... until you try to stop!';
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {frame < 300 ? (
        <Scene1Street frame={frame} />
      ) : frame < 600 ? (
        <Scene2Lab frame={frame} />
      ) : (
        <Scene3Track frame={frame} />
      )}

      {/* Modern YouTube Storytelling Subtitle Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#f8fafc',
            padding: '16px 36px',
            borderRadius: 16,
            fontSize: 38,
            fontFamily: 'sans-serif',
            fontWeight: 700,
            border: '2px solid rgba(56, 189, 248, 0.5)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
        
