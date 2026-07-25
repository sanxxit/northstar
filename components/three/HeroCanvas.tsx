"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ---------- rotating particle funnel (the "growth engine") ---------- */
function FunnelParticles({ count = 2800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const maxR = 2.7;
    for (let i = 0; i < count; i++) {
      const h = Math.random(); // 0 = narrow bottom, 1 = wide top
      const angle = Math.random() * Math.PI * 2 + h * 6.2; // swirl
      const r = Math.pow(h, 0.85) * maxR * (0.82 + Math.random() * 0.18);
      positions[i * 3 + 0] = Math.cos(angle) * r;
      positions[i * 3 + 1] = h * 4.3 - 2.15;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y += delta * 0.14;
    const px = state.pointer.x;
    const py = state.pointer.y;
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, px * 0.28, 0.04);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -py * 0.24 + 0.12, 0.04);
  });

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.021}
        color="#757ca8"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- glowing distorted core ---------- */
function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.92, 64, 64]} />
      <MeshDistortMaterial
        color="#242844"
        emissive="#3b4066"
        emissiveIntensity={0.12}
        roughness={0.5}
        metalness={0.3}
        distort={0.38}
        speed={1.2}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 4]} intensity={16} color="#6366f1" />
      <pointLight position={[-4, -2, -3]} intensity={8} color="#3a4a66" />
      <Core />
      <FunnelParticles />
    </>
  );
}

/* ---------- calm CSS fallback (SSR + reduced motion) ---------- */
function StaticFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="animate-pulse-glow h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.16),_transparent_65%)] blur-2xl" />
    </div>
  );
}

export default function HeroCanvas() {
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReady(true);
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!ready || reduce) return <StaticFallback />;

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
