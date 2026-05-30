import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 230;
// Vite's BASE_URL = '/demo-ad/' on GitHub Pages, '/' in local dev
const BASE = import.meta.env.BASE_URL;

function preloadFrames(onProgress) {
  const images = new Array(TOTAL_FRAMES);
  let loaded = 0;
  return new Promise((resolve) => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i + 1).padStart(3, '0');
      img.src = `${BASE}hero/ezgif-frame-${num}.jpg`;
      img.onload = img.onerror = () => {
        images[i] = img;
        loaded++;
        onProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) resolve(images);
      };
    }
  });
}

export default function App() {
  const [loadPct, setLoadPct] = useState(0);
  const imagesRef = useRef([]);
  const canvasRef = useRef(null);
  const preloaderRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const lifestyleImgRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroContentRef = useRef(null);

  // ── Custom cursor ──────────────────────────────────────────────────────────
  useEffect(() => {
    let mx = -200, my = -200, rx = -200, ry = -200, raf;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onOver  = (e) => {
      const hit = e.target.closest('a,button,.ing-card,.details-img-card,.lifestyle-glass');
      cursorRingRef.current?.classList.toggle('hovered', !!hit);
    };
    const tick = () => {
      if (cursorDotRef.current)
        cursorDotRef.current.style.transform = `translate(${mx-4}px,${my-4}px)`;
      if (cursorRingRef.current) {
        const h = cursorRingRef.current.classList.contains('hovered');
        const offset = h ? 30 : 18;
        rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
        cursorRingRef.current.style.transform = `translate(${rx-offset}px,${ry-offset}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Preload + all GSAP animations ─────────────────────────────────────────
  useEffect(() => {
    preloadFrames(setLoadPct).then((imgs) => {
      imagesRef.current = imgs;

      // hide preloader
      setTimeout(() => preloaderRef.current?.classList.add('hidden'), 500);

      // ── Canvas render — COVER fill (like object-fit:cover) ───────────────
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Match canvas internal resolution to actual display size
      const syncCanvasSize = () => {
        canvas.width  = window.innerWidth  * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
      };
      syncCanvasSize();
      window.addEventListener('resize', syncCanvasSize);

      // COVER: fill the whole canvas, cropping sides if needed (no black bars)
      const drawFrame = (raw) => {
        const img = imgs[Math.floor(raw)];
        if (!img?.complete || !img.naturalWidth) return;

        const cw = canvas.width;
        const ch = canvas.height;
        ctx.clearRect(0, 0, cw, ch);

        const ir = img.naturalWidth / img.naturalHeight;
        const cr = cw / ch;

        let sw, sh, sx, sy; // source crop
        if (ir > cr) {
          // Image is wider than canvas → crop left/right, fill height
          sh = img.naturalHeight;
          sw = img.naturalHeight * cr;
          sy = 0;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          // Image is taller than canvas → crop top/bottom, fill width
          sw = img.naturalWidth;
          sh = img.naturalWidth / cr;
          sx = 0;
          sy = (img.naturalHeight - sh) / 2;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      };

      drawFrame(0);

      // ── Hero frame scroll ─────────────────────────────────────────────────
      const state = { frame: 0 };
      gsap.to(state, {
        frame: TOTAL_FRAMES - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
        onUpdate: () => drawFrame(state.frame),
      });

      // hero text fades out early into the scroll
      gsap.to(heroContentRef.current, {
        opacity: 0, y: -70,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: '18% top',
          end:   '45% top',
          scrub: true,
        },
      });

      // ── Cloud section parallax ────────────────────────────────────────────
      // Back layer – slowest, drifts right
      gsap.fromTo('#cloud-back', { x: '-8%', scale: 1.05 }, {
        x: '8%', scale: 1.15,
        ease: 'none',
        scrollTrigger: { trigger: '#cloud-section', start: 'top bottom', end: 'bottom top', scrub: 1.8 },
      });
      // Mid layer – medium speed, drifts left
      gsap.fromTo('#cloud-mid', { x: '5%', y: '3%' }, {
        x: '-5%', y: '-3%',
        ease: 'none',
        scrollTrigger: { trigger: '#cloud-section', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      });
      // Front layer – fastest, rises up
      gsap.fromTo('#cloud-front', { y: '12%', scale: 1.08 }, {
        y: '-12%', scale: 1.0,
        ease: 'none',
        scrollTrigger: { trigger: '#cloud-section', start: 'top bottom', end: 'bottom top', scrub: 0.9 },
      });
      // Cloud text reveal
      gsap.fromTo('.cloud-text > *', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: '#cloud-section', start: 'top 60%', toggleActions: 'play none none reverse' },
      });

      // ── Lifestyle zoom ────────────────────────────────────────────────────
      if (lifestyleImgRef.current) {
        gsap.fromTo(lifestyleImgRef.current, { scale: 1 }, {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: { trigger: '#lifestyle', start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
      gsap.fromTo('.lifestyle-glass', { y: 80, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '#lifestyle', start: 'top 65%', toggleActions: 'play none none reverse' },
      });

      // ── Details section ───────────────────────────────────────────────────
      gsap.fromTo('.details-img-wrap', { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '#details', start: 'top 72%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo('.details-right > *', { x: 40, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '#details', start: 'top 72%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo('.ing-card', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '.ing-grid', start: 'top 78%', toggleActions: 'play none none reverse' },
      });

      // ── Final section ─────────────────────────────────────────────────────
      gsap.fromTo('.final-content > *', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: '#final', start: 'top 70%', toggleActions: 'play none none reverse' },
      });
    });
  }, []);

  const scrollDown = () =>
    document.getElementById('cloud-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {/* ── Cursors ── */}
      <div className="cursor-dot"  ref={cursorDotRef} />
      <div className="cursor-ring" ref={cursorRingRef} />

      {/* ── Preloader ── */}
      <div id="preloader" ref={preloaderRef}>
        <div className="preloader-ring" />
        <div className="preloader-brand">NYKAA</div>
        <div className="preloader-sub">Naturals Beauty</div>
        <div className="preloader-bar-track">
          <div className="preloader-bar-fill" style={{ width: `${loadPct}%` }} />
        </div>
        <div className="preloader-pct">Revealing the glow… {loadPct}%</div>
      </div>

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">
          NYKAA
          <span>Naturals Luxury</span>
        </div>
        <div className="navbar-right">
          <a href="#cloud-section" className="navbar-link">About</a>
          <a href="#lifestyle"     className="navbar-link">Campaign</a>
          <a href="#details"       className="navbar-link">Ingredients</a>
          <a href="https://www.nykaa.com" target="_blank" rel="noopener noreferrer" className="navbar-cta">
            Shop Now →
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          SECTION 1 — HERO FULL-SCREEN SCROLL SEQUENCE
      ══════════════════════════════════════════════════ */}
      <section id="hero" ref={heroSectionRef}>
        <div className="hero-sticky">
          <div className="hero-bg" />

          {/* Sparkles */}
          <div className="sparkle-wrap">
            {[
              { top:'16%', left:'7%',  size:13, dur:'7s',  delay:'0s'   },
              { top:'28%', left:'87%', size:10, dur:'9s',  delay:'1.2s' },
              { top:'72%', left:'11%', size:8,  dur:'6.5s',delay:'2s'   },
              { top:'58%', left:'83%', size:14, dur:'8s',  delay:'0.5s' },
              { top:'44%', left:'4%',  size:9,  dur:'10s', delay:'1.8s' },
              { top:'19%', left:'74%', size:11, dur:'7.5s',delay:'3.1s' },
              { top:'80%', left:'55%', size:7,  dur:'8.5s',delay:'0.8s' },
            ].map((sp, i) => (
              <div key={i} className="s" style={{ top:sp.top, left:sp.left, '--d':sp.dur, '--delay':sp.delay }}>
                <svg width={sp.size} height={sp.size} viewBox="0 0 24 24">
                  <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill="#C49A6C" opacity="0.65"/>
                </svg>
              </div>
            ))}
          </div>

          {/* Canvas — full-screen, cover-fills the viewport */}
          <div className="hero-canvas-wrap">
            <canvas ref={canvasRef} id="heroCanvas" />
          </div>

          {/* Dark vignette so text is readable over bright frames */}
          <div className="hero-vignette" />

          {/* Hero text overlay */}
          <div className="hero-content" ref={heroContentRef}>
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              Nykaa Naturals Rosé &amp; Niacinamide
            </div>

            <div className="hero-center">
              <h1 className="hero-h1">
                Glow Beyond<br />
                <span className="gold-italic">Beauty</span>
              </h1>
              <p className="hero-sub">Hydration &nbsp;·&nbsp; Radiance &nbsp;·&nbsp; Confidence</p>
            </div>

            <div className="hero-bottom">
              <button className="btn-gold" onClick={scrollDown}>
                Explore The Glow
                <span className="btn-icon">→</span>
              </button>
              <div className="scroll-hint">
                <div className="scroll-line" />
                Scroll to Experience
              </div>
            </div>
          </div>

          {/* Side labels */}
          <div className="hero-side-l">
            <span className="side-text" style={{ writingMode:'vertical-lr', letterSpacing:'0.35em' }}>01 · Intro</span>
            <div style={{ width:'1px', height:'48px', background:'rgba(196,154,108,0.3)' }} />
          </div>
          <div className="hero-side-r">
            <div style={{ width:'1px', height:'48px', background:'rgba(196,154,108,0.3)' }} />
            <span className="side-text">Scroll to Rotate</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — CINEMATIC CLOUD TRANSITION
          Uses mix-blend-mode:screen → black becomes invisible
      ══════════════════════════════════════════════════ */}
      <section id="cloud-section">
        {/* Pink/nude background that shows through the clouds */}
        <div className="cloud-bg-fill" />

        {/* Back layer – large, slow, low opacity */}
        <img
          id="cloud-back"
          className="cloud-layer-img"
          src={`${BASE}claud.png`}
          alt=""
          aria-hidden="true"
          style={{ opacity: 0.55, transform: 'scale(1.3) translateY(15%)' }}
        />

        {/* Mid layer – medium speed, tinted pink */}
        <img
          id="cloud-mid"
          className="cloud-layer-img cloud-tint-rose"
          src={`${BASE}claud.png`}
          alt=""
          aria-hidden="true"
          style={{ opacity: 0.7, transform: 'scale(1.15) translateY(5%) scaleX(-1)' }}
        />

        {/* Front layer – full opacity, sharp, rises on scroll */}
        <img
          id="cloud-front"
          className="cloud-layer-img"
          src={`${BASE}claud.png`}
          alt=""
          aria-hidden="true"
          style={{ opacity: 0.9, transform: 'scale(1.05) translateY(0%)' }}
        />

        {/* Soft pink overlay to tint the clouds warm */}
        <div className="cloud-warm-overlay" />

        {/* Top fade — blends into hero section above */}
        <div className="cloud-fade-top" />
        {/* Bottom fade — blends into lifestyle section below */}
        <div className="cloud-fade-bottom" />

        {/* Content */}
        <div className="cloud-text">
          <span className="cloud-kicker">✦ Deep Hydration Journey ✦</span>
          <h2 className="cloud-h">
            A Symphony of<br />
            <em>Rosé &amp; Niacinamide</em>
          </h2>
          <p className="cloud-p">
            Like soft clouds brushing morning light, our lightweight formula drifts gently into your skin — delivering intense hydration, a healthy glow, and confidence.
          </p>
          <div className="cloud-sep" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — LIFESTYLE / HEROINE
      ══════════════════════════════════════════════════ */}
      <section id="lifestyle">
        <div className="lifestyle-sticky">
          <img ref={lifestyleImgRef} className="lifestyle-img" src={`${BASE}heroin.png`} alt="Nykaa Campaign – Luxury Skincare" />
          <div className="lifestyle-overlay" />
          <div className="lifestyle-sunlight" />

          <div className="lifestyle-particles">
            {[
              { size:6,  top:'22%', left:'20%', dur:'5s',  delay:'0s',   xd:'15px'  },
              { size:10, top:'45%', left:'75%', dur:'7s',  delay:'1s',   xd:'-20px' },
              { size:5,  top:'65%', left:'35%', dur:'6s',  delay:'2s',   xd:'10px'  },
              { size:8,  top:'30%', left:'60%', dur:'8s',  delay:'0.5s', xd:'-12px' },
            ].map((p, i) => (
              <div key={i} className="lp" style={{ width:p.size, height:p.size, top:p.top, left:p.left, '--d':p.dur, '--delay':p.delay, '--xd':p.xd }} />
            ))}
          </div>

          <div className="lifestyle-content">
            <div className="lifestyle-glass">
              <div className="lifestyle-kicker">
                <span className="kicker-line" />
                Premium Campaign 2025
              </div>
              <h2 className="lifestyle-h2">
                Skincare That<br />Feels Like <em>Luxury</em>
              </h2>
              <p className="lifestyle-p">
                Experience deep hydration and radiant skin with Nykaa Naturals Rosé &amp; Niacinamide Glow Boost Face Cream. Enriched with natural damask rose extract and science-backed niacinamide to soothe, hydrate, and reveal your skin's inner glow.
              </p>
              <div className="lifestyle-actions">
                <a href="https://www.nykaa.com" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  🛍 Shop Now
                </a>
                <div className="lifestyle-price">
                  <span className="lifestyle-price-val">₹349</span>
                  <span className="lifestyle-price-label">Glow Boost Cream</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 4 — PRODUCT DETAILS
      ══════════════════════════════════════════════════ */}
      <section id="details">
        <div className="details-bg-glow" />
        <div className="details-grid">
          <div className="details-img-wrap">
            <div className="details-img-card">
              <img src={`${BASE}details.png`} alt="Nykaa Rosé Glow Boost – Ingredients" />
              <div className="details-img-badge">
                <span className="badge-dot" />
                <span className="badge-text">100% Vegan Formula</span>
              </div>
            </div>
          </div>

          <div className="details-right">
            <div className="details-kicker">Pure Ingredients · Science-Backed</div>
            <h2 className="details-h2">
              Powered By<br /><em>Skin-Loving</em> Ingredients
            </h2>
            <div className="details-divider" />
            <div className="ing-grid">
              {[
                { emoji:'💧', name:'Hyaluronic Acid', desc:'Locks in deep moisture, plumps dry lines and delivers a bouncy, dewy complexion all day long.', bg:'rgba(209,198,223,0.25)' },
                { emoji:'✨', name:'Niacinamide',     desc:'Brightens skin, minimizes pores, balances sebum and visibly reduces dark spots and uneven tone.', bg:'rgba(236,207,168,0.25)' },
                { emoji:'🌿', name:'Aloe Vera',       desc:'Soothes irritation, reduces redness and deeply nourishes to restore a healthy skin barrier.', bg:'rgba(210,234,209,0.25)' },
                { emoji:'☀️', name:'Vitamin C',       desc:'A powerful antioxidant that brightens dull skin, boosts collagen production, and evens skin tone.', bg:'rgba(255,225,195,0.3)'  },
              ].map((ing, i) => (
                <div key={i} className="ing-card" style={{ background: ing.bg }}>
                  <div className="ing-icon" style={{ background:'rgba(255,255,255,0.7)', border:'1px solid rgba(196,154,108,0.12)' }}>{ing.emoji}</div>
                  <div className="ing-name">{ing.name}</div>
                  <div className="ing-desc">{ing.desc}</div>
                  <div className="ing-bar" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 5 — FINAL SHOWCASE
      ══════════════════════════════════════════════════ */}
      <section id="final">
        <div className="final-bg-scroll t1">REVEAL YOUR NATURAL GLOW &nbsp;·&nbsp; REVEAL YOUR NATURAL GLOW &nbsp;·&nbsp; REVEAL YOUR NATURAL GLOW</div>
        <div className="final-bg-scroll t2">NYKAA NATURALS &nbsp;·&nbsp; ROSÉ &amp; NIACINAMIDE &nbsp;·&nbsp; GLOW BOOST &nbsp;·&nbsp; NYKAA NATURALS</div>

        <div className="final-content">
          <div className="final-kicker">
            <span className="fk-line" />Nykaa Naturals Campaign<span className="fk-line" />
          </div>
          <h2 className="final-h2">Reveal Your<br /><em>Natural Glow</em></h2>
          <p className="final-desc">Experience Rosé &amp; Niacinamide Daily</p>

          <div className="final-product">
            <div className="fp-glow" />
            <div className="fp-ring r1" />
            <div className="fp-ring r2" />
            <img className="fp-img" src={`${BASE}hero/ezgif-frame-115.jpg`} alt="Nykaa Naturals Face Cream" />
          </div>

          <a href="https://www.nykaa.com" target="_blank" rel="noopener noreferrer" className="final-cta">
            Discover Nykaa Naturals
            <span className="final-cta-icon">→</span>
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand-name">NYKAA</div>
              <div className="footer-brand-tag">Naturals Luxury Beauty</div>
              <div className="footer-brand-desc">India's most-loved beauty brand. Crafting luxurious, skin-loving formulations with the finest natural and science-backed ingredients.</div>
            </div>
            <div>
              <div className="footer-col-title">Products</div>
              <div className="footer-links">
                {['Glow Boost Cream','Rosé Collection','Niacinamide Range','All Skincare'].map(l => (
                  <a key={l} href="https://www.nykaa.com" target="_blank" rel="noopener noreferrer" className="footer-link">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="footer-col-title">Campaign</div>
              <div className="footer-links">
                <a href="#cloud-section" className="footer-link">Our Story</a>
                <a href="#lifestyle"     className="footer-link">Lifestyle Campaign</a>
                <a href="#details"       className="footer-link">Ingredients</a>
                <a href="https://www.nykaa.com" target="_blank" rel="noopener noreferrer" className="footer-link">Shop Now</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2025 Nykaa Naturals. All rights reserved.</div>
            <div className="footer-copy" style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              Crafted with <span className="footer-heart">♥</span> for luxury skincare lovers.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
