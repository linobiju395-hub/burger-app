import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Flame, History, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const NumbersSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Counter values state
  const [burgersCount, setBurgersCount] = useState(0);
  const [yearsCount, setYearsCount] = useState(0);
  const [saucesCount, setSaucesCount] = useState(0);
  const [tempCount, setTempCount] = useState(0);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const cardsEl = cardsRef.current;
    if (!sectionEl || !cardsEl) return;

    const mm = gsap.matchMedia();

    /* =========================================================================
     * CODE REVIEW DEFENSE: "NUMBERS" SECTION TIMELINE
     * -------------------------------------------------------------------------
     * Trigger: sectionRef.current (#numbers)
     * Start: 'top 75%' (Fires when top of numbers enters 75% of viewport)
     * End: 'bottom 25%' (Completes as section nears bottom)
     * ToggleActions: 'play none none none' (Runs smoothly upon view entry)
     * Animate: ONLY transform and opacity on the grid cards and title containers,
     *          with GSAP proxy object interpolating counter numbers
     * Markers: commented out below ready for code review
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

        const cards = cardsEl.querySelectorAll('.stat-card');

        if (reducedMotion) {
          setBurgersCount(348920);
          setYearsCount(4);
          setSaucesCount(9);
          setTempCount(450);
          gsap.set(cards, { opacity: 1, y: 0 });
          return;
        }

        const countsProxy = {
          burgers: 0,
          years: 0,
          sauces: 0,
          temp: 0,
        };

        const numbersTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse',
            // markers: true, /* CODE REVIEW: Toggle on for trigger visualization */
          },
        });

        // 1. Cards stagger slide up (transform & opacity only)
        numbersTl.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'back.out(1.5)',
          },
          0
        );

        // 2. Numerical counter tween
        numbersTl.to(
          countsProxy,
          {
            burgers: 348920,
            years: 4,
            sauces: 9,
            temp: 450,
            duration: 2,
            ease: 'power3.out',
            onUpdate: () => {
              setBurgersCount(Math.floor(countsProxy.burgers));
              setYearsCount(Math.floor(countsProxy.years));
              setSaucesCount(Math.floor(countsProxy.sauces));
              setTempCount(Math.floor(countsProxy.temp));
            },
          },
          0.1
        );
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="numbers"
      className="relative w-full py-28 px-4 sm:px-6 lg:px-8 bg-[#0E0E0E] text-[#FFF6E5] overflow-hidden border-t border-[#FFF6E5]/10"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse,_rgba(242,183,5,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-['Bebas_Neue'] text-5xl sm:text-7xl tracking-wider uppercase text-[#FFF6E5] leading-none">
            BY THE <span className="text-[#F2B705]">NUMBERS</span>
          </h2>
          <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#FFF6E5]/75 mt-4">
            No marketing vanity. Real beef, authentic cast-iron telemetry, and four years of scorched perfection in Dubai.
          </p>
        </div>

        {/* 4 Large Counter Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Stat 1: Burgers Smashed */}
          <div className="stat-card bg-[#141414] border-2 border-[#FFF6E5]/15 hover:border-[#D7261E] p-8 rounded-sm text-center relative overflow-hidden group transition-colors will-change-transform">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#D7261E]/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 mx-auto rounded-sm bg-[#D7261E]/20 text-[#D7261E] flex items-center justify-center mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <div className="font-['Bebas_Neue'] text-6xl sm:text-7xl text-[#FFF6E5] tracking-tight leading-none group-hover:text-[#D7261E] transition-colors">
              {burgersCount.toLocaleString()}+
            </div>
            <div className="font-['Barlow_Condensed'] font-black text-xl text-[#F2B705] uppercase tracking-wider mt-2">
              BURGERS SMASHED
            </div>
            <p className="font-['Space_Grotesk'] text-xs text-[#FFF6E5]/60 mt-1">
              Freshly ground 100% Australian Wagyu beef patties pressed to order.
            </p>
          </div>

          {/* Stat 2: Years Open */}
          <div className="stat-card bg-[#141414] border-2 border-[#FFF6E5]/15 hover:border-[#F2B705] p-8 rounded-sm text-center relative overflow-hidden group transition-colors will-change-transform">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#F2B705]/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 mx-auto rounded-sm bg-[#F2B705]/20 text-[#F2B705] flex items-center justify-center mb-4">
              <History className="w-6 h-6" />
            </div>
            <div className="font-['Bebas_Neue'] text-6xl sm:text-7xl text-[#FFF6E5] tracking-tight leading-none group-hover:text-[#F2B705] transition-colors">
              0{yearsCount}
            </div>
            <div className="font-['Barlow_Condensed'] font-black text-xl text-[#F2B705] uppercase tracking-wider mt-2">
              YEARS IN AL QUOZ
            </div>
            <p className="font-['Space_Grotesk'] text-xs text-[#FFF6E5]/60 mt-1">
              Started in a back-alley warehouse pop-up in 2022; cult favorite since day one.
            </p>
          </div>

          {/* Stat 3: Sauces Made In-House */}
          <div className="stat-card bg-[#141414] border-2 border-[#FFF6E5]/15 hover:border-[#D7261E] p-8 rounded-sm text-center relative overflow-hidden group transition-colors will-change-transform">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#D7261E]/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 mx-auto rounded-sm bg-[#D7261E]/20 text-[#D7261E] flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <div className="font-['Bebas_Neue'] text-6xl sm:text-7xl text-[#FFF6E5] tracking-tight leading-none group-hover:text-[#D7261E] transition-colors">
              0{saucesCount}
            </div>
            <div className="font-['Barlow_Condensed'] font-black text-xl text-[#F2B705] uppercase tracking-wider mt-2">
              IN-HOUSE RECIPES
            </div>
            <p className="font-['Space_Grotesk'] text-xs text-[#FFF6E5]/60 mt-1">
              Zero bottled condiments. Smoked Shack Sauce, Truffle Garlic, Hot Honey, and Bacon Jam.
            </p>
          </div>

          {/* Stat 4: Griddle Surface Heat */}
          <div className="stat-card bg-[#141414] border-2 border-[#FFF6E5]/15 hover:border-[#F2B705] p-8 rounded-sm text-center relative overflow-hidden group transition-colors will-change-transform">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#F2B705]/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 mx-auto rounded-sm bg-[#F2B705]/20 text-[#F2B705] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="font-['Bebas_Neue'] text-6xl sm:text-7xl text-[#FFF6E5] tracking-tight leading-none group-hover:text-[#F2B705] transition-colors">
              {tempCount}°F
            </div>
            <div className="font-['Barlow_Condensed'] font-black text-xl text-[#F2B705] uppercase tracking-wider mt-2">
              GRIDDLE HEAT (232°C)
            </div>
            <p className="font-['Space_Grotesk'] text-xs text-[#FFF6E5]/60 mt-1">
              Calibrated laser surface temp maintained 18 hours daily for instant crust formation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
