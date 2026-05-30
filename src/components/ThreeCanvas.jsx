import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Single Petal Component
function Petal({ speed, factor, url, color, ...props }) {
  const meshRef = useRef();
  
  // Create a custom organic petal-like geometry using custom curves
  const petalGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];
    const indices = [];
    
    // Generate a simple grid that curves upwards and taper at the ends
    const segments = 10;
    for (let i = 0; i <= segments; i++) {
      const v = i / segments; // 0 to 1
      const y = (v - 0.5) * 2; // -1 to 1
      
      for (let j = 0; j <= segments; j++) {
        const u = j / segments; // 0 to 1
        const x = (u - 0.5) * 2; // -1 to 1
        
        // Taper shape: narrow at top (y=1) and bottom (y=-1), wide in middle
        const widthFactor = Math.sin(v * Math.PI);
        const rx = x * 0.45 * widthFactor;
        const ry = y * 0.8;
        
        // Curve: bend the petal in Z space to make it organic and cup-shaped
        const rz = (Math.sin(v * Math.PI) * 0.2) + (x * x * 0.15);
        
        vertices.push(rx, ry, rz);
        uvs.push(u, v);
      }
    }
    
    // Indices for grid
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = i * (segments + 1) + j + 1;
        const c = (i + 1) * (segments + 1) + j;
        const d = (i + 1) * (segments + 1) + j + 1;
        
        // Face 1
        indices.push(a, b, c);
        // Face 2
        indices.push(b, d, c);
      }
    }
    
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Set initial random rotations
  const randoms = useMemo(() => ({
    x: Math.random() * Math.PI,
    y: Math.random() * Math.PI,
    z: Math.random() * Math.PI,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
    speedZ: (Math.random() - 0.5) * 0.4,
    driftSpeed: 0.2 + Math.random() * 0.4
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Smooth drift down and rotate
    meshRef.current.position.y -= randoms.driftSpeed * speed * 0.05;
    meshRef.current.position.x += Math.sin(time + props.index) * 0.01;
    meshRef.current.position.z += Math.cos(time + props.index) * 0.005;
    
    meshRef.current.rotation.x += randoms.speedX * 0.02;
    meshRef.current.rotation.y += randoms.speedY * 0.02;
    meshRef.current.rotation.z += randoms.speedZ * 0.01;
    
    // Recycle petal when it falls out of view
    if (meshRef.current.position.y < -6) {
      meshRef.current.position.y = 6;
      meshRef.current.position.x = (Math.random() - 0.5) * 12;
      meshRef.current.position.z = (Math.random() - 0.5) * 8;
    }
  });

  return (
    <mesh ref={meshRef} geometry={petalGeometry} {...props}>
      <meshStandardMaterial 
        color={color} 
        side={THREE.DoubleSide} 
        roughness={0.2}
        metalness={0.1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Glowing background dust particles
function Sparkles() {
  const pointsRef = useRef();
  
  const count = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Wave movements
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#C49A6C" // Rose Gold glow
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Mouse Follower Soft Light
function LightFollower() {
  const lightRef = useRef();
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (!lightRef.current) return;
    
    // Convert 2D screen coordinates to 3D positions
    const targetX = (state.pointer.x * viewport.width) / 2;
    const targetY = (state.pointer.y * viewport.height) / 2;
    
    // Smooth lerping
    lightRef.current.position.x += (targetX - lightRef.current.position.x) * 0.08;
    lightRef.current.position.y += (targetY - lightRef.current.position.y) * 0.08;
  });

  return (
    <pointLight 
      ref={lightRef} 
      distance={6} 
      intensity={3.5} 
      color="#F5E6E8" // Blush Pink Light
    />
  );
}

export default function ThreeCanvas() {
  // Define a nice set of soft pink and rose gold petals
  const petals = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      // Alternate colors between Blush Pink (#F5E6E8) and Rose Gold (#C49A6C) and lavender-pink
      const colors = ['#F5E6E8', '#ECCFA8', '#C49A6C', '#EAD1D5', '#FFF0E8'];
      const color = colors[i % colors.length];
      
      return {
        id: i,
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12 - 2, // Distributed on screen
          (Math.random() - 0.5) * 6
        ],
        scale: 0.15 + Math.random() * 0.25,
        speed: 0.4 + Math.random() * 0.8,
        factor: 0.5 + Math.random() * 0.5,
        color: color
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 w-full h-full opacity-70">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.8} color="#FFFFFF" />
        <directionalLight position={[2, 4, 3]} intensity={1.5} color="#FAF4ED" />
        
        {/* Soft interactive mouse light */}
        <LightFollower />

        {/* Petals system */}
        {petals.map((petal) => (
          <Petal
            key={petal.id}
            index={petal.id}
            position={petal.position}
            scale={petal.scale}
            speed={petal.speed}
            factor={petal.factor}
            color={petal.color}
          />
        ))}

        {/* Floating dust particles */}
        <Sparkles />
      </Canvas>
    </div>
  );
}
