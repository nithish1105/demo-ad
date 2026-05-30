import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CloudTransition() {
  const containerRef = useRef(null);
  const cloudLeftRef = useRef(null);
  const cloudRightRef = useRef(null);
  const cloudCenterRef = useRef(null);
  const mistOverlayRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Timeline for coordinated cloud and mist movement
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom', // Start animating when section enters viewport
        end: 'bottom top',   // Complete when section leaves viewport
        scrub: 1,            // Smooth animation linked to scroll
      }
    });

    // Animate cloud layers
    tl.to(cloudLeftRef.current, {
      x: '150%',
      y: '-20px',
      opacity: 0.8,
      ease: 'none'
    }, 0)
    .to(cloudRightRef.current, {
      x: '-150%',
      y: '30px',
      opacity: 0.8,
      ease: 'none'
    }, 0)
    .to(cloudCenterRef.current, {
      y: '-50px',
      scale: 1.15,
      opacity: 0.9,
      ease: 'none'
    }, 0)
    .fromTo(mistOverlayRef.current, 
      { opacity: 0 },
      { 
        opacity: 0.95,
        yoyo: true,
        repeat: 1, // Go to 100% opacity in middle, then fade out
        ease: 'power2.inOut'
      }, 0
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[100vh] bg-gradient-to-b from-[#FAF4ED] via-[#FFFFFF] to-[#F5E6E8] overflow-hidden z-25 flex items-center justify-center"
    >
      {/* Full screen solid/gradient mist that wipes the screen in the middle of scroll */}
      <div 
        ref={mistOverlayRef}
        className="absolute inset-0 bg-gradient-to-r from-[#FAF4ED] via-[#FFFFFF] to-[#F5E6E8] opacity-0 mix-blend-normal z-40 pointer-events-none filter blur-sm"
      />

      {/* Background Soft Glow */}
      <div className="absolute w-[500px] h-[300px] bg-blush-100/50 rounded-full blur-[100px] top-1/4 left-1/4 pointer-events-none" />
      <div className="absolute w-[400px] h-[350px] bg-rosegold-50/40 rounded-full blur-[90px] bottom-1/4 right-1/4 pointer-events-none" />

      {/* Layered Cloud SVG Left */}
      <div 
        ref={cloudLeftRef}
        className="absolute left-[-50%] top-[10%] w-[90%] md:w-[60%] opacity-40 z-20 pointer-events-none transition-transform"
      >
        <svg viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M540 180C540 130 500 90 450 90C440 90 430 92 420 96C395 56 350 30 300 30C235 30 180 75 170 136C155 126 138 120 120 120C65 120 20 165 20 220C20 275 65 320 120 320H450C500 320 540 280 540 230C540 210 530 192 515 180Z" 
            fill="url(#cloudGradLeft)"
          />
          <defs>
            <linearGradient id="cloudGradLeft" x1="170" y1="30" x2="350" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#FAF0F2" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#EAD1D5" stopOpacity="0.3" />
            </linearGradient>
            <filter id="blurLeft">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Layered Cloud SVG Right */}
      <div 
        ref={cloudRightRef}
        className="absolute right-[-50%] bottom-[15%] w-[95%] md:w-[65%] opacity-40 z-20 pointer-events-none transition-transform"
      >
        <svg viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M500 160C500 120 468 88 428 88C420 88 412 90 404 93C384 61 348 40 308 40C256 40 212 76 204 125C192 117 178 112 164 112C120 112 84 148 84 192C84 236 120 272 164 272H428C468 272 500 240 500 196C500 180 492 165 480 155Z" 
            fill="url(#cloudGradRight)"
          />
          <defs>
            <linearGradient id="cloudGradRight" x1="308" y1="40" x2="250" y2="272" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
              <stop offset="60%" stopColor="#FAF4ED" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ECCFA8" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Center Fluffy Mist (Slow vertical float) */}
      <div 
        ref={cloudCenterRef}
        className="absolute w-[80%] md:w-[50%] h-[35%] opacity-30 z-10 pointer-events-none blur-[40px] bg-gradient-to-br from-[#FFFFFF] via-[#FAF0F2] to-[#EAD1D5] rounded-full"
      />

      {/* Floating Transition Content */}
      <div className="relative text-center px-6 z-30 flex flex-col items-center pointer-events-none">
        <span className="text-[10px] md:text-xs tracking-[0.4em] font-semibold text-rosegold-500 uppercase mb-3">
          Deep Hydration
        </span>
        <h3 className="font-playfair text-3xl md:text-5xl font-light text-[#5C4548] leading-tight mb-4">
          A Symphony of Rosé & Niacinamide
        </h3>
        <p className="font-montserrat text-xs md:text-sm text-[#8A7174] max-w-md tracking-wider leading-relaxed">
          Watch as the soft formula transforms your skin, drifting like light clouds, bringing a soft-focus velvet radiance.
        </p>
        
        {/* Soft elegant line down */}
        <div className="w-[1px] h-16 bg-[#C49A6C]/30 mt-10 animate-pulse" />
      </div>

      {/* Parallax Floating Petal Hint */}
      <div className="absolute right-[15%] top-[15%] opacity-35 z-20 pointer-events-none hidden md:block">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C49A6C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="animate-float">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>
  );
}
