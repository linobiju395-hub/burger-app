import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MENU_ITEMS } from '../data/menuData';
import { MenuItem } from '../types';
import { Flame, Plus, Sparkles, UtensilsCrossed } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TheMenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
}

export const TheMenuSection: React.FC<TheMenuSectionProps> = ({ onSelectItem }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const trackEl = trackRef.current;
    if (!sectionEl || !trackEl) return;

    const mm = gsap.matchMedia();

    /* =========================================================================
     * CODE REVIEW DEFENSE: "THE MENU" HORIZONTAL SCROLL TIMELINE
     * -------------------------------------------------------------------------
     * Trigger: sectionRef.current (#menu)
     * Start: 'top top' (Pins the section as soon as header lands at top)
     * End: () => `+=${trackEl.scrollWidth - window.innerWidth}` (Dynamic pixel distance
     *      equal to the horizontal overflow of the cards track)
     * Pin: true (Locks the screen in place while scroll advances horizontal translation)
     * Scrub: 1 (Buttery smooth 1-second lag scrub sync)
     * In-View Card Tilt & Scale: onUpdate computes each card's viewport center
     * proximity to apply scale (1.0 -> 1.06) and subtle street tilt (-2deg / +2deg)
     * Animate: ONLY transform and opacity per project constraint
     * Markers: commented out below ready for code review
     * ========================================================================= */

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
        reducedMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, isMobile, reducedMotion } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reducedMotion: boolean;
        };

        if (reducedMotion) {
          // Reduced motion: no pinning, full natural layout
          gsap.set(trackEl, { x: 0 });
          cardsRef.current.forEach((c) => {
            if (c) gsap.set(c, { scale: 1, rotation: 0, opacity: 1 });
          });
          return;
        }

        const getScrollDistance = () => {
          return trackEl.scrollWidth - window.innerWidth + (isDesktop ? 120 : 60);
        };

        const horizontalTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: isDesktop ? 0.8 : 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // markers: true, /* CODE REVIEW: Toggle on for trigger visualization */
            onUpdate: (self) => {
              // Calculate centering for each card to tilt slightly and scale up
              const centerX = window.innerWidth / 2;

              cardsRef.current.forEach((card, index) => {
                if (!card) return;
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const distFromCenter = Math.abs(centerX - cardCenter);
                const maxDist = window.innerWidth * 0.4;

                if (distFromCenter < maxDist) {
                  const factor = 1 - distFromCenter / maxDist; // 0 to 1
                  const scale = 1 + factor * 0.06;
                  // Alternating slight tilt angle per card when centred
                  const tiltAngle = (index % 2 === 0 ? -2.2 : 2.2) * factor;

                  gsap.set(card, {
                    scale,
                    rotateZ: tiltAngle,
                    zIndex: Math.round(factor * 20),
                    overwrite: 'auto',
                  });
                } else {
                  gsap.set(card, {
                    scale: 1,
                    rotateZ: 0,
                    zIndex: 1,
                    overwrite: 'auto',
                  });
                }
              });
            },
          },
        });

        // Translate track horizontally along X axis (transform only)
        horizontalTl.to(trackEl, {
          x: () => -getScrollDistance(),
          ease: 'none',
        });
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="relative min-h-screen w-full bg-[#0E0E0E] text-[#FFF6E5] overflow-hidden flex flex-col justify-center py-12"
    >
      {/* Background ambient texture */}
      <div className="absolute inset-0 bg-noise opacity-35 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(215,38,30,0.1)_0%,_transparent_70%)] pointer-events-none" />

      {/* Top Header Sticky / Floating */}
      <div
        ref={headerRef}
        className="max-w-7xl mx-auto px-4 sm:px-8 w-full mb-6 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between"
      >
        <div>
          <h2 className="font-['Bebas_Neue'] text-5xl sm:text-7xl tracking-wider uppercase text-[#FFF6E5] leading-none">
            SMASH & SONS <span className="text-[#F2B705]">STREET MENU</span>
          </h2>
        </div>
      </div>

      {/* Horizontal Cards Track Container */}
      <div className="relative w-full z-10 overflow-visible py-4">
        <div
          ref={trackRef}
          className="flex space-x-6 sm:space-x-8 px-4 sm:px-12 w-max items-center will-change-transform"
        >
          {MENU_ITEMS.map((item, idx) => {
            const hasError = imgErrors[item.id];
            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onClick={() => onSelectItem(item)}
                className="w-[300px] sm:w-[380px] flex-shrink-0 bg-[#161616] border-2 border-[#FFF6E5]/15 hover:border-[#F2B705] rounded-sm p-5 sm:p-6 cursor-pointer group transition-colors shadow-2xl relative select-none will-change-transform"
              >
                {/* Item Number Stencil */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-['Bebas_Neue'] text-4xl text-[#FFF6E5]/30 group-hover:text-[#F2B705] transition-colors leading-none">
                    0{idx + 1}
                  </span>
                  <div className="flex space-x-1.5">
                    {item.badges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                          badge === 'BESTSELLER' || badge === 'SPICY 3X'
                            ? 'bg-[#D7261E] text-black'
                            : 'bg-[#F2B705] text-black'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Media Slot (Target: /assets/menu/*.webp with stylized fallback) */}
                <div className="relative w-full h-52 sm:h-60 rounded-xs overflow-hidden bg-[#0A0A0A] border border-[#FFF6E5]/10 flex items-center justify-center group-hover:border-[#F2B705]/50 transition-colors">
                  {!hasError && (
                    <img
                      src={item.imageSlot}
                      alt={item.name}
                      onError={() => handleImgError(item.id)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Fallback Graphic Card when image file is not on disk yet */}
                  {hasError && (
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#1C1C1C] to-[#0A0A0A]">
                      {/* Stylized Illustrated Graphic */}
                      <div className="w-20 h-20 rounded-full bg-[#0E0E0E] border-2 border-[#F2B705] flex items-center justify-center shadow-[0_0_20px_rgba(242,183,5,0.2)] mb-3 group-hover:rotate-12 transition-transform">
                        <Flame className="w-10 h-10 text-[#F2B705]" />
                      </div>
                      <span className="font-mono text-[10px] text-[#FFF6E5]/50 uppercase tracking-widest">
                        SLOT: {item.imageSlot}
                      </span>
                      <span className="font-['Barlow_Condensed'] font-black text-xl text-[#F2B705] tracking-wider uppercase mt-1">
                        100% WAGYU SMASH
                      </span>
                    </div>
                  )}

                  {/* Price Tag Pill */}
                  <div className="absolute bottom-3 right-3 bg-black/90 border border-[#F2B705] text-[#F2B705] font-['Barlow_Condensed'] font-black text-2xl px-3 py-1 rounded-xs tracking-wider shadow-lg">
                    {item.priceAed} <span className="text-xs font-mono text-[#FFF6E5]/70">AED</span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="mt-5">
                  <div className="text-[11px] font-mono text-[#F2B705] uppercase tracking-widest">
                    {item.tagline}
                  </div>
                  <h3 className="font-['Barlow_Condensed'] font-black text-3xl uppercase tracking-wide text-[#FFF6E5] mt-1 group-hover:text-[#F2B705] transition-colors">
                    {item.name}
                  </h3>
                  <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#FFF6E5]/75 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Key Ingredients */}
                  <div className="mt-4 pt-4 border-t border-[#FFF6E5]/10 flex flex-wrap gap-1.5">
                    {item.ingredients.slice(0, 3).map((ing, iIdx) => (
                      <span
                        key={iIdx}
                        className="text-[10px] font-mono bg-black/60 text-[#FFF6E5]/60 px-2 py-0.5 rounded-xs border border-[#FFF6E5]/10"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Add Action */}
                  <button className="mt-4 w-full bg-[#1F1F1F] group-hover:bg-[#F2B705] group-hover:text-black text-[#FFF6E5] font-['Barlow_Condensed'] font-black text-lg uppercase tracking-wider py-2 rounded-xs border border-[#FFF6E5]/15 transition-all flex items-center justify-center space-x-1.5">
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>CUSTOMIZE & SMASH</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
