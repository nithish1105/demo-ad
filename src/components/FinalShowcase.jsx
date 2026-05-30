import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';

// 3D Product Billboard Component
function ProductCard() {
  const meshRef = useRef();
  
  // Load the upright product jar frame as a texture
  const texture = useMemo(() => {
    return new THREE.TextureLoader().load('/hero/ezgif-frame-115.jpg');
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Gentle floating motion
    meshRef.current.position.y = Math.sin(time * 0.8) * 0.15;
    
    // Smooth mouse-following tilt
    const targetRotX = state.pointer.y * 0.25;
    const targetRotY = state.pointer.x * 0.35;
    
    meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.1;
    meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.1;
    meshRef.current.rotation.z = Math.sin(time * 0.4) * 0.02; // Slight twist
  });

  return (
    <group ref={meshRef}>
      {/* Back metallic card */}
      <mesh position={[0, 0, -0.05]}>
        <roundedBoxGeometry args={[2.2, 2.2, 0.08]} />
        <meshStandardMaterial 
          color="#C49A6C" // Rose Gold
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      {/* Front texture card */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.1, 2.1]} />
        <meshStandardMaterial 
          map={texture}
          roughness={0.3}
          metalness={0.0}
          transparent
        />
      </mesh>

      {/* Decorative frame border */}
      <mesh position={[0, 0, 0.02]}>
        <ringGeometry args={[1.4, 1.45, 4]} />
        <meshBasicMaterial color="#C49A6C" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Sparkle particles for 3D environment
function OrbitingSparkles() {
  const pointsRef = useRef();
  const count = 40;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.0 + Math.random() * 1.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#ECCFA8"
        size={0.08}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Simple fallback geometry for Three.js roundedBox
function RoundedBoxFallback() {
  const meshRef = useRef();
  
  const texture = useMemo(() => {
    return new THREE.TextureLoader().load('/hero/ezgif-frame-115.jpg');
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(time * 0.8) * 0.15;
    
    const targetRotX = state.pointer.y * 0.25;
    const targetRotY = state.pointer.x * 0.35;
    
    meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.1;
    meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.1;
  });

  return (
    <group ref={meshRef}>
      {/* Card Backing */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[2.3, 2.3, 0.05]} />
        <meshStandardMaterial 
          color="#C49A6C"
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      {/* Front texture */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshStandardMaterial 
          map={texture}
          transparent
        />
      </mesh>
    </group>
  );
}

export default function FinalShowcase() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#F5E6E8] to-[#FAF4ED] flex flex-col justify-between overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute w-[600px] h-[300px] bg-white rounded-full blur-[100px] top-10 left-1/2 -translate-x-1/2 opacity-60 pointer-events-none" />
      <div className="absolute top-[20%] left-[-100px] w-64 h-64 bg-rosegold-100 rounded-full blur-[80px] opacity-40 pointer-events-none" />

      {/* Large horizontal scrolling outlined background text */}
      <div className="absolute top-[25%] left-0 w-full overflow-hidden whitespace-nowrap pointer-events-none select-none z-10 opacity-[0.06]">
        <span className="font-playfair text-[9vw] font-bold text-[#3D2D2F] tracking-[0.2em] uppercase stroke-text">
          REVEAL YOUR NATURAL GLOW • REVEAL YOUR NATURAL GLOW
        </span>
      </div>

      {/* Main Content Showcase */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-24 pb-12 flex flex-col items-center justify-center flex-grow w-full text-center">
        
        {/* Animated Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 mb-4"
        >
          <Sparkles size={14} className="text-[#C49A6C]" />
          <span className="text-[10px] tracking-[0.3em] font-semibold text-[#8A7174] uppercase">
            Nykaa Naturals Glow Campaign
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-playfair text-4xl md:text-6xl font-light text-[#3D2D2F] tracking-wide mb-2"
        >
          Reveal Your <span className="italic text-rose-gold-gradient block sm:inline">Natural Glow</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-montserrat text-xs md:text-sm text-[#5C4548] tracking-widest uppercase mb-8"
        >
          Experience Rosé & Niacinamide Daily
        </motion.p>

        {/* 3D Render Viewport */}
        <div className="w-full max-w-[400px] h-[340px] cursor-grab active:cursor-grabbing mb-8 flex justify-center items-center">
          <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }}>
            <ambientLight intensity={1.8} />
            <directionalLight position={[3, 5, 2]} intensity={1.5} color="#FAF4ED" />
            <pointLight position={[-3, -3, 2]} intensity={0.5} color="#C49A6C" />
            
            <RoundedBoxFallback />
            <OrbitingSparkles />
          </Canvas>
        </div>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="z-30"
        >
          <a
            href="https://www.nykaa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="luxury-btn inline-flex items-center gap-3 px-10 py-5 bg-rose-gold-gradient text-white rounded-full text-xs font-semibold tracking-[0.25em] uppercase shadow-lg shadow-rosegold-400/25 group"
          >
            Discover Nykaa Naturals
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

      </div>

      {/* Premium Minimal Footer */}
      <footer className="relative w-full bg-gradient-to-t from-blush-100/40 to-transparent pt-12 pb-8 border-t border-rosegold-200/10 z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          
          {/* Logo Brand info */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="font-playfair text-xl tracking-widest text-[#5C4548] mb-1">
              NYKAA
            </h3>
            <span className="text-[9px] tracking-[0.25em] text-rosegold-500 font-semibold uppercase">
              Naturals Beauty
            </span>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] tracking-[0.2em] font-semibold text-[#8A7174] uppercase">
            <a href="#product-details-section" className="hover:text-[#C49A6C] transition-colors">Ingredients</a>
            <a href="https://www.nykaa.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C49A6C] transition-colors">Products</a>
            <a href="https://www.nykaa.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C49A6C] transition-colors">Nykaa Luxury</a>
          </div>

          {/* Copyright details */}
          <div className="text-[10px] text-[#8A7174] tracking-wider text-center md:text-right flex items-center gap-1">
            <span>© 2026 Nykaa Campaign. Crafted with</span>
            <Heart size={10} className="text-[#C49A6C] fill-[#C49A6C]" />
            <span>for luxury skincare.</span>
          </div>

        </div>
      </footer>

      {/* Styling for outlined stroke-text inside this component context */}
      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(61, 45, 47, 0.15);
          color: transparent;
        }
      `}</style>
      
    </div>
  );
}
