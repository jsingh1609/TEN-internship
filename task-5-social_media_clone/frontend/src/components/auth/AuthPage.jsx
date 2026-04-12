import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAuth } from '../../context/AuthContext';

function AuthParticles({ count = 100 }) {
  const mesh = useRef();
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#8b5cf6" transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        if (formData.password !== formData.password2) {
          setError("Passwords don't match.");
          setLoading(false);
          return;
        }
        await register(formData);
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (typeof errorData === 'object') {
        const firstError = Object.values(errorData)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} color="#8b5cf6" intensity={0.8} />
          <AuthParticles />
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-down-fade">
          <h1 className="text-5xl font-serif tracking-wider font-semibold gradient-text mb-2">
            Vibegram
          </h1>
          <p className="text-neutral-500 text-sm">Share your moments with the world</p>
        </div>

        {/* Form Card */}
        <div className="glass-dark rounded-2xl p-8 animate-scale-in shadow-2xl shadow-purple-900/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="flex gap-3">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500/50 transition-colors text-sm"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500/50 transition-colors text-sm"
                />
              </div>
            )}

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500/50 transition-colors text-sm"
            />

            {!isLogin && (
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500/50 transition-colors text-sm"
              />
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500/50 transition-colors text-sm"
            />

            {!isLogin && (
              <input
                type="password"
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500/50 transition-colors text-sm"
              />
            )}

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2 px-3 border border-red-500/20 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Log In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-4 text-neutral-500 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ username: '', email: '', password: '', password2: '', first_name: '', last_name: '' });
            }}
            className="w-full text-center text-sm"
          >
            {isLogin ? (
              <span className="text-neutral-400">
                Don't have an account?{' '}
                <span className="text-purple-400 font-semibold hover:text-purple-300 transition-colors cursor-pointer">
                  Sign up
                </span>
              </span>
            ) : (
              <span className="text-neutral-400">
                Already have an account?{' '}
                <span className="text-purple-400 font-semibold hover:text-purple-300 transition-colors cursor-pointer">
                  Log in
                </span>
              </span>
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-neutral-600 text-xs mt-8">
          © 2026 Vibegram from Vibecode Internship
        </p>
      </div>
    </div>
  );
}
