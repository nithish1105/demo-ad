import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Droplet, Sparkles, Leaf, Sun, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const INGREDIENTS = [
  {
    name: 'Hyaluronic Acid',
    description: 'Deep Moisture Lock. Infuses skin cells with multi-layer hydration, plumping dry lines and leaving a dewy, bouncy complexion.',
    icon: Droplet,
    color: '#D1C6DF', // Soft Lavender/Blue tint
    glow: 'rgba(209, 198, 223, 0.3)'
  },
  {
    name: 'Niacinamide',
    description: 'Brighten & Smooth. Strengthens skin barriers, minimizes enlarged pores, balances sebum, and visibly fades dark spots.',
    icon: Sparkles,
    color: '#ECCFA8', // Warm Rose Gold tint
    glow: 'rgba(236, 207, 168, 0.3)'
  },
  {
    name: 'Aloe Vera',
    description: 'Soothe & Calm. Loaded with vitamins and minerals to cool irritation, reduce redness, and restore skin barrier health.',
    icon: Leaf,
    color: '#D2EAD1', // Soft Green tint
    glow: 'rgba(210, 234, 209, 0.3)'
  },
  {
    name: 'Vitamin C',
    description: 'Radiance Boost. A powerful antioxidant shield that brightens dull skin, boosts natural collagen, and evens out tone.',
    icon: Sun,
    color: '#FFE1D3', // Soft Peach/Nude tint
    glow: 'rgba(255, 225, 211, 0.3)'
  }
];

export default function ProductDetails() {
  const containerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const textContentRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Parallax floating motion for left-side product image
    const imageAnim = gsap.fromTo(imageWrapperRef.current,
      { y: 60, scale: 0.95, rotate: -2 },
      {
        y: -60,
        scale: 1.05,
        rotate: 2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      }
    );

    // Staggered reveal for ingredient cards
    const cardsAnim = gsap.fromTo(cardsRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: textContentRef.current,
          start: 'top 75%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    return () => {
      imageAnim.kill();
      cardsAnim.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      id="product-details-section"
      ref={containerRef}
      className="relative w-full min-h-screen py-24 md:py-32 bg-gradient-to-b from-[#FAF4ED] via-[#FFFFFF] to-[#F5E6E8] overflow-hidden"
    >
      {/* Background Soft Aura */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-blush-100/30 filter blur-[120px] top-1/3 right-[-200px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rosegold-50/40 filter blur-[100px] bottom-1/4 left-[-150px] pointer-events-none" />

      {/* Grid Layout Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Product Image Display */}
        <div className="lg:col-span-5 flex justify-center items-center z-20">
          <div 
            ref={imageWrapperRef}
            className="relative w-full max-w-[420px] aspect-[4/5] rounded-[36px] overflow-hidden shadow-[0_20px_50px_rgba(61,45,47,0.06)] border border-white/60 p-4 bg-white/30 backdrop-blur-md group"
          >
            {/* Glossy Reflection Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 opacity-70 z-10 pointer-events-none" />
            
            {/* The Image */}
            <img 
              src="/details.png" 
              alt="Nykaa Rosé Glow Details" 
              className="w-full h-full object-cover rounded-[28px] transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Floating Luxury Tag */}
            <div className="absolute bottom-8 right-8 glass-panel py-3 px-5 rounded-full z-20 border border-white/40 flex items-center gap-2 shadow-lg animate-float-fast">
              <Award size={14} className="text-[#C49A6C]" />
              <span className="text-[9px] font-bold tracking-[0.25em] text-[#5C4548] uppercase">
                100% Vegan Formula
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details Text & Ingredient Cards */}
        <div ref={textContentRef} className="lg:col-span-7 flex flex-col justify-center text-left z-20">
          
          {/* Section Header */}
          <div className="mb-10">
            <span className="text-[10px] md:text-xs tracking-[0.3em] font-semibold text-[#8A7174] uppercase block mb-3">
              Pure Ingredients, Science-Backed Results
            </span>
            <h2 className="font-playfair text-3xl md:text-5xl font-light text-[#3D2D2F] leading-tight mb-4">
              Powered By <span className="italic text-rose-gold-gradient">Skin-Loving</span> Ingredients
            </h2>
            <div className="w-16 h-[1.5px] bg-[#C49A6C] rounded" />
          </div>

          {/* Grid of Ingredient Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {INGREDIENTS.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  ref={el => cardsRef.current[index] = el}
                  className="glass-panel group relative p-6 md:p-8 rounded-[28px] border border-white/50 bg-white/45 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between"
                  style={{
                    '--hover-glow': item.glow
                  }}
                >
                  {/* Subtle Background Glow behind the card icon */}
                  <div 
                    className="absolute w-24 h-24 rounded-full filter blur-[20px] top-[-20px] right-[-20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: item.color }}
                  />

                  <div>
                    {/* Icon Container with glowing background */}
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm border transition-all duration-500 group-hover:scale-110"
                      style={{ 
                        backgroundColor: '#FFFFFF',
                        borderColor: '#FAF0F2',
                        boxShadow: `0 8px 24px ${item.glow}` 
                      }}
                    >
                      <IconComponent size={20} className="text-[#C49A6C]" />
                    </div>

                    {/* Ingredient Name */}
                    <h3 className="font-playfair text-lg md:text-xl font-semibold text-[#3D2D2F] tracking-wide mb-3">
                      {item.name}
                    </h3>

                    {/* Ingredient Description */}
                    <p className="font-montserrat text-xs text-[#5C4548] leading-relaxed tracking-wider">
                      {item.description}
                    </p>
                  </div>

                  {/* Tiny rose-gold detail line that expands on hover */}
                  <div className="w-0 h-[2px] bg-rose-gold-gradient group-hover:w-full transition-all duration-500 mt-6 rounded" />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Section Indicator */}
      <div className="absolute left-10 bottom-24 hidden lg:flex flex-col gap-6 text-[#9C764A] text-[9px] tracking-[0.25em] uppercase font-semibold">
        <span className="opacity-40">03 / Science</span>
        <div className="w-[1px] h-16 bg-[#C49A6C]/30 self-center" />
      </div>
    </div>
  );
}
