import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 230;

export default function HeroSequence({ onLoadingComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  
  const [images, setImages] = useState([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages = [];

    const preloadImages = async () => {
      const promises = Array.from({ length: TOTAL_FRAMES }).map((_, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          const frameNum = String(index + 1).padStart(3, '0');
          img.src = `/hero/ezgif-frame-${frameNum}.jpg`;
          
          img.onload = () => {
            loadedCount++;
            const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
            setLoadProgress(progress);
            loadedImages[index] = img;
            resolve();
          };

          img.onerror = () => {
            // Graceful fallback for single frame error
            loadedCount++;
            resolve();
          };
        });
      });

      await Promise.all(promises);
      setImages(loadedImages);
      setIsLoaded(true);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    };

    preloadImages();
  }, []);

  // Set up Canvas Scroll Animation
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set internal resolution
    canvas.width = 1080;
    canvas.height = 1080;

    const renderFrame = (index) => {
      const img = images[index];
      if (!img) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate fit
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      let drawWidth, drawHeight, drawX, drawY;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      }

      // Enable smooth rendering
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      
      context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };

    // Draw initial frame (product fully upright, around frame 115)
    renderFrame(115);

    // GSAP ScrollTrigger Sequence
    const airpods = { frame: 0 };
    
    // Animating frames on scroll
    const scrollAnimation = gsap.to(airpods, {
      frame: TOTAL_FRAMES - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2, // Smooth follow-up
      },
      onUpdate: () => {
        renderFrame(Math.floor(airpods.frame));
      }
    });

    // Zoom and Position adjustments for a cinematic feel on scroll
    gsap.fromTo(canvas, 
      { scale: 0.85, opacity: 0.9 },
      {
        scale: 1.15,
        opacity: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      }
    );

    // Hero Text fade out / slide out on scroll
    gsap.to(textRef.current, {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: '40% top',
        end: '70% top',
        scrub: true,
      }
    });

    return () => {
      scrollAnimation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoaded, images]);

  const handleExploreScroll = () => {
    // Smooth scroll past the hero sequence section
    const scrollHeight = containerRef.current.offsetHeight;
    window.scrollTo({
      top: scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Luxury Preloader */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-50 bg-[#FAF4ED] flex flex-col items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
          >
            <div className="relative flex flex-col items-center max-w-xs text-center px-6">
              {/* Soft Pulsing Ring */}
              <motion.div 
                className="w-24 h-24 rounded-full border border-rosegold-200 absolute -top-4 flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
              
              <h2 className="font-playfair text-3xl tracking-widest text-[#5C4548] mb-1 mt-6">
                NYKAA
              </h2>
              <span className="text-[10px] tracking-[0.25em] text-rosegold-400 font-semibold uppercase mb-6">
                Naturals Skincare
              </span>
              
              {/* Custom luxury progress bar */}
              <div className="w-48 h-[2px] bg-blush-100 rounded-full overflow-hidden mb-3 relative">
                <motion.div 
                  className="h-full bg-rose-gold-gradient rounded-full"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              
              <p className="font-montserrat text-xs tracking-wider text-[#9C764A] italic">
                Revealing the glow... {loadProgress}%
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Scroll Sequence Container */}
      <div 
        ref={containerRef} 
        className="relative w-full h-[250vh] bg-gradient-to-b from-[#F5E6E8] via-[#FFFFFF] to-[#FAF4ED] overflow-hidden"
      >
        {/* Sticky viewport for Canvas & Hero texts */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* Glowing Aura behind canvas */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-[#EAD1D5] opacity-40 filter blur-[90px] glow-glow-gold pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-[#ECCFA8] opacity-35 filter blur-[70px] pointer-events-none" />

          {/* Canvas for image rendering */}
          <div className="relative w-full max-w-[85vh] aspect-square z-20 flex items-center justify-center">
            {isLoaded && (
              <canvas 
                ref={canvasRef} 
                className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(61,45,47,0.08)] pointer-events-none"
              />
            )}
          </div>

          {/* Hero Content Overlay */}
          <div 
            ref={textRef} 
            className="absolute inset-0 z-30 flex flex-col justify-between items-center py-20 px-6 pointer-events-none"
          >
            {/* Top Brand Tag */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex items-center gap-2"
            >
              <span className="text-[10px] md:text-xs tracking-[0.4em] font-semibold text-[#5C4548] uppercase">
                Nykaa Naturals Rosé & Niacinamide
              </span>
            </motion.div>

            {/* Middle Main Headings */}
            <div className="text-center flex flex-col items-center">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
                className="font-playfair text-5xl md:text-7xl lg:text-8xl font-normal text-[#3D2D2F] tracking-wide mb-4"
              >
                Glow Beyond <span className="italic text-rose-gold-gradient block sm:inline">Beauty</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 1 }}
                className="font-montserrat text-sm md:text-lg tracking-[0.3em] uppercase text-rosegold-500 font-medium"
              >
                Hydration. Radiance. Confidence.
              </motion.p>
            </div>

            {/* Bottom CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1.2 }}
              className="pointer-events-auto"
            >
              <button 
                onClick={handleExploreScroll}
                className="luxury-btn flex items-center gap-3 px-8 py-4 bg-rose-gold-gradient hover:bg-rose-gold-hover text-[#FFFFFF] rounded-full text-xs font-semibold tracking-[0.2em] uppercase shadow-lg shadow-rosegold-300/30 group"
              >
                Explore The Glow
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Luxury side visual elements */}
          <div className="absolute left-10 bottom-24 hidden lg:flex flex-col gap-6 text-[#9C764A] text-[9px] tracking-[0.25em] uppercase font-semibold">
            <span className="opacity-40">01 / Introdution</span>
            <div className="w-[1px] h-16 bg-[#C49A6C]/30 self-center" />
          </div>

          <div className="absolute right-10 bottom-24 hidden lg:flex items-center gap-2 text-[#9C764A] text-[9px] tracking-[0.25em] uppercase font-semibold rotate-90 origin-right">
            <Sparkles size={10} className="text-[#C49A6C]" />
            <span>Scroll to Rotate</span>
          </div>

        </div>
      </div>
    </>
  );
}
