import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BurgerFrameManager } from '../utils/burgerRenderer';

gsap.registerPlugin(ScrollTrigger);

interface LayerData {
  kicker: string;
  headline: string;
  description: string;
  tagColor?: string;
}

const LAYERS: LayerData[] = [
  {
    kicker: '01 // THE TOASTED SESAME CROWN',
    headline: 'GOLDEN BRIOCHE CROWN',
    description: 'Golden-domed potato brioche blanketed with toasted white sesame. Toasted on clarified butter for pillowy springiness and structural bite.',
  },
  {
    kicker: '02 // 4°C HYDRO-COOLED SNAP',
    headline: 'CRISP INNER ROMAINE',
    description: 'Hand-selected inner leaves descending with suspended micro-dew droplets. Delivers a refreshing sonic crunch against the scorching beef fat.',
    tagColor: '#10B981',
  },
  {
    kicker: '03 // BRIGHT UMAMI ACIDITY',
    headline: 'VINE-RIPENED HEIRLOOMS',
    description: 'Two thick ruby-red discs sliced 5mm thick. High-sugar natural fruit acids that slice cleanly through rich molten cheese and dense Wagyu marbling.',
    tagColor: '#D7261E',
  },
  {
    kicker: '04 // LIQUID GOLD BLANKET',
    headline: 'MOLTEN CHEDDAR DRAPE',
    description: 'Sharp aged cheddar draped like a molten curtain over the sear craters, with billowing plumes of thermal steam escaping upward.',
    tagColor: '#F2B705',
  },
  {
    kicker: '05 // THE MAILLARD CORE',
    headline: '200°C SEARED WAGYU PATTY',
    description: '100% Australian Wagyu (80/20 brisket & chuck blend). Smashed with 10 tons of levered steel to achieve brittle, glass-like lacy edges.',
    tagColor: '#D7261E',
  },
  {
    kicker: '06 // 45-MIN ALLIUM CONFIT',
    headline: 'CARAMELIZED ONION BED',
    description: 'Sweet Vidalia onion ribbons slowly braised in Wagyu beef tallow until sticky and smoky, cushioning the patty above the toasted heel.',
    tagColor: '#F2B705',
  },
  {
    kicker: '07 // THE GRAVITY COMPRESSION',
    headline: 'SMASHED. NOT SORRY.',
    description: 'All 7 layers compressed into visceral perfection with curling steam plumes. Freshly smashed at Warehouse 17, Al Quoz, Dubai.',
    tagColor: '#F2B705',
  },
];

