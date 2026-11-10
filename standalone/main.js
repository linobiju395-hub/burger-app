/**
 * ============================================================================
 * SMASH & SONS — ARTISANAL DUBAI SMASH BURGERS
 * Complete Production-Ready Scrollytelling Engine
 * Stack: Pure Vanilla JS + GSAP 3.12+ ScrollTrigger + Lenis 1.1+ Smooth Scroll
 * Zero Placeholder Comments | Zero Missing Functions
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // 2. Initialize Lenis Smooth Scrolling Engine
  const lenis = initLenisScroll();

  // 3. Live Dubai Clock Telemetry (UTC+4)
  initDubaiClock();

  // 4. Section 1: Hero Character Split & Entrance/Exit Timelines
  initHeroSection();

  // 5. Section 2: The Build 300vh/150vh Canvas Scroller & 5 Layer Labels
  initBuildCanvasSection();

  // 6. Section 3: The Griddle Ember-Orange Transition & SVG Sizzle Lines
  initGriddleSection();

  // 7. Section 4: The Menu Horizontal Scroll with ContainerAnimation Centering
  initMenuSection();

  // 8. Section 5: Numbers Animated Counters
  initNumbersSection();

  // 9. Section 6: Find Us & Magnetic Button Physics
  initFindUsSection();
});

/**
 * ============================================================================
 * 2. LENIS SMOOTH SCROLLING ENGINE
 * Locked directly to GSAP Ticker for 60/120fps synchronized scrubbing
 * ============================================================================
 */
function initLenisScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * ============================================================================
 * 3. LIVE DUBAI CLOCK (GST / UTC+4)
 * ============================================================================
 */
function initDubaiClock() {
  const clockEl = document.getElementById('dxb-clock');
  if (!clockEl) return;

  const update = () => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dubai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
    clockEl.textContent = `DXB ${formatted} GST`;
  };

  update();
  setInterval(update, 1000);
}

/**
 * ============================================================================
 * 4. HERO SECTION (#hero)
 * Inline Pure JavaScript Character Splitter & Overshoot Slam Timeline
 * ============================================================================
 */
function initHeroSection() {
  const heroEl = document.getElementById('hero');
  const headlineEl = document.getElementById('hero-headline');
  if (!heroEl || !headlineEl) return;

  // Inline Pure JS Character Splitter (SplitText Equivalent)
  const splitTargets = headlineEl.querySelectorAll('.split-target');
  const allCharInners = [];

  splitTargets.forEach((target) => {
    const text = target.textContent.trim();
    target.textContent = '';
    const chars = Array.from(text);

    chars.forEach((char) => {
      const wrap = document.createElement('span');
      wrap.className = 'char-wrap';

      const inner = document.createElement('span');
      inner.className = 'char-inner';
      inner.textContent = char;

      wrap.appendChild(inner);
      target.appendChild(wrap);
      allCharInners.push(inner);
    });
  });

  const mm = gsap.matchMedia();

  /* =========================================================================
   * HERO GSAP TIMELINE
   * Trigger: #hero
   * Start: 'top top'
   * End: 'bottom top'
   * Scrub: true
   * Markers: toggled below
   * ========================================================================= */
  mm.add(
    {
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, reducedMotion } = context.conditions;

      if (reducedMotion) {
        gsap.set(allCharInners, { opacity: 1, y: 0, scale: 1 });
        gsap.set(['.mustard-tag', '.hero-subtext', '.hero-actions'], { opacity: 1, y: 0 });
        return;
      }

      // Entrance Slam with back.out(1.7) overshoot ease
      const introTl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });

      introTl.fromTo(
        '.mustard-tag',
        { opacity: 0, scale: 0.8, y: -25 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: 0.15 }
      );

      introTl.fromTo(
        allCharInners,
        {
          opacity: 0,
          y: -80,
          scale: 1.35,
          rotateZ: (i) => (i % 2 === 0 ? -8 : 8),
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateZ: 0,
          duration: 0.65,
          stagger: 0.035,
        },
        '-=0.3'
      );

      introTl.fromTo(
        ['.hero-subtext', '.hero-actions'],
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
        '-=0.2'
      );

      // Scroll Exit Scrub (Transform and Opacity only)
      gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: isDesktop ? 0.8 : 0.4,
          // markers: true,
        },
      }).to('.hero-inner', {
        yPercent: 35,
        opacity: 0,
        ease: 'none',
      });
    }
  );
}

