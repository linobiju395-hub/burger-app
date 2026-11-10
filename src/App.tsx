/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TheBuildSection } from './components/TheBuildSection';
import { TheGriddleSection } from './components/TheGriddleSection';
import { TheMenuSection } from './components/TheMenuSection';
import { NumbersSection } from './components/NumbersSection';
import { FindUsSection } from './components/FindUsSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { MenuItem } from './types';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Initialize Lenis Smooth Scrolling and link with GSAP Ticker & ScrollTrigger
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger when layout and fonts settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const handleOpenOrder = () => {
    setSelectedMenuItem(null);
    setOrderModalOpen(true);
  };

  const handleSelectMenuItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setOrderModalOpen(true);
  };

  const handleScrollToBuild = () => {
    const buildEl = document.getElementById('build');
    if (buildEl) {
      buildEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#FFF6E5] font-['Space_Grotesk'] overflow-x-hidden selection:bg-[#F2B705] selection:text-black">
      {/* Fixed Header */}
      <Navbar onOpenOrder={handleOpenOrder} />

      {/* Main Scrollytelling Journey */}
      <main className="relative w-full overflow-x-hidden">
        {/* 1. HERO — Fullscreen video slot, character slam with overshoot ease */}
        <HeroSection
          onExploreClick={handleScrollToBuild}
          onOpenOrder={handleOpenOrder}
        />

        {/* 2. THE BUILD — Pinned 300vh, 120-frame canvas scrub, layer labels */}
        <TheBuildSection />

        {/* 3. THE GRIDDLE — Dark to deep orange shift, SVG sizzle lines */}
        <TheGriddleSection />

        {/* 4. THE MENU — Horizontal scroll pin, 6 menu cards with center tilt & scale */}
        <TheMenuSection onSelectItem={handleSelectMenuItem} />

        {/* 5. NUMBERS — Animated counters when in view */}
        <NumbersSection />

        {/* 6. FIND US — Map embed + opening hours + magnetic hover ORDER NOW button */}
        <FindUsSection onOpenOrder={handleOpenOrder} />
      </main>

      {/* Footer & Code Review Architecture Defense */}
      <Footer />

      {/* Interactive Order Customizer & Receipt Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        selectedItem={selectedMenuItem}
      />
    </div>
  );
}
