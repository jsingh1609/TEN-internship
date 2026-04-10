import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

// Simple test component to verify WebGL is working
function TestCube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

function DebugTest() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <h1 style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
        WebGL Debug Test
      </h1>
      
      <div style={{ width: '400px', height: '400px', margin: '0 auto', background: '#222' }}>
        <Suspense fallback={<div style={{ color: 'white' }}>Loading...</div>}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <TestCube />
          </Canvas>
        </Suspense>
      </div>
      
      <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
        <p>If you see a pink cube above, WebGL is working!</p>
        <p>If not, check the browser console for errors.</p>
      </div>
    </div>
  );
}

export default DebugTest;