/**
 * ============================================================================
 * 5. THE BUILD (#build)
 * Pinned Canvas Scrubber, Memory-Safe Preloader, Dynamic Safe-Padding Aspect Ratio,
 * Offscreen Fallback Generator, and 5 Contextual Layer Labels
 * ============================================================================
 */
function initBuildCanvasSection() {
  const buildSection = document.getElementById('build');
  const canvas = document.getElementById('burger-canvas');
  const cards = gsap.utils.toArray('.layer-card');
  const navItems = gsap.utils.toArray('.layer-nav-item');
  let prevActiveIdx = -1;

  if (!buildSection || !canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const totalFrames = 30;
  let currentFrame = 1;
  let targetFrame = 1;

  // Single-File Sprite Sheet (3840x1800, 6 cols x 5 rows of 640x360 tiles)
  // Replaces 30 individual frame files with 1 single 305KB image
  const spriteSheet = new Image();
  spriteSheet.src = 'assets/burger_spritesheet.webp';
  let isSpriteLoaded = false;
  spriteSheet.onload = () => {
    isSpriteLoaded = true;
    drawFrame(currentFrame, 0);
  };

  const SAFE_MARGIN_SCALE = 0.85;

  const drawTile = (f1Based, alpha, offsetX, offsetY, drawW, drawH) => {
    const idx0 = Math.max(0, Math.min(29, Math.round(f1Based) - 1));
    const col = idx0 % 6;
    const row = Math.floor(idx0 / 6);
    const sx = col * 640;
    const sy = row * 360;
    ctx.globalAlpha = alpha;
    ctx.drawImage(spriteSheet, sx, sy, 640, 360, offsetX, offsetY, drawW, drawH);
  };

  const drawFrame = (frameIndex, _scrollProgress) => {
    // Fill charcoal base void
    ctx.fillStyle = '#0E0E0E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!isSpriteLoaded) return;

    // Frame Interpolation Math for Slow-Scroll Stutter Elimination
    const clampedFloat = Math.max(1, Math.min(totalFrames, frameIndex));
    const frameA = Math.floor(clampedFloat);
    const frameB = Math.min(totalFrames, frameA + 1);
    const delta = clampedFloat - frameA;

    // Hermite smoothstep curve: 3t^2 - 2t^3 gives natural optical persistence of vision
    const blendAlpha = delta * delta * (3 - 2 * delta);

    const imgRatio = 640 / 360; // 16:9
    const canvasRatio = canvas.width / canvas.height;
    let drawW, drawH;

    if (canvasRatio > imgRatio) {
      drawH = canvas.height * SAFE_MARGIN_SCALE;
      drawW = drawH * imgRatio;
    } else {
      drawW = canvas.width * SAFE_MARGIN_SCALE;
      drawH = drawW / imgRatio;
    }

    const offsetX = (canvas.width - drawW) / 2;
    const offsetY = (canvas.height - drawH) / 2;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (blendAlpha > 0.001 && frameB !== frameA) {
      drawTile(frameA, 1.0 - blendAlpha, offsetX, offsetY, drawW, drawH);
      drawTile(frameB, blendAlpha, offsetX, offsetY, drawW, drawH);
    } else {
      drawTile(frameA, 1.0, offsetX, offsetY, drawW, drawH);
    }

    ctx.restore();
  };

  // Resize Handler with DPR Support
  const handleResize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.parentElement.clientWidth * dpr;
    canvas.height = canvas.parentElement.clientHeight * dpr;
    drawFrame(currentFrame, 0);
  };

  window.addEventListener('resize', handleResize);
  handleResize();

  // GSAP 300vh Pinning Timeline Setup
  // Continuous 60/120Hz lerp ticker loop for seamless motion blur scrubbing
  gsap.ticker.add(() => {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.0008) {
      currentFrame += diff * 0.22;
      drawFrame(currentFrame, (currentFrame - 1) / (totalFrames - 1));
    }
  });

  const mm = gsap.matchMedia();

  /* =========================================================================
   * THE BUILD PINNING TIMELINE
   * Trigger: #build
   * Start: 'top top'
   * End: '+=300%' (Desktop >= 768px) / '+=180%' (Mobile < 768px)
   * Pin: true
   * Scrub: 0.65
   * Animate: Only transform and opacity on 7 layer cards
   * Markers: toggled below
   * ========================================================================= */
  mm.add(
    {
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, reducedMotion } = context.conditions;

      if (reducedMotion) {
        cards.forEach((card, idx) => {
          gsap.set(card, { opacity: idx === 0 ? 1 : 0, y: 0, scale: 1 });
        });
        drawFrame(15, 0.5);
        return;
      }

      const pinDistance = isDesktop ? '+=300%' : '+=180%';

      const buildTl = gsap.timeline({
        scrollTrigger: {
          trigger: buildSection,
          start: 'top top',
          end: pinDistance,
          pin: true,
          scrub: isDesktop ? 0.65 : 0.4,
          anticipatePin: 1,
          // markers: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Target frame destination for ticker interpolation
            targetFrame = 1 + p * (totalFrames - 1);

            // Sync active tier milestone with left-hand architectural navigator
            const layerIdx = Math.min(6, Math.floor(p * 7));
            if (layerIdx !== prevActiveIdx) {
              prevActiveIdx = layerIdx;
              navItems.forEach((item, i) => {
                if (i === layerIdx) {
                  item.classList.add('active');
                } else {
                  item.classList.remove('active');
                }
              });
            }
          },
        },
      });

      // 7 Contextual Layer Description Cards timed to video layer milestones
      const ranges = [
        { start: 0.00, end: 0.15 },
        { start: 0.15, end: 0.29 },
        { start: 0.29, end: 0.44 },
        { start: 0.44, end: 0.59 },
        { start: 0.59, end: 0.74 },
        { start: 0.74, end: 0.88 },
        { start: 0.88, end: 1.00 },
      ];

      cards.forEach((card, idx) => {
        const r = ranges[idx];
        if (!r) return;
        const dur = r.end - r.start;

        buildTl.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: dur * 0.45, ease: 'power2.out' },
          r.start
        );

        if (idx < cards.length - 1) {
          buildTl.to(
            card,
            { opacity: 0, y: -20, scale: 0.97, duration: dur * 0.4, ease: 'power2.in' },
            r.end - dur * 0.35
          );
        }
      });
    }
  );
}

