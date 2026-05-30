import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LifestyleSection() {
  const sectionRef = useRef(null);
  const bgImageRef = useRef(null);
  const cardRef = useRef(null);
  const sunlightRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Zoom background image on scroll
    const zoomAnim = gsap.fromTo(bgImageRef.current,
      { scale: 1 },
      {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );

    // Warm sunlight leak movement
    const lightAnim = gsap.fromTo(sunlightRef.current,
      { opacity: 0.3, x: '-10%', y: '-10%', scale: 0.9 },
      {
        opacity: 0.75,
        x: '5%',
        y: '5%',
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );

    // Card reveal animation on scroll
    const cardAnim = gsap.fromTo(cardRef.current,
      { y: 150, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 50%',
          end: 'top 10%',
          scrub: 1,
        }
      }
    );

    return () => {
      zoomAnim.kill();
      lightAnim.kill();
      cardAnim.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="relative w-full h-[130vh] bg-[#3D2D2F] overflow-hidden"
    >
      {/* Sticky Background Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Full-width image with slight zoom parallax */}
        <img 
          ref={bgImageRef}
          src="/heroin.png" 
          alt="Nykaa Campaign Showcase"
          className="absolute inset-0 w-full h-full object-cover object-[center_20%] opacity-85"
        />

        {/* Ambient Dark Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2D2F]/80 via-transparent to-[#3D2D2F]/45 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2D2F]/70 via-[#3D2D2F]/20 to-transparent pointer-events-none" />

        {/* Warm Sunlight Light-leak Effect */}
        <div 
          ref={sunlightRef}
          className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-[#ECCFA8] via-[#F5E6E8]/30 to-transparent mix-blend-screen pointer-events-none filter blur-[90px] opacity-45"
        />

        {/* Floating Particles (Soft glowy sparkles) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-[#FAF4ED] rounded-full animate-float blur-[1px] opacity-40" />
          <div className="absolute top-[50%] left-[80%] w-3 h-3 bg-[#ECCFA8] rounded-full animate-float-slow blur-[2px] opacity-30" />
          <div className="absolute top-[80%] left-[45%] w-1.5 h-1.5 bg-[#F5E6E8] rounded-full animate-float-fast blur-[1px] opacity-50" />
        </div>

        {/* Content Layout Grid */}
        <div className="relative w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-start z-30">
          
          {/* Glassmorphism content card */}
          <div 
            ref={cardRef}
            className="glass-panel w-full max-w-lg p-8 md:p-12 rounded-3xl border border-[#FAF4ED]/20 shadow-2xl text-left"
          >
            {/* Tagline */}
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-[#C49A6C]" />
              <span className="text-[10px] tracking-[0.3em] font-semibold text-[#8A7174] uppercase">
                Premium Campaign
              </span>
            </div>

            {/* Title */}
            <h2 className="font-playfair text-3xl md:text-5xl font-light text-[#3D2D2F] leading-tight mb-6">
              Skincare That <br />
              Feels Like <span className="italic text-[#C49A6C]">Luxury</span>
            </h2>

            {/* Description */}
            <p className="font-montserrat text-xs md:text-sm text-[#5C4548] leading-relaxed tracking-wider mb-8">
              Experience deep hydration and radiant skin with Nykaa Naturals Rosé & Niacinamide Glow Boost Face Cream. Enriched with natural damask rose extract and science-backed niacinamide to soothe, hydrate, and reveal your skin's inner glow.
            </p>

            {/* CTA Button */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => {
                  // Action for Shop Now - scroll down to final showcase or trigger redirect
                  const nextSection = document.getElementById('product-details-section');
                  if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="luxury-btn flex items-center gap-3 px-8 py-4 bg-rose-gold-gradient text-white rounded-full text-xs font-semibold tracking-[0.2em] uppercase shadow-lg shadow-rosegold-400/20 group"
              >
                <ShoppingBag size={14} />
                Shop Now
              </button>

              <div className="hidden sm:flex flex-col text-left">
                <span className="font-playfair text-base font-semibold text-[#3D2D2F]">₹349.00</span>
                <span className="text-[9px] text-[#8A7174] tracking-widest uppercase">Special Price</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Indicator */}
        <div className="absolute left-10 bottom-24 hidden lg:flex flex-col gap-6 text-[#FAF4ED] text-[9px] tracking-[0.25em] uppercase font-semibold">
          <span className="opacity-40">02 / Lifestyle</span>
          <div className="w-[1px] h-16 bg-[#FAF4ED]/30 self-center" />
        </div>

      </div>
    </div>
  );
}
