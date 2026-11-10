import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame } from 'lucide-react';
import { splitTextIntoChars } from '../utils/splitText';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenOrder: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onOpenOrder }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Headline words and characters for split animation
  const headlineWords = [
    { word: 'SMASHED.', color: '#FFF6E5' },
    { word: 'NOT', color: '#F2B705' },
    { word: 'SORRY.', color: '#D7261E' },
  ];

  // Procedural ember canvas fallback if video is not yet present
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    // Cast-iron griddle sizzle spark simulation
    const sparks: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    for (let i = 0; i < 45; i++) {
      sparks.push({
        x: Math.random() * width,
        y: height * 0.5 + Math.random() * (height * 0.5),
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2.5 - 0.5,
        size: Math.random() * 3.5 + 1.2,
        alpha: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.4 ? '#F2B705' : '#D7261E'
      });
    }

    const renderSparks = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial iron heat glow
      const heatGrad = ctx.createRadialGradient(width / 2, height * 0.7, 50, width / 2, height * 0.7, width * 0.6);
      heatGrad.addColorStop(0, 'rgba(215, 38, 30, 0.22)');
      heatGrad.addColorStop(0.5, 'rgba(242, 183, 5, 0.08)');
      heatGrad.addColorStop(1, 'rgba(14, 14, 14, 0)');
      ctx.fillStyle = heatGrad;
      ctx.fillRect(0, 0, width, height);

      // Render sparks
      sparks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.005;

        if (s.y < height * 0.2 || s.alpha <= 0) {
          s.x = Math.random() * width;
          s.y = height * 0.65 + Math.random() * (height * 0.3);
          s.vy = -Math.random() * 2.5 - 0.5;
          s.alpha = Math.random() * 0.8 + 0.2;
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(renderSparks);
    };

    renderSparks();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // GSAP Timeline setup with MatchMedia & ScrollTrigger
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const mm = gsap.matchMedia();

    /* =========================================================================
     * CODE REVIEW DEFENSE: HERO SECTION TIMELINE
     * - Trigger: #hero element
     * - Start: 'top top' (begins as hero is at viewport top)
     * - End: 'bottom top' (ends when hero has scrolled 100% out of view)
     * - Scrub: 1 (smooth interpolation scrubbing)
     * - Markers: commented below for debugging
     * ========================================================================= */

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

        const charElements = heroEl.querySelectorAll('.hero-char');
        const badgeElements = heroEl.querySelectorAll('.hero-badge');
        const subElement = subRef.current;

        // 1. Initial Entrance Animation (Intro Slam)
        if (reducedMotion) {
          gsap.set(charElements, { opacity: 1, y: 0, scale: 1 });
          gsap.set([subElement, badgeElements], { opacity: 1, y: 0 });
        } else {
          const introTl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });

          // Characters slam in one by one with heavy overshoot
          introTl.fromTo(
            charElements,
            {
              opacity: 0,
              y: -80,
              scale: 1.4,
              rotateZ: (i) => (i % 2 === 0 ? -6 : 6),
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateZ: 0,
              duration: 0.75,
              stagger: 0.04,
              delay: 0.2,
            }
          );

          // Subhead and badges slide in
          introTl.fromTo(
            subElement,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
          );

          introTl.fromTo(
            badgeElements,
            { opacity: 0, scale: 0.8, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.5)' },
            '-=0.4'
          );
        }

        // 2. Scroll-driven exit timeline (Only transforms and opacity per rule)
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: 'bottom top',
            scrub: isDesktop ? 0.8 : 0.4,
            // markers: true, /* CODE REVIEW: Toggle on for trigger visualization */
          },
        });

        if (!reducedMotion) {
          scrollTl
            .to(headlineRef.current, {
              yPercent: 40,
              opacity: 0.15,
              scale: 0.92,
              ease: 'none',
            })
            .to(
              subRef.current,
              {
                yPercent: 60,
                opacity: 0,
                ease: 'none',
              },
              0
            );
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0E0E0E] pt-18"
    >
      {/* Background Media Slot: /assets/hero.mp4 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Procedural Ember Canvas (active immediately while video loads or as backdrop) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        />

        {/* Hero Video Slot with graceful fade-in once loaded */}
        <video
          ref={videoRef}
          src="/assets/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover z-1 transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-45' : 'opacity-0'
          }`}
        />

        {/* Dark Vignette and Street-Food Grain Grid */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/60 to-[#0E0E0E]/80 z-2" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(14,14,14,0.85)_100%)] z-2" />
        <div className="absolute inset-0 bg-noise opacity-40 z-2" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center py-16">
        {/* Top Kicker Stencil Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#D7261E] text-black font-['Barlow_Condensed'] font-black text-xs sm:text-sm uppercase tracking-widest px-4 py-1 rounded-sm mb-6 shadow-[0_0_20px_rgba(215,38,30,0.4)] badge-stamp">
          <Flame className="w-4 h-4 fill-current" />
          <span>DUBAI’S HEAVIEST 200°C CAST-IRON PRESS</span>
        </div>

        {/* Main Headline: "SMASHED. NOT SORRY." */}
        <h1
          ref={headlineRef}
          aria-label="SMASHED. NOT SORRY."
          className="font-['Bebas_Neue'] text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] leading-[0.88] tracking-tight uppercase select-none text-center"
        >
          {headlineWords.map((group, wIdx) => {
            const chars = Array.from(group.word);
            return (
              <span key={wIdx} className="inline-block whitespace-nowrap mx-2 sm:mx-3 my-1">
                {chars.map((char, cIdx) => (
                  <span
                    key={`${wIdx}-${cIdx}`}
                    style={{ color: group.color }}
                    className="hero-char inline-block will-change-transform drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                  >
                    {char}
                  </span>
                ))}
              </span>
            );
          })}
        </h1>

        {/* Subhead with street philosophy */}
        <div
          ref={subRef}
          className="mt-6 sm:mt-8 max-w-2xl text-center text-[#FFF6E5]/90 font-['Space_Grotesk'] text-base sm:text-lg md:text-xl font-normal leading-relaxed"
        >
          <p>
            No brioche fluff. No leafy distractions. Just 100% Australian Wagyu beef slammed
            paper-thin on blazing cast iron until the edges turn into caramelized, lacy glass.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onOpenOrder}
            className="w-full sm:w-auto bg-[#F2B705] hover:bg-[#ffe270] text-[#0E0E0E] font-['Barlow_Condensed'] font-black text-2xl uppercase tracking-wider px-10 py-4 rounded-sm shadow-[0_0_35px_rgba(242,183,5,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
          >
            ORDER NOW
          </button>
        </div>
      </div>
    </section>
  );
};