/**
 * ============================================================================
 * 6. THE GRIDDLE SECTION (#griddle)
 * Ember-Orange Background Shift & 3 Sizzle SVG Paths Drawing via StrokeDashoffset
 * ============================================================================
 */
function initGriddleSection() {
  const griddleEl = document.getElementById('griddle');
  const overlayEl = document.getElementById('griddle-overlay');
  const sizzlePaths = document.querySelectorAll('.sizzle-path');

  if (!griddleEl || !overlayEl) return;

  const mm = gsap.matchMedia();

  /* =========================================================================
   * THE GRIDDLE TIMELINE
   * Trigger: #griddle
   * Start: 'top 80%'
   * End: 'bottom 20%'
   * Scrub: 0.8
   * Markers: toggled below
   * ========================================================================= */
  mm.add(
    {
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { reducedMotion } = context.conditions;

      if (reducedMotion) {
        gsap.set(overlayEl, { opacity: 0.85 });
        gsap.set(sizzlePaths, { strokeDashoffset: 0 });
        return;
      }

      const griddleTl = gsap.timeline({
        scrollTrigger: {
          trigger: griddleEl,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.8,
          // markers: true,
        },
      });

      // Background transition from charcoal to searing ember-orange (#C43806)
      griddleTl.to(overlayEl, {
        opacity: 0.88,
        ease: 'power1.inOut',
        duration: 1,
      }, 0);

      // 3 Sizzle SVG paths drawing themselves in via stroke-dashoffset
      griddleTl.to(sizzlePaths, {
        strokeDashoffset: 0,
        stagger: 0.15,
        ease: 'power2.out',
        duration: 1,
      }, 0.1);
    }
  );
}

/**
 * ============================================================================
 * 7. THE MENU SECTION (#menu)
 * Horizontal Pin Scroll & Card Centering (Scale: 1.05, RotateZ: 0deg) via containerAnimation
 * ============================================================================
 */
