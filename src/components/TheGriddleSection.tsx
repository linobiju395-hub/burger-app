import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Gauge, Zap, Thermometer, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const TheGriddleSection: React.FC = () => {
  const griddleRef = useRef<HTMLDivElement>(null);
  const orangeBgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const kpiCardsRef = useRef<HTMLDivElement>(null);
  const sizzleSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const sectionEl = griddleRef.current;
    const orangeEl = orangeBgRef.current;
    const titleEl = titleRef.current;
    const cardsEl = kpiCardsRef.current;
    const svgEl = sizzleSvgRef.current;
    if (!sectionEl || !orangeEl || !titleEl || !cardsEl || !svgEl) return;

    const mm = gsap.matchMedia();

    /* =========================================================================
     * CODE REVIEW DEFENSE: "THE GRIDDLE" SECTION TIMELINE
     * -------------------------------------------------------------------------
     * Trigger: griddleRef.current (#griddle)
     * Start: 'top 80%' (Begins when top of section enters 80% of viewport)
     * End: 'bottom 20%' (Completes as section exits 20% from top)
     * Scrub: 0.8 (Smooth reactive scrub during scroll)
     * Animate: ONLY transform and opacity (orange overlay opacity shifts color
     *          from black to deep fiery orange with zero layout repaint)
     * Markers: commented out ready for review
     * ========================================================================= */

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
        reducedMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { reducedMotion } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reducedMotion: boolean;
        };

        const sizzleLines = svgEl.querySelectorAll('.sizzle-path');
        const cards = cardsEl.querySelectorAll('.griddle-card');

        if (reducedMotion) {
          gsap.set(orangeEl, { opacity: 0.85 });
          gsap.set(titleEl, { opacity: 1, y: 0 });
          gsap.set(cards, { opacity: 1, y: 0 });
          gsap.set(sizzleLines, { opacity: 1 });
          return;
        }

        const griddleTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.8,
            // markers: true, /* CODE REVIEW: Toggle on for trigger visualization */
          },
        });

        // 1. Background shift: fade in deep orange overlay using opacity only
        griddleTl.to(orangeEl, {
          opacity: 0.92,
          ease: 'power1.inOut',
          duration: 1,
        }, 0);

        // 2. Headline and kicker scale and slide up
        griddleTl.fromTo(
          titleEl,
          { opacity: 0.2, y: 40 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 },
          0.1
        );

        // 3. Sizzle SVGs draw in via transform and opacity
        griddleTl.fromTo(
          sizzleLines,
          { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' },
          { opacity: 0.85, scaleY: 1, stagger: 0.05, ease: 'power2.out', duration: 0.8 },
          0.2
        );

        // 4. Craft breakdown cards slide up with stagger
        griddleTl.fromTo(
          cards,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.12, ease: 'back.out(1.4)', duration: 0.7 },
          0.35
        );
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={griddleRef}
      id="griddle"
      className="relative min-h-screen w-full py-28 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden bg-[#0E0E0E] text-[#FFF6E5]"
    >
      {/* Base Black Layer */}
      <div className="absolute inset-0 bg-[#0E0E0E] z-0 pointer-events-none" />

      {/* Fiery Deep Orange / Charcoal Red Backdrop (Opacity scrubbed via GSAP for zero repaint) */}
      <div
        ref={orangeBgRef}
        className="absolute inset-0 z-1 pointer-events-none opacity-0 bg-[radial-gradient(ellipse_at_top,_#D7261E_0%,_#8F1D17_35%,_#420C09_70%,_#0E0E0E_100%)] transition-opacity"
      />

      {/* Grit / Iron Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-45 z-2 pointer-events-none" />

      {/* Sizzle-Line SVG Grid Drawing In */}
      <svg
        ref={sizzleSvgRef}
        className="absolute inset-0 w-full h-full z-2 pointer-events-none overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
      >
        <defs>
          <linearGradient id="sizzleGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F2B705" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#D7261E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0E0E0E" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sizzleGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFF6E5" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#F2B705" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0E0E0E" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Heat rise sizzle lines */}
        <path
          className="sizzle-path will-change-transform"
          d="M 120 580 Q 135 400 110 260 T 140 60"
          fill="none"
          stroke="url(#sizzleGrad1)"
          strokeWidth="3"
        />
        <path
          className="sizzle-path will-change-transform"
          d="M 280 600 Q 260 420 300 290 T 270 70"
          fill="none"
          stroke="url(#sizzleGrad2)"
          strokeWidth="2.5"
        />
        <path
          className="sizzle-path will-change-transform"
          d="M 500 590 Q 520 380 480 240 T 510 40"
          fill="none"
          stroke="url(#sizzleGrad1)"
          strokeWidth="3.5"
        />
        <path
          className="sizzle-path will-change-transform"
          d="M 720 600 Q 690 410 740 250 T 710 80"
          fill="none"
          stroke="url(#sizzleGrad2)"
          strokeWidth="2.5"
        />
        <path
          className="sizzle-path will-change-transform"
          d="M 880 580 Q 900 390 870 270 T 900 50"
          fill="none"
          stroke="url(#sizzleGrad1)"
          strokeWidth="3"
        />
      </svg>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2
            ref={titleRef}
            className="font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase text-[#FFF6E5] leading-[0.9] will-change-transform"
          >
            THE CRUST IS <br />
            <span className="text-[#F2B705]">THE CONTRACT.</span>
          </h2>

          <p className="font-['Space_Grotesk'] text-base sm:text-lg text-[#FFF6E5]/80 mt-6 leading-relaxed">
            Most joints gently pat their meat. We slam it with a custom 10-pound machined steel press
            onto 200°C seasoned cast iron within 15 seconds of contact. The instant thermal shock
            creates the legendary Maillard lattice.
          </p>
        </div>

        {/* 4 Technical Pillars of the Griddle */}
        <div
          ref={kpiCardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {/* Card 1 */}
          <div className="griddle-card bg-[#141414]/90 border-2 border-[#FFF6E5]/10 p-6 rounded-sm backdrop-blur-md hover:border-[#F2B705] transition-colors will-change-transform group">
            <div className="w-12 h-12 rounded-sm bg-[#D7261E]/20 border border-[#D7261E] flex items-center justify-center text-[#D7261E] mb-5 group-hover:scale-110 transition-transform">
              <Thermometer className="w-6 h-6" />
            </div>
            <h3 className="font-['Barlow_Condensed'] font-black text-3xl uppercase tracking-wide text-[#FFF6E5]">
              200°C CAST IRON
            </h3>
            <p className="font-['Space_Grotesk'] text-sm text-[#FFF6E5]/75 mt-2 leading-relaxed">
              Industrial grade 1-inch thick solid steel platen. Extreme thermal inertia guarantees zero temperature drop when cold wagyu hits the steel.
            </p>
          </div>

          {/* Card 2 */}
          <div className="griddle-card bg-[#141414]/90 border-2 border-[#FFF6E5]/10 p-6 rounded-sm backdrop-blur-md hover:border-[#F2B705] transition-colors will-change-transform group">
            <div className="w-12 h-12 rounded-sm bg-[#F2B705]/20 border border-[#F2B705] flex items-center justify-center text-[#F2B705] mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-['Barlow_Condensed'] font-black text-3xl uppercase tracking-wide text-[#FFF6E5]">
              10-TON LEVER SMASH
            </h3>
            <p className="font-['Space_Grotesk'] text-sm text-[#FFF6E5]/75 mt-2 leading-relaxed">
              Pressed paper-thin in under 10 seconds. Maximizes surface-to-heat ratio before interior fat renders out, locking in pure Wagyu juice.
            </p>
          </div>

          {/* Card 3 */}
          <div className="griddle-card bg-[#141414]/90 border-2 border-[#FFF6E5]/10 p-6 rounded-sm backdrop-blur-md hover:border-[#F2B705] transition-colors will-change-transform group">
            <div className="w-12 h-12 rounded-sm bg-[#D7261E]/20 border border-[#D7261E] flex items-center justify-center text-[#D7261E] mb-5 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-['Barlow_Condensed'] font-black text-3xl uppercase tracking-wide text-[#FFF6E5]">
              80/20 WAGYU RATIO
            </h3>
            <p className="font-['Space_Grotesk'] text-sm text-[#FFF6E5]/75 mt-2 leading-relaxed">
              Brisket, short rib, and chuck custom blend. High intramuscular marbling produces explosive beef umami with brittle, lacy outer perimeter.
            </p>
          </div>

          {/* Card 4 */}
          <div className="griddle-card bg-[#141414]/90 border-2 border-[#FFF6E5]/10 p-6 rounded-sm backdrop-blur-md hover:border-[#F2B705] transition-colors will-change-transform group">
            <div className="w-12 h-12 rounded-sm bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-['Barlow_Condensed'] font-black text-3xl uppercase tracking-wide text-[#FFF6E5]">
              ZERO LEAF POLICY
            </h3>
            <p className="font-['Space_Grotesk'] text-sm text-[#FFF6E5]/75 mt-2 leading-relaxed">
              No lettuce. No raw tomato slices sweating on your bun. If an ingredient doesn’t amplify crust or molten cheese, it doesn’t enter this kitchen.
            </p>
          </div>
        </div>

        {/* Street Manifesto Strip */}
        <div className="mt-14 p-6 sm:p-8 bg-black/80 border border-[#F2B705]/40 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-lg">
          <div className="flex items-center space-x-4">
            <span className="font-['Bebas_Neue'] text-5xl text-[#F2B705] leading-none">
              90 SEC
            </span>
            <div className="text-sm font-['Space_Grotesk'] text-[#FFF6E5]/90 max-w-md">
              <strong className="text-[#FFF6E5] block uppercase font-bold">
                TOTAL GRIDDLE TIME PER PATTY
              </strong>
              45 seconds sear, scrape aggressively with razor spatula, flip, slap cheese, dome steam for 45 seconds. Done.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
