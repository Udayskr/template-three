import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import React, { useEffect } from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import * as THREE from 'three';

// Dynamic Camera Controller (Fixes frozen camera bug!)
const CameraRig: React.FC<{
  pos: [number, number, number];
  lookAt: [number, number, number];
}> = ({ pos, lookAt }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]));
    camera.updateProjectionMatrix();
  }, [camera, pos, lookAt]);
  return null;
};

// Upgraded Stickman with Dynamic Action Poses
const Stickman: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  shirtColor?: string;
  hasGlasses?: boolean;
  hasCap?: boolean;
  hasBackpack?: boolean;
  pose?: 'hug' | 'run' | 'sit' | 'coach' | 'shocked' | 'crashed';
  frame?: number;
  speedMultiplier?: number;
  glowing?: boolean;
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
  glowing = false,
}) => {
  const t = frame * 0.4 * speedMultiplier;
  let leftArmRot: [number, number, number] = [0, 0, 0.15];
  let rightArmRot: [number, number, number] = [0, 0, -0.15];
  let leftLegRot: [number, number, number] = [0, 0, 0];
  let rightLegRot: [number, number, number] = [0, 0, 0];
  let bodyTilt = 0;
  let bounce = 0;

  if (pose === 'run') {
    leftLegRot = [Math.sin(t) * 1.1, 0, 0];
    rightLegRot = [-Math.sin(t) * 1.1, 0, 0];
    leftArmRot = [-Math.sin(t) * 0.95, 0, 0.15];
    rightArmRot = [Math.sin(t) * 0.95, 0, -0.15];
    bounce = Math.abs(Math.cos(t * 2)) * 0.08;
    bodyTilt = 0.25; // Lean forward while running
  } else if (pose === 'hug') {
    const wave = Math.sin(frame * 0.15) * 0.12;
    leftArmRot = [-0.75 + wave, 0.4, 0.2];
    rightArmRot = [-0.75 - wave, -0.4, -0.2];
    bounce = Math.abs(Math.sin(frame * 0.1)) * 0.02;
  } else if (pose === 'shocked') {
    // Hands up in surprise!
    leftArmRot = [-2.4 + Math.sin(frame * 0.5) * 0.15, 0, 0.4];
    rightArmRot = [-2.4 - Math.sin(frame * 0.5) * 0.15, 0, -0.4];
    bounce = Math.abs(Math.sin(frame * 0.3)) * 0.05;
  } else if (pose === 'sit') {
    leftLegRot = [-1.4, 0, 0];
    rightLegRot = [-1.4, 0, 0];
    leftArmRot = [-0.6 + Math.sin(frame * 0.25) * 0.15, 0, 0];
    rightArmRot = [-0.6 - Math.sin(frame * 0.25) * 0.15, 0, 0];
  } else if (pose === 'coach') {
    leftArmRot = [-0.8, 0.3, 0.2];
    rightArmRot = [-1.1 + Math.sin(frame * 0.2) * 0.1, -0.2, -0.2];
  } else if (pose === 'crashed') {
    // Upside down / sprawled after crashing!
    leftArmRot = [-2.2, 0, 0.6];
    rightArmRot = [-2.0, 0, -0.6];
    leftLegRot = [0.5, 0, 0.4];
    rightLegRot = [-0.5, 0, -0.4];
  }

  return (
    <group
      position={[position[0], position[1] + bounce, position[2]]}
      rotation={[rotation[0] + bodyTilt, rotation[1], rotation[2]]}
      scale={scale}
    >
      {/* Super Speed Golden Aura */}
      {glowing && (
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.75 + Math.sin(frame * 0.8) * 0.1, 16, 16]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.35} />
        </mesh>
      )}

      {/* Head */}
      <group position={[0, 1.55, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial color="#111111" roughness={0.35} />
        </mesh>
        <mesh position={[-0.08, 0.02, 0.23]}>
          <sphereGeometry args={[0.042, 16, 16]} />
          <meshBasicMaterial color={glowing ? '#fef08a' : '#ffffff'} />
        </mesh>
        <mesh position={[0.08, 0.02, 0.23]}>
          <sphereGeometry args={[0.042, 16, 16]} />
          <meshBasicMaterial color={glowing ? '#fef08a' : '#ffffff'} />
        </mesh>
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

      {/* Torso */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.46, 16, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>

      {hasBackpack && (
        <mesh position={[0, 1.0, -0.18]} castShadow>
          <boxGeometry args={[0.26, 0.34, 0.14]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      )}

      {/* Arms */}
      <group position={[-0.22, 1.22, 0]} rotation={leftArmRot}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <capsuleGeometry args={[0.042, 0.44, 8, 16]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
      </group>
      <group position={[0.22, 1.22, 0]} rotation={rightArmRot}>
        <mesh position={[0, -0.24, 0]} castShadow>
          <capsuleGeometry args={[0.042, 0.44, 8, 16]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
      </group>

      {/* Legs */}
      <group position={[-0.09, 0.65, 0]} rotation={leftLegRot}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.048, 0.54, 8, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>
      <group position={[0.09, 0.65, 0]} rotation={rightLegRot}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.048, 0.54, 8, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>
    </group>
  );
};

// SCENE 1: Goodbye -> Power Awakening -> Super Speed Dash! (Frames 0 - 300)
const Scene1Street: React.FC<{ frame: number }> = ({ frame }) => {
  // Camera smoothly orbits and pulls back when he dashes
  const camX = interpolate(frame, [0, 150, 300], [-0.9, 0.5, 1.8]);
  const camZ = interpolate(frame, [0, 150, 300], [3.2, 2.7, 4.2]);
  const camY = interpolate(frame, [0, 300], [1.4, 1.8]);

  // Story progression inside Scene 1:
  // 0-120: Hugging family
  // 120-180: Power awakens (glowing aura!)
  // 180-300: Zooms down the road at 10x speed!
  const isGlowing = frame >= 120;
  const isDashing = frame >= 180;
  const heroZ = isDashing ? interpolate(frame, [180, 260], [0, -18], { extrapolateRight: 'clamp' }) : 0;
  const heroX = isDashing ? interpolate(frame, [180, 200], [0.1, 2.2], { extrapolateRight: 'clamp' }) : 0.1;

  return (
    <ThreeCanvas shadows width={1920} height={1080}>
      <CameraRig pos={[camX, camY, camZ]} lookAt={[0.3, 1.1, isDashing ? -2 : 0]} />
      <color attach="background" args={['#fde68a']} />
      <ambientLight intensity={0.65} />
      <directionalLight castShadow position={[-5, 8, 5]} intensity={1.4} color="#fef08a" />

      {/* Lawn, Sidewalk & Asphalt Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 50]} />
        <meshStandardMaterial color="#65a30d" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[2.5, 50]} />
        <meshStandardMaterial color="#d6d3d1" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 50]} />
        <meshStandardMaterial color="#292524" />
      </mesh>

      {/* House & Trees */}
      <mesh position={[-4.5, 1.8, -3]} castShadow receiveShadow>
        <boxGeometry args={[4, 3.6, 6]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
      {[-3, -9, -15].map((zPos, idx) => (
        <group key={idx} position={[-2.2, 0, zPos]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 2]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow>
            <sphereGeometry args={[0.85, 16, 16]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>
      ))}

      {/* Main Hero */}
      <Stickman
        position={[heroX, 0, heroZ]}
        rotation={[0, isDashing ? Math.PI : -0.3, 0]}
        shirtColor="#eab308"
        hasGlasses
        pose={isDashing ? 'run' : isGlowing ? 'shocked' : 'hug'}
        frame={frame}
        speedMultiplier={isDashing ? 4 : 1}
        glowing={isGlowing}
      />

      {/* Partner & Kid (Become shocked when hero glows and dashes off!) */}
      <Stickman
        position={[-0.38, 0, 0.15]}
        rotation={[0, isDashing ? 2.5 : 1.1, 0]}
        shirtColor="#c084fc"
        pose={isGlowing ? 'shocked' : 'hug'}
        frame={frame}
      />
      <Stickman
        position={[0.02, 0, 0.38]}
        rotation={[0, 3.1, 0]}
        scale={0.68}
        shirtColor="#ea580c"
        hasBackpack
        pose={isGlowing ? 'shocked' : 'hug'}
        frame={frame}
      />
    </ThreeCanvas>
  );
};

// SCENE 2: Lab Treadmill Overdrive (Frames 300 - 600)
const Scene2Lab: React.FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - 300;
  // Dynamic camera sweep around the lab
  const camX = interpolate(localFrame, [0, 150, 300], [3.6, 2.3, 1.4]);
  const camZ = interpolate(localFrame, [0, 150, 300], [3.6, 2.5, 3.2]);
  const camY = interpolate(localFrame, [0, 300], [1.8, 1.3]);

  // Speed increases progressively!
  const speedMult = interpolate(localFrame, [0, 300], [1.8, 5.0]);
  const isOverheating = localFrame > 140;

  return (
    <ThreeCanvas shadows width={1920} height={1080}>
      <CameraRig pos={[camX, camY, camZ]} lookAt={[0.2, 1.0, 0]} />
      <color attach="background" args={['#94a3b8']} />
      <ambientLight intensity={0.6} />
      <directionalLight castShadow position={[4, 7, 5]} intensity={1.3} />

      <group rotation={[0, -0.35, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[25, 25]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0, 3, -2.5]} receiveShadow>
          <boxGeometry args={[14, 6, 0.2]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>

        {/* Wall Monitors with Animated Glowing Bars! */}
        <group position={[-1.2, 2.1, -2.35]}>
          <mesh>
            <boxGeometry args={[1.8, 1.0, 0.05]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {[-0.6, -0.3, 0, 0.3, 0.6].map((barX, i) => {
            const barH = 0.2 + Math.abs(Math.sin(localFrame * 0.2 + i)) * 0.55;
            return (
              <mesh key={i} position={[barX, -0.3 + barH / 2, 0.04]}>
                <boxGeometry args={[0.15, barH, 0.02]} />
                <meshBasicMaterial color={isOverheating ? '#ef4444' : '#38bdf8'} />
              </mesh>
            );
          })}
        </group>

        <group position={[0.9, 2.1, -2.35]}>
          <mesh>
            <boxGeometry args={[1.8, 1.0, 0.05]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[1.4, 0.12 + Math.abs(Math.cos(localFrame * 0.4)) * 0.4, 0.02]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* Complete Treadmill with Support Poles Attached */}
        <mesh position={[-0.4, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.18, 3.0]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-0.4, 0.2, 0]} receiveShadow>
          <boxGeometry args={[0.95, 0.04, 2.6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Support Poles fixing the floating screen */}
        <mesh position={[-0.9, 0.7, 1.2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0.1, 0.7, 1.2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[-0.4, 1.25, 1.2]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[1.1, 0.38, 0.06]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Overheating Red Sparks / Aura on Treadmill */}
        {isOverheating && (
          <mesh position={[-0.4, 0.35, -0.6]}>
            <sphereGeometry args={[0.45 + Math.sin(localFrame * 0.9) * 0.15, 16, 16]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
          </mesh>
        )}

        {/* Runner on Treadmill */}
        <Stickman
          position={[-0.4, 0.22, 0]}
          shirtColor="#1d4ed8"
          pose="run"
          frame={localFrame}
          speedMultiplier={speedMult}
          glowing={isOverheating}
        />

        {/* Scientist Desk & Shocked Scientists */}
        <mesh position={[1.8, 0.45, -0.2]} castShadow>
          <boxGeometry args={[1.1, 0.06, 2.0]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[1.5, 0.22, -0.2]} castShadow>
          <boxGeometry args={[0.1, 0.45, 1.8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[1.6, 0.72, -0.4]}>
          <boxGeometry args={[0.08, 0.45, 0.6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <Stickman
          position={[2.2, -0.1, -0.5]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={0.85}
          shirtColor="#f8fafc"
          pose={isOverheating ? 'shocked' : 'sit'}
          frame={localFrame}
        />
        <Stickman
          position={[2.2, -0.1, 0.3]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={0.85}
          shirtColor="#f8fafc"
          pose={isOverheating ? 'shocked' : 'sit'}
          frame={localFrame}
        />
      </group>
    </ThreeCanvas>
  );
};

// SCENE 3: Outdoor Track Sprint & Failing to Stop! (Frames 600 - 900)
const Scene3Track: React.FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - 600;
  // Camera pans dynamically to follow the runner hitting the wall!
  const hasCrashed = localFrame >= 170;
  const runnerZ = interpolate(localFrame, [0, 170], [-16, 2.2], { extrapolateRight: 'clamp' });

  const camX = interpolate(localFrame, [0, 170, 300], [-1.2, -0.6, 0.2]);
  const camZ = interpolate(localFrame, [0, 170, 300], [3.8, 4.8, 4.2]);

  return (
    <ThreeCanvas shadows width={1920} height={1080}>
      <CameraRig pos={[camX, 1.6, camZ]} lookAt={[0.8, 1.1, hasCrashed ? 2.2 : 0]} />
      <color attach="background" args={['#bae6fd']} />
      <ambientLight intensity={0.7} />
      <directionalLight castShadow position={[5, 8, 4]} intensity={1.4} color="#fef9c3" />

      {/* Green Field & Red Running Track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 50]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.8, 0.01, 0]} receiveShadow>
        <planeGeometry args={[2.8, 50]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Finish Line & Brick Wall at Z = 2.6 ("Until you try to stop!") */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.8, 0.02, 1.5]}>
        <planeGeometry args={[2.8, 0.4]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1.8, 1.2, 2.7]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.4, 0.4]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* Trees */}
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

      {/* Coach in Red Tracksuit & Blue Cap (Jumps in shock when runner crashes!) */}
      <Stickman
        position={[-0.2, 0, 0.8]}
        rotation={[0, hasCrashed ? 0.8 : 0.4, 0]}
        shirtColor="#b91c1c"
        hasCap
        pose={hasCrashed ? 'shocked' : 'coach'}
        frame={localFrame}
      />
      <mesh position={[-0.02, 1.05, 1.15]} rotation={[-0.4, 0.3, 0]}>
        <boxGeometry args={[0.22, 0.3, 0.03]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>

      {/* Explosion / Crash Impact Effect when hitting the wall */}
      {hasCrashed && (
        <mesh position={[1.6, 1.1, 2.4]}>
          <sphereGeometry args={[0.9 + Math.sin(localFrame * 0.6) * 0.2, 16, 16]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.65} />
        </mesh>
      )}

      {/* Super Speed Runner Zooming Forward & Crashing into the Wall */}
      <Stickman
        position={[1.6, hasCrashed ? 0.4 : 0, runnerZ]}
        rotation={hasCrashed ? [1.4, 0, 0.5] : [0, 0, 0]}
        shirtColor="#2563eb"
        pose={hasCrashed ? 'crashed' : 'run'}
        frame={localFrame}
        speedMultiplier={4.5}
        glowing={!hasCrashed}
      />
    </ThreeCanvas>
  );
};

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();

  let subtitle = '';
  if (frame < 120) {
    subtitle = 'Imagine waking up with 10x the speed of a normal human...';
  } else if (frame < 300) {
    subtitle = 'One moment you say goodbye... the next, you vanish in a flash!';
  } else if (frame < 450) {
    subtitle = 'Scientists immediately put your speed to the test...';
  } else if (frame < 600) {
    subtitle = 'Your legs move like a blur, overheating the treadmill in seconds!';
  } else if (frame < 770) {
    subtitle = 'Out on the track, you cross the finish line before the coach blinks...';
  } else {
    subtitle = 'Super speed sounds amazing... UNTIL YOU TRY TO STOP!';
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Sequence from={0} durationInFrames={300}>
        <Audio src={staticFile('voice1.mp3')} />
      </Sequence>
      <Sequence from={300} durationInFrames={300}>
        <Audio src={staticFile('voice2.mp3')} />
      </Sequence>
      <Sequence from={600} durationInFrames={300}>
        <Audio src={staticFile('voice3.mp3')} />
      </Sequence>

      {frame < 300 ? (
        <Scene1Street frame={frame} />
      ) : frame < 600 ? (
        <Scene2Lab frame={frame} />
      ) : (
        <Scene3Track frame={frame} />
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 65,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            color: '#f8fafc',
            padding: '16px 36px',
            borderRadius: 16,
            fontSize: 36,
 fontFamily: 'sans-serif',
            fontWeight: 700,
            border: '2px solid rgba(56, 189, 248, 0.6)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