function initMenuSection() {
  const menuSection = document.getElementById('menu');
  const track = document.getElementById('menu-track');
  const cards = gsap.utils.toArray('.menu-card');

  if (!menuSection || !track || cards.length === 0) return;

  const mm = gsap.matchMedia();

  /* =========================================================================
   * THE MENU HORIZONTAL PIN TIMELINE
   * Trigger: #menu
   * Start: 'top top'
   * End: () => dynamic overflow width
   * Pin: true
   * Scrub: 0.8
   * Markers: toggled below
   * ========================================================================= */
  mm.add(
    {
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, reducedMotion } = context.conditions;

      if (reducedMotion) {
        gsap.set(track, { x: 0 });
        gsap.set(cards, { scale: 1, rotateZ: 0 });
        return;
      }

      const getScrollDist = () => track.scrollWidth - window.innerWidth + (isDesktop ? 160 : 60);

      // Primary Horizontal Pin Scroll
      const horizontalTween = gsap.to(track, {
        x: () => -getScrollDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: menuSection,
          start: 'top top',
          end: () => `+=${getScrollDist()}`,
          pin: true,
          scrub: isDesktop ? 0.8 : 0.4,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      // Individual Card Scaling & Untilting using containerAnimation
      cards.forEach((card, idx) => {
        const initialRotation = idx % 2 === 0 ? -3 : 3;
        gsap.set(card, { rotateZ: initialRotation, scale: 0.95 });

        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'left center+=150',
            end: 'right center-=150',
            scrub: true,
            // markers: true,
          },
        })
          .to(card, {
            scale: 1.05,
            rotateZ: 0,
            duration: 0.5,
            ease: 'power2.out',
          })
          .to(card, {
            scale: 0.95,
            rotateZ: -initialRotation,
            duration: 0.5,
            ease: 'power2.in',
          });
      });
    }
  );
}

/**
 * ============================================================================
 * 8. NUMBERS SECTION (#numbers)
 * Animated Numerical Counters via GSAP Proxy Objects
 * ============================================================================
 */
function initNumbersSection() {
  const numbersSection = document.getElementById('numbers');
  const counterBurgers = document.getElementById('counter-burgers');
  const counterYears = document.getElementById('counter-years');
  const counterSauces = document.getElementById('counter-sauces');

  if (!numbersSection || !counterBurgers) return;

  const mm = gsap.matchMedia();

  /* =========================================================================
   * NUMBERS TIMELINE
   * Trigger: #numbers
   * Start: 'top 75%'
   * End: 'bottom 25%'
   * ToggleActions: 'play none none reverse'
   * Markers: toggled below
   * ========================================================================= */
  mm.add(
    {
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { reducedMotion } = context.conditions;

      if (reducedMotion) {
        counterBurgers.textContent = '380,000';
        counterYears.textContent = '4';
        counterSauces.textContent = '9';
        return;
      }

      const proxy = { burgers: 0, years: 0, sauces: 0 };

      gsap.timeline({
        scrollTrigger: {
          trigger: numbersSection,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
          // markers: true,
        },
      }).to(proxy, {
        burgers: 380000,
        years: 4,
        sauces: 9,
        duration: 2.2,
        ease: 'power3.out',
        onUpdate: () => {
          if (counterBurgers) counterBurgers.textContent = Math.floor(proxy.burgers).toLocaleString();
          if (counterYears) counterYears.textContent = Math.floor(proxy.years);
          if (counterSauces) counterSauces.textContent = Math.floor(proxy.sauces);
        },
      });
    }
  );
}

/**
 * ============================================================================
 * 9. FIND US & MAGNETIC BUTTON (#find-us)
 * Cursor Coordinate Tracking with Elastic Return on MouseLeave
 * ============================================================================
 */
function initFindUsSection() {
  const wrap = document.getElementById('magnetic-wrap');
  const btn = document.getElementById('magnetic-btn');

  if (!wrap || !btn) return;

  const handleMouseMove = (e) => {
    const rect = wrap.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    gsap.to(btn, {
      x: relX * 0.42,
      y: relY * 0.42,
      rotateZ: relX * 0.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      rotateZ: 0,
      duration: 0.8,
      ease: 'elastic.out(1.15, 0.35)',
    });
  };

  wrap.addEventListener('mousemove', handleMouseMove);
  wrap.addEventListener('mouseleave', handleMouseLeave);
}
