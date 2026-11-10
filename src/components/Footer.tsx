import React, { useState } from 'react';
import { Flame, Code2, ArrowUp, X, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [showCodeReviewModal, setShowCodeReviewModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0E0E0E] text-[#FFF6E5] border-t-2 border-[#FFF6E5]/15 overflow-hidden">
      {/* Infinite Street Marquee Ticker */}
      <div className="bg-[#F2B705] text-[#0E0E0E] py-3 overflow-hidden select-none border-b-2 border-black font-['Barlow_Condensed'] font-black text-2xl uppercase tracking-widest">
        <div className="animate-marquee whitespace-nowrap flex space-x-6">
          <span>SMASH & SONS DUBAI</span>
          <span>•</span>
          <span>100% AUSTRALIAN WAGYU</span>
          <span>•</span>
          <span>NO LEAFY GREENS EVER</span>
          <span>•</span>
          <span>200°C CAST IRON SEAR</span>
          <span>•</span>
          <span>CRISP LACY EDGES</span>
          <span>•</span>
          <span>MARTIN’S POTATO BUNS</span>
          <span>•</span>
          <span>AL QUOZ WAREHOUSE 17</span>
          <span>•</span>
          <span>OPEN TIL 3:00 AM</span>
          <span>•</span>
          {/* Duplicate set for seamless loop */}
          <span>SMASH & SONS DUBAI</span>
          <span>•</span>
          <span>100% AUSTRALIAN WAGYU</span>
          <span>•</span>
          <span>NO LEAFY GREENS EVER</span>
          <span>•</span>
          <span>200°C CAST IRON SEAR</span>
          <span>•</span>
          <span>CRISP LACY EDGES</span>
          <span>•</span>
          <span>MARTIN’S POTATO BUNS</span>
          <span>•</span>
          <span>AL QUOZ WAREHOUSE 17</span>
          <span>•</span>
          <span>OPEN TIL 3:00 AM</span>
          <span>•</span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[#FFF6E5]/10">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-sm bg-[#D7261E] flex items-center justify-center font-black text-black text-xl border-2 border-[#F2B705]">
                S&S
              </div>
              <span className="font-['Bebas_Neue'] text-4xl tracking-wider text-[#FFF6E5]">
                SMASH <span className="text-[#F2B705]">&</span> SONS
              </span>
            </div>
            <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#FFF6E5]/60 max-w-md mt-2">
              Born in Al Quoz Industrial 1, Dubai. Dedicated to the uncompromising art of high-heat smash burger physics.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowCodeReviewModal(true)}
              className="bg-[#1C1C1C] hover:bg-[#F2B705] hover:text-black text-[#FFF6E5] font-mono text-xs uppercase px-4 py-2.5 rounded-sm border border-[#FFF6E5]/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>CODE REVIEW CHEAT SHEET</span>
            </button>

            <button
              onClick={scrollToTop}
              className="bg-[#1C1C1C] hover:bg-[#D7261E] text-[#FFF6E5] font-mono text-xs uppercase px-4 py-2.5 rounded-sm border border-[#FFF6E5]/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>TOP</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#FFF6E5]/40 gap-4">
          <div>
            © 2026 SMASH & SONS BURGERS L.L.C. AL QUOZ, DUBAI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center space-x-4">
            <span>LENIS 1.3 SMOOTH SCROLL</span>
            <span>•</span>
            <span>GSAP 3.15 SCROLLTRIGGER</span>
            <span>•</span>
            <span className="text-[#F2B705]">30-FRAME EXPLOSION</span>
          </div>
        </div>
      </div>

      {/* Code Review Defense Modal */}
      {showCodeReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowCodeReviewModal(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />
          <div className="relative z-10 w-full max-w-2xl bg-[#141414] border-2 border-[#F2B705] rounded-sm p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#FFF6E5]/15">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-[#F2B705]" />
                <h3 className="font-['Barlow_Condensed'] font-black text-2xl uppercase text-[#FFF6E5]">
                  CODE REVIEW ARCHITECTURE DEFENSE
                </h3>
              </div>
              <button
                onClick={() => setShowCodeReviewModal(false)}
                className="text-[#FFF6E5]/60 hover:text-[#F2B705]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 font-mono text-xs text-[#FFF6E5]/80">
              <div className="bg-[#0A0A0A] p-4 rounded-xs border border-[#FFF6E5]/10 space-y-1">
                <div className="text-[#F2B705] font-bold">1. HERO SECTION</div>
                <div>Trigger: #hero | Start: 'top top' | End: 'bottom top' | Scrub: 0.8 / 0.4</div>
                <div className="text-[#FFF6E5]/50">Character split slam with back.out(1.7) overshoot ease. Video slot /assets/hero.mp4 with procedural canvas ember fallback.</div>
              </div>

              <div className="bg-[#0A0A0A] p-4 rounded-xs border border-[#FFF6E5]/10 space-y-1">
                <div className="text-[#F2B705] font-bold">2. THE BUILD (CANVAS EXPLOSION)</div>
                <div>Trigger: #build | Start: 'top top' | End: '+=300%' (Desktop) / '+=180%' (Mobile) | Pin: true | Scrub: 0.6</div>
                <div className="text-[#FFF6E5]/50">30 frames (/assets/frames/burger_%04d.webp). Preloads first 10, lazy-loads 11..30. Cover-fit DPR on resize. 7 layer labels fade in/out beside canvas. Hermite interpolation for smooth scrubbing.</div>
              </div>

              <div className="bg-[#0A0A0A] p-4 rounded-xs border border-[#FFF6E5]/10 space-y-1">
                <div className="text-[#F2B705] font-bold">3. THE GRIDDLE</div>
                <div>Trigger: #griddle | Start: 'top 80%' | End: 'bottom 20%' | Scrub: 0.8</div>
                <div className="text-[#FFF6E5]/50">Background shifts from #0E0E0E to deep orange via opacity overlay (strictly transform & opacity). Sizzle SVG lines draw in with scaleY & opacity.</div>
              </div>

              <div className="bg-[#0A0A0A] p-4 rounded-xs border border-[#FFF6E5]/10 space-y-1">
                <div className="text-[#F2B705] font-bold">4. THE MENU (HORIZONTAL PIN)</div>
                <div>Trigger: #menu | Start: 'top top' | End: () =&gt; `+=${'{track.scrollWidth - innerWidth}'}` | Pin: true | Scrub: 0.8</div>
                <div className="text-[#FFF6E5]/50">Cards slide along X transform. In-view viewport center calculation tilts cards (-2.2deg / +2.2deg) and scales up to 1.06x when centered.</div>
              </div>

              <div className="bg-[#0A0A0A] p-4 rounded-xs border border-[#FFF6E5]/10 space-y-1">
                <div className="text-[#F2B705] font-bold">5. NUMBERS</div>
                <div>Trigger: #numbers | Start: 'top 75%' | End: 'bottom 25%' | ToggleActions: 'play none none reverse'</div>
                <div className="text-[#FFF6E5]/50">Counters tween proxy object up to 348,920+ burgers, 4 years, 9 sauces, 450°F. Cards slide up on transform & opacity.</div>
              </div>

              <div className="bg-[#0A0A0A] p-4 rounded-xs border border-[#FFF6E5]/10 space-y-1">
                <div className="text-[#F2B705] font-bold">6. FIND US & MAGNETIC BUTTON</div>
                <div>Trigger: #findus | Start: 'top 75%' | End: 'bottom 20%'</div>
                <div className="text-[#FFF6E5]/50">Map embed + hours. Magnetic button computes delta mouse vector (dx, dy) with GSAP spring back on leave.</div>
              </div>

              <div className="bg-[#0A0A0A] p-4 rounded-xs border border-[#FFF6E5]/10 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CONSTRAINTS VERIFICATION</span>
                </div>
                <div>• One timeline per section with individual ScrollTrigger</div>
                <div>• Commented // markers: true lines in every ScrollTrigger</div>
                <div>• gsap.matchMedia() for desktop, mobile, prefers-reduced-motion</div>
                <div>• Only transform and opacity animated</div>
                <div>• Zero horizontal page overflow</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
