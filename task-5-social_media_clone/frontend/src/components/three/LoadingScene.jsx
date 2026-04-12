import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function LoadingRing() {
  const ring = useRef();
  const ring2 = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ring.current) {
      ring.current.rotation.x = time * 1.5;
      ring.current.rotation.z = time * 0.5;
    }
    if (ring2.current) {
      ring2.current.rotation.y = time * 1.2;
      ring2.current.rotation.x = time * 0.8;
    }
  });

  return (
    <group>
      <mesh ref={ring}>
        <torusGeometry args={[1.5, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[1.8, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

function FloatingParticles({ count = 80 }) {
  const mesh = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c084fc"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function LoadingScene() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      <div className="w-64 h-64 relative">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#8b5cf6" />
          <LoadingRing />
          <FloatingParticles />
        </Canvas>
      </div>
      <div className="text-center mt-4 animate-fade-in">
        <h1 className="text-3xl font-serif tracking-wider font-semibold gradient-text mb-2">
          Vibegram
        </h1>
        <p className="text-neutral-500 text-sm">Loading your feed...</p>
      </div>
    </div>
  );
}
