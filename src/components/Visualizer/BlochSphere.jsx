/**
 * @file BlochSphere.jsx
 * @description Interactive 3D Bloch sphere visualization using Three.js via @react-three/fiber.
 * Shows current qubit state as a vector on the sphere.
 */
import PropTypes from 'prop-types';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { getBlochVector } from '../../utils/quantum';

/**
 * Bloch sphere state vector + sphere mesh.
 */
function BlochSphereScene({ angle }) {
  const vectorRef = useRef();
  const { x, y, z } = getBlochVector(angle);

  // Slowly rotate for visual interest
  useFrame((_, delta) => {
    if (vectorRef.current) {
      vectorRef.current.rotation.y += delta * 0.3;
    }
  });

  const arrowPoints = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(x * 0.9, z * 0.9, y * 0.9),
  ], [x, y, z]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#00D4FF" />
      <pointLight position={[-3, -3, -3]} intensity={0.5} color="#9945FF" />

      <group ref={vectorRef}>
        {/* Wireframe sphere */}
        <Sphere args={[1, 24, 24]}>
          <meshStandardMaterial
            color="#00D4FF"
            wireframe
            transparent
            opacity={0.15}
          />
        </Sphere>

        {/* Equator ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.005, 8, 64]} />
          <meshBasicMaterial color="#00D4FF" transparent opacity={0.3} />
        </mesh>

        {/* Axes */}
        {/* Z-axis */}
        <Line points={[new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, 1.2, 0)]} color="#ffffff" lineWidth={0.5} transparent opacity={0.3} />
        {/* X-axis */}
        <Line points={[new THREE.Vector3(-1.2, 0, 0), new THREE.Vector3(1.2, 0, 0)]} color="#ffffff" lineWidth={0.5} transparent opacity={0.3} />
        {/* Y-axis */}
        <Line points={[new THREE.Vector3(0, 0, -1.2), new THREE.Vector3(0, 0, 1.2)]} color="#ffffff" lineWidth={0.5} transparent opacity={0.3} />

        {/* Axis labels */}
        <Text position={[0, 1.4, 0]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">|0⟩</Text>
        <Text position={[0, -1.4, 0]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle">|1⟩</Text>
        <Text position={[1.4, 0, 0]} fontSize={0.12} color="#00D4FF" anchorX="center">|+⟩</Text>
        <Text position={[-1.4, 0, 0]} fontSize={0.12} color="#9945FF" anchorX="center">|−⟩</Text>

        {/* State vector */}
        <Line
          points={arrowPoints}
          color="#00FF88"
          lineWidth={3}
        />

        {/* Vector tip */}
        <mesh position={[x * 0.9, z * 0.9, y * 0.9]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#00FF88"
            emissive="#00FF88"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Pole markers */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, -1, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </>
  );
}

BlochSphereScene.propTypes = {
  angle: PropTypes.number.isRequired,
};

/**
 * Bloch sphere wrapper with controls and angle display.
 * @param {{ angle: number, label: string }} props
 */
export default function BlochSphere({ angle = 0, label = '' }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Bloch Sphere</h3>
        <span className="text-xs font-mono text-quantum-green/70">
          θ = {angle}°
        </span>
      </div>

      <div className="bloch-container rounded-xl overflow-hidden" style={{ height: 220 }}>
        <Canvas camera={{ position: [2, 1.5, 2.5], fov: 50 }}>
          <BlochSphereScene angle={angle} />
          <OrbitControls enablePan={false} minDistance={2} maxDistance={5} />
        </Canvas>
      </div>

      {label && (
        <div className="text-center">
          <span className="text-xs text-quantum-green font-mono">{label}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs text-white/40">
        <div className="text-center p-2 rounded-lg bg-white/3">
          <div className="font-mono text-quantum-blue">{Math.cos((angle * Math.PI) / 180).toFixed(3)}</div>
          <div>cos(θ) = α</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-white/3">
          <div className="font-mono text-quantum-green">{Math.sin((angle * Math.PI) / 180).toFixed(3)}</div>
          <div>sin(θ) = β</div>
        </div>
      </div>

      <p className="text-[11px] text-white/25 text-center">
        Drag to rotate · |ψ⟩ = α|0⟩ + β|1⟩
      </p>
    </div>
  );
}

BlochSphere.propTypes = {
  angle: PropTypes.number,
  label: PropTypes.string,
};
