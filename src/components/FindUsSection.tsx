import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Phone, Navigation, ArrowUpRight, Flame, ShieldAlert } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

gsap.registerPlugin(ScrollTrigger);

interface FindUsSectionProps {
  onOpenOrder: () => void;
}

export const FindUsSection: React.FC<FindUsSectionProps> = ({ onOpenOrder }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapCardRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);
  const magneticWrapRef = useRef<HTMLDivElement>(null);

  // GSAP Section Timeline with ScrollTrigger
  useEffect(() => {
    const sectionEl = sectionRef.current;
    const mapEl = mapCardRef.current;
    const infoEl = infoCardRef.current;
    if (!sectionEl || !mapEl || !infoEl) return;

    const mm = gsap.matchMedia();

    /* =========================================================================
     * CODE REVIEW DEFENSE: "FIND US" SECTION TIMELINE
     * -------------------------------------------------------------------------
     * Trigger: sectionRef.current (#findus)
     * Start: 'top 75%' (Begins when top of Find Us reaches 75% of viewport)
     * End: 'bottom 20%' (Completes as section advances)
     * ToggleActions: 'play none none reverse'
     * Animate: ONLY transform and opacity on map card, info card, and order button
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

        if (reducedMotion) {
          gsap.set([mapEl, infoEl, magneticWrapRef.current], { opacity: 1, y: 0 });
          return;
        }

        const findUsTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 75%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            // markers: true, /* CODE REVIEW: Toggle on for trigger visualization */
          },
        });

        findUsTl.fromTo(
          [mapEl, infoEl],
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
          },
          0
        );

        findUsTl.fromTo(
          magneticWrapRef.current,
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' },
          0.3
        );
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  // Magnetic Hover Effect on Big ORDER NOW Button
  useEffect(() => {
    const wrap = magneticWrapRef.current;
    const btn = magneticBtnRef.current;
    if (!wrap || !btn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      // Smooth magnetic pull strength
      gsap.to(btn, {
        x: relX * 0.38,
        y: relY * 0.38,
        rotateZ: relX * 0.04,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      // Elastic spring back to origin
      gsap.to(btn, {
        x: 0,
        y: 0,
        rotateZ: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.35)',
      });
    };

    wrap.addEventListener('mousemove', handleMouseMove);
    wrap.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      wrap.removeEventListener('mousemove', handleMouseMove);
      wrap.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleOrderClick = () => {
    soundEffects.playSmash();
    onOpenOrder();
  };

  return (
    <section
      ref={sectionRef}
      id="findus"
      className="relative min-h-screen w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0E0E0E] text-[#FFF6E5] overflow-hidden flex flex-col justify-center border-t border-[#FFF6E5]/10"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,_rgba(215,38,30,0.12)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase text-[#FFF6E5] leading-none">
            CRUSH YOUR <span className="text-[#D7261E]">CRAVINGS.</span>
          </h2>
          <p className="font-['Space_Grotesk'] text-sm sm:text-base text-[#FFF6E5]/75 mt-4">
            Tucked behind the heavy industrial gates of Al Quoz 1. Follow the smell of sizzling Wagyu fat and charred onions.
          </p>
        </div>

        {/* 2-Column Layout: Map Embed + Info Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map Column (7 Cols) */}
          <div
            ref={mapCardRef}
            className="lg:col-span-7 bg-[#141414] border-2 border-[#FFF6E5]/15 rounded-sm overflow-hidden flex flex-col min-h-[380px] sm:min-h-[460px] relative will-change-transform group"
          >
            {/* Top Bar with Coordinates */}
            <div className="bg-[#1C1C1C] px-5 py-3 border-b border-[#FFF6E5]/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2 text-[#F2B705]">
                <Navigation className="w-3.5 h-3.5" />
                <span className="font-bold">25.1388° N, 55.2285° E</span>
              </div>
              <span className="text-[#FFF6E5]/50 uppercase text-[10px]">
                AL QUOZ INDUSTRIAL 1 • DUBAI
              </span>
            </div>

            {/* Real Map Embed */}
            <div className="relative flex-1 w-full h-full min-h-[320px] bg-[#0A0A0A]">
              <iframe
                title="SMASH & SONS Location Dubai"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14444.606259021588!2d55.2285!3d25.1388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6a27e774eb07%3A0x633e7ad6d2524a1b!2sAlserkal%20Avenue!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(120%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[340px]"
              />

              {/* Map Marker Stencil Overlay */}
              <div className="absolute top-4 left-4 z-10 bg-black/90 border border-[#F2B705] p-3 rounded-xs backdrop-blur-md shadow-2xl pointer-events-none">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#D7261E] animate-ping" />
                  <span className="font-['Barlow_Condensed'] font-black text-base text-[#FFF6E5] uppercase tracking-wider">
                    WAREHOUSE 17 • S&S HQ
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#F2B705] mt-0.5">
                  Free street parking available outside gate 4
                </div>
              </div>
            </div>
          </div>

          {/* Info Column (5 Cols) */}
          <div
            ref={infoCardRef}
            className="lg:col-span-5 bg-[#141414] border-2 border-[#FFF6E5]/15 p-6 sm:p-8 rounded-sm flex flex-col justify-between will-change-transform"
          >
            {/* Opening Hours */}
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#F2B705] uppercase tracking-widest mb-3">
                <Clock className="w-4 h-4 text-[#F2B705]" />
                <span>OPENING HOURS // NIGHT SIZZLE</span>
              </div>
              <h3 className="font-['Barlow_Condensed'] font-black text-3xl uppercase tracking-wide text-[#FFF6E5] mb-4">
                WE SLEEP WHEN THE CAST IRON COOLS.
              </h3>

              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <div className="flex justify-between items-center py-2 border-b border-[#FFF6E5]/10">
                  <span className="text-[#FFF6E5]/70">MON — THU</span>
                  <span className="text-[#FFF6E5] font-bold">12:00 PM — 02:00 AM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#FFF6E5]/10">
                  <span className="text-[#FFF6E5]/70">FRI — SUN</span>
                  <span className="text-[#F2B705] font-bold">12:00 PM — 04:00 AM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#FFF6E5]/70">DELIVERY (TALABAT / DELIVEROO / CAREEM)</span>
                  <span className="text-emerald-400 font-bold">ACTIVE NOW</span>
                </div>
              </div>
            </div>

            {/* Address & Hotline */}
            <div className="mt-8 pt-6 border-t border-[#FFF6E5]/10 space-y-4 font-mono text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#D7261E] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#FFF6E5] font-bold">Warehouse 17, 8th Street</div>
                  <div className="text-[#FFF6E5]/60">Al Serkal District, Al Quoz 1, Dubai, UAE</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#F2B705] flex-shrink-0" />
                <div>
                  <a
                    href="tel:+97148837627"
                    className="text-[#FFF6E5] font-bold hover:text-[#F2B705] transition-colors"
                  >
                    +971 4 883 7627 (HOTLINE)
                  </a>
                  <span className="text-[#FFF6E5]/50 ml-2">/ WhatsApp: +971 50 492 8819</span>
                </div>
              </div>
            </div>

            {/* Prompt for Magnetic Button */}
            <div className="mt-8 pt-4 text-center">
              <span className="font-mono text-[10px] text-[#FFF6E5]/50 uppercase tracking-widest block mb-2">
                HOVER TO ENGAGE MAGNETIC ATTRACTION
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
         * BIG "ORDER NOW" BUTTON WITH MAGNETIC HOVER EFFECT
         * =================================================================== */}
        <div
          ref={magneticWrapRef}
          className="mt-16 sm:mt-20 flex justify-center items-center py-6 will-change-transform"
        >
          <button
            ref={magneticBtnRef}
            onClick={handleOrderClick}
            className="relative group bg-[#F2B705] hover:bg-[#FFE066] text-[#0E0E0E] font-['Barlow_Condensed'] font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-wider px-10 sm:px-16 py-6 sm:py-8 rounded-sm shadow-[0_0_60px_rgba(242,183,5,0.45)] transition-colors cursor-pointer border-4 border-black select-none will-change-transform flex items-center space-x-4"
          >
            <span>ORDER NOW</span>
            <ArrowUpRight className="w-8 h-8 sm:w-12 sm:h-12 stroke-[3] group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