export const TheBuildSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameManagerRef = useRef<BurgerFrameManager | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prevLayerRef = useRef(-1);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    const manager = new BurgerFrameManager((status) => {
      if (status.loadedFrames >= 1 && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          manager.draw(ctx, canvasRef.current, 1, 0);
        }
      }
    });
    frameManagerRef.current = manager;
    manager.init();

    return () => {
      manager.destroy();
    };
  }, []);

  // Set up canvas resize with crisp 1:1 Retina physical pixel backing store
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (frameManagerRef.current) {
        frameManagerRef.current.draw(ctx, canvas, 1, 0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP MatchMedia, Pinning Timeline, and Continuous Ticker Lerp Interpolation
  useEffect(() => {
    const containerEl = containerRef.current;
    const canvasEl = canvasRef.current;
    if (!containerEl || !canvasEl) return;

    const ctx2d = canvasEl.getContext('2d');
    if (!ctx2d) return;

    let targetFrame = 1;
    let currentFrame = 1;
    let isTicking = true;

    // Smooth continuous lerp loop on GSAP ticker (synced to monitor refresh rate)
    const tickHandler = () => {
      if (!isTicking) return;
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.0008) {
        currentFrame += diff * 0.22;
        frameManagerRef.current?.draw(ctx2d, canvasEl, currentFrame, (currentFrame - 1) / 29);
      }
    };

    gsap.ticker.add(tickHandler);

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
        reducedMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reducedMotion } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reducedMotion: boolean;
        };

        if (reducedMotion) {
          cardsRef.current.forEach((card, idx) => {
            if (card) gsap.set(card, { opacity: idx === 0 ? 1 : 0, y: 0 });
          });
          if (frameManagerRef.current && ctx2d) {
            frameManagerRef.current.draw(ctx2d, canvasEl, 15, 0.5);
          }
          return;
        }

        const pinDistance = isDesktop ? '+=300%' : '+=180%';

        const buildTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerEl,
            start: 'top top',
            end: pinDistance,
            pin: true,
            scrub: isDesktop ? 0.65 : 0.4,
            anticipatePin: 1,
            // markers: true,
            onUpdate: (self) => {
              const p = self.progress;
              targetFrame = 1 + p * 29;

              // Only update state when step milestone boundary shifts
              const layerIdx = Math.min(LAYERS.length - 1, Math.floor(p * LAYERS.length));
              if (layerIdx !== prevLayerRef.current) {
                prevLayerRef.current = layerIdx;
                setActiveLayer(layerIdx);
              }
            },
          },
        });

        // Map the 7 description cards on the right side to scroll milestones
        const ranges = [
          { start: 0.00, end: 0.15 },
          { start: 0.15, end: 0.29 },
          { start: 0.29, end: 0.44 },
          { start: 0.44, end: 0.59 },
          { start: 0.59, end: 0.74 },
          { start: 0.74, end: 0.88 },
          { start: 0.88, end: 1.00 },
        ];

        cardsRef.current.forEach((card, idx) => {
          if (!card) return;
          const r = ranges[idx];
          const dur = (r.end - r.start);

          buildTl.fromTo(
            card,
            { opacity: 0, y: 30, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: dur * 0.45, ease: 'power2.out' },
            r.start
          );

          if (idx < cardsRef.current.length - 1) {
            buildTl.to(
              card,
              { opacity: 0, y: -20, scale: 0.97, duration: dur * 0.4, ease: 'power2.in' },
              r.end - (dur * 0.35)
            );
          }
        });
      }
    );

    return () => {
      isTicking = false;
      gsap.ticker.remove(tickHandler);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="build"
      className="relative w-full h-screen overflow-hidden bg-[#0E0E0E] text-[#FFF6E5] flex items-center justify-center select-none"
    >
      {/* Background Bold Condensed Title (Outline/Filled Treatments) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden px-4">
        <h2 className="font-['Anton'] text-[8.5vw] sm:text-[9.5vw] xl:text-[10.5vw] uppercase tracking-tight leading-none whitespace-nowrap select-none flex items-center gap-3 sm:gap-5">
          <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(255,246,229,0.08)]">THE ANATOMY</span>
          <span className="text-[#FFF6E5]/[0.04]">OF THE</span>
          <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(242,183,5,0.14)]">SMASH &amp; SONS</span>
        </h2>
      </div>

      {/* Ambient Radial Spotlight */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-[radial-gradient(circle,_rgba(242,183,5,0.06)_0%,_transparent_70%)]" />
      </div>

      {/* Main Canvas Viewport (Dynamic Contain with 0.84 Safe Margin) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Left-Hand Architectural Tier Index (Desktop / Fullscreen) */}
        <div className="hidden lg:flex flex-col justify-center absolute z-20 left-6 sm:left-8 lg:left-10 xl:left-14 top-1/2 -translate-y-1/2 w-[260px] xl:w-[290px] pointer-events-none">
          <div>
            <h2 className="font-['Anton'] text-4xl xl:text-5xl uppercase tracking-tight text-[#FFF6E5] leading-[0.92] mb-6">
              THE SEVEN<br />
              <span className="text-[#F2B705]">TIERS OF FAT</span>
            </h2>

            {/* Vertical Tier Step Navigator */}
            <div className="space-y-2 border-l border-[#FFF6E5]/15 pl-4 py-1">
              {LAYERS.map((layer, idx) => {
                const isActive = activeLayer === idx;
                const shortTitles = [
                  'BRIOCHE CROWN',
                  'HYDRO ROMAINE',
                  'VINE HEIRLOOMS',
                  'MOLTEN CHEDDAR',
                  'SEARED WAGYU',
                  'ALLIUM CONFIT',
                  'THE GRAVITY STACK',
                ];

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      isActive
                        ? 'translate-x-2 text-[#FFF6E5] font-bold'
                        : 'text-[#FFF6E5]/35 hover:text-[#FFF6E5]/60'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs tracking-wider transition-colors duration-300 ${
                        isActive ? 'text-[#F2B705]' : 'text-[#FFF6E5]/30'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-xs xl:text-sm tracking-wider uppercase transition-all duration-300 ${
                        isActive ? 'tracking-widest text-[#FFF6E5]' : ''
                      }`}
                    >
                      {shortTitles[idx]}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F2B705] shadow-[0_0_8px_#F2B705]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <canvas
          ref={canvasRef}
          className="relative w-full h-full pointer-events-none"
        />

        {/* Right-Hand Frosted Glass Description Cards Container */}
        <div className="absolute z-20 right-6 sm:right-12 lg:right-16 xl:right-24 top-1/2 -translate-y-1/2 w-full max-w-[340px] sm:max-w-[380px] xl:max-w-[420px] pointer-events-none">
          {LAYERS.map((layer, idx) => (
            <div
              key={idx}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-full bg-[#0E0E0E]/80 backdrop-blur-xl border border-[#F2B705]/25 p-6 sm:p-7 xl:p-8 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.85)] opacity-0 will-change-transform"
            >
              <h3 className="font-['Anton'] text-3xl sm:text-4xl text-[#FFF6E5] uppercase tracking-wide leading-none mb-3">
                {layer.headline}
              </h3>
              <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#FFF6E5]/80 leading-relaxed font-normal">
                {layer.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
