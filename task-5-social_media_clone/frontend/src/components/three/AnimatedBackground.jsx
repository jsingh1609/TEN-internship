import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 200 }) {
  const mesh = useRef();
  const light = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      scales[i] = Math.random() * 0.5 + 0.1;
      speeds[i] = Math.random() * 0.002 + 0.001;
    }
    return { positions, scales, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += particles.speeds[i] * 1.5;
      positions[i3] += Math.sin(time * 0.5 + i) * 0.002;

      if (positions[i3 + 1] > 15) {
        positions[i3 + 1] = -15;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.03;
    mesh.current.rotation.z = time * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#f472b6"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function GradientTorus({ color = "#c084fc", radius = 4, tube = 0.02, speed = 1, opacity = 0.3 }) {
  const mesh = useRef();

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    mesh.current.rotation.x = time * 0.1 * speed;
    mesh.current.rotation.y = time * 0.15 * speed;
    mesh.current.position.z = Math.sin(time * 0.2) * 2 - 2;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -3]}>
      <torusGeometry args={[radius, tube, 16, 100]} />
      <meshStandardMaterial
        color={color}
        wireframe={false}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function GradientSphere({ color = "#4c1d95", scale = 1, speed = 1, opacity = 0.08 }) {
  const mesh = useRef();

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    mesh.current.rotation.x = time * 0.05 * speed;
    mesh.current.rotation.y = time * 0.08 * speed;
    mesh.current.position.x = Math.sin(time * 0.3) * 0.5;
    mesh.current.position.y = Math.cos(time * 0.2) * 0.3;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -5]} scale={[scale, scale, scale]}>
      <icosahedronGeometry args={[3, 4]} />
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

export default function AnimatedBackground() {
  return (
    <div className="three-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#d946ef" />
        <Particles count={400} />
        <GradientSphere color="#4c1d95" scale={1.5} speed={0.5} opacity={0.04} />
        <GradientTorus color="#c084fc" radius={5} speed={-0.3} />
        <GradientTorus color="#fb7185" radius={3} speed={0.6} opacity={0.2} />
      </Canvas>
    </div>
  );
}
