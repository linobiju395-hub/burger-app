import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Flame, MapPin, Menu, X, ArrowUpRight } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface NavbarProps {
  onOpenOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrder }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dubaiTime, setDubaiTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Dubai is UTC+4
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setDubaiTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAudio = () => {
    const active = soundEffects.toggleMute();
    setIsPlayingAudio(active);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E0E0E]/90 backdrop-blur-md border-b border-[#FFF6E5]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo (Left) */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer group flex items-center space-x-3 shrink-0"
        >
          <div className="w-11 h-11 rounded-sm bg-[#D7261E] flex items-center justify-center font-black text-black text-2xl tracking-tighter border-2 border-[#F2B705] transform group-hover:rotate-6 transition-transform shadow-[0_0_15px_rgba(215,38,30,0.4)]">
            S&S
          </div>
          <div>
            <span className="font-['Bebas_Neue'] text-2xl sm:text-3xl lg:text-4xl tracking-wider text-[#FFF6E5] block leading-none">
              SMASH <span className="text-[#F2B705]">&</span> SONS
            </span>
            <span className="text-[11px] tracking-widest text-[#FFF6E5]/60 font-mono uppercase block mt-0.5">
              AL QUOZ • DUBAI
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation - Fills the Center Space with Prominent, Larger Typography */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-4 lg:mx-8 xl:mx-12 space-x-6 lg:space-x-9 xl:space-x-12 text-sm lg:text-[15px] xl:text-base font-['Space_Grotesk'] font-bold tracking-widest uppercase text-[#FFF6E5]/90">
          <button 
            onClick={() => scrollToSection('build')}
            className="hover:text-[#F2B705] transition-colors cursor-pointer py-1.5 relative group"
          >
            <span>The Build</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F2B705] transition-all duration-300 group-hover:w-full" />
          </button>
          <button 
            onClick={() => scrollToSection('griddle')}
            className="hover:text-[#F2B705] transition-colors cursor-pointer py-1.5 relative group"
          >
            <span>The Griddle</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F2B705] transition-all duration-300 group-hover:w-full" />
          </button>
          <button 
            onClick={() => scrollToSection('menu')}
            className="hover:text-[#F2B705] transition-colors cursor-pointer py-1.5 relative group"
          >
            <span>The Menu</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F2B705] transition-all duration-300 group-hover:w-full" />
          </button>
          <button 
            onClick={() => scrollToSection('numbers')}
            className="hover:text-[#F2B705] transition-colors cursor-pointer py-1.5 relative group"
          >
            <span>Numbers</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F2B705] transition-all duration-300 group-hover:w-full" />
          </button>
          <button 
            onClick={() => scrollToSection('findus')}
            className="hover:text-[#F2B705] transition-colors cursor-pointer flex items-center space-x-1.5 py-1.5 relative group"
          >
            <MapPin className="w-4 h-4 text-[#D7261E]" />
            <span>Find Us</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F2B705] transition-all duration-300 group-hover:w-full" />
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Audio Sizzle Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-sm border flex items-center space-x-2 transition-all ${
              isPlayingAudio 
                ? 'bg-[#F2B705]/20 border-[#F2B705] text-[#F2B705]' 
                : 'bg-black/40 border-[#FFF6E5]/20 text-[#FFF6E5]/60 hover:border-[#FFF6E5]/50'
            }`}
            title="Toggle procedural griddle sizzle audio"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#F2B705]" />
                <span className="hidden sm:inline">SIZZLE: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SIZZLE: OFF</span>
              </>
            )}
          </button>

          {/* Big Order CTA */}
          <button
            onClick={onOpenOrder}
            className="relative group bg-[#F2B705] hover:bg-[#FFE066] text-[#0E0E0E] font-['Barlow_Condensed'] font-black text-lg uppercase tracking-wider px-5 py-2 rounded-sm shadow-[0_0_20px_rgba(242,183,5,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center space-x-1.5"
          >
            <span>ORDER NOW</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#FFF6E5] hover:text-[#F2B705]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E0E0E] border-b border-[#FFF6E5]/20 px-6 py-6 space-y-4">
          <div className="text-xs font-mono text-[#F2B705] flex items-center space-x-2">
            <Flame className="w-3.5 h-3.5" />
            <span>GRIDDLE HOT • DXB {dubaiTime}</span>
          </div>
          <div className="flex flex-col space-y-3 font-['Barlow_Condensed'] text-2xl uppercase tracking-wider">
            <button 
              onClick={() => scrollToSection('build')}
              className="text-left py-1 text-[#FFF6E5] hover:text-[#F2B705]"
            >
              01. The Build (30-Frame Explosion)
            </button>
            <button 
              onClick={() => scrollToSection('griddle')}
              className="text-left py-1 text-[#FFF6E5] hover:text-[#F2B705]"
            >
              02. The Griddle & Heat
            </button>
            <button 
              onClick={() => scrollToSection('menu')}
              className="text-left py-1 text-[#FFF6E5] hover:text-[#F2B705]"
            >
              03. The Street Menu
            </button>
            <button 
              onClick={() => scrollToSection('numbers')}
              className="text-left py-1 text-[#FFF6E5] hover:text-[#F2B705]"
            >
              04. The Numbers
            </button>
            <button 
              onClick={() => scrollToSection('findus')}
              className="text-left py-1 text-[#FFF6E5] hover:text-[#F2B705]"
            >
              05. Location & Hours
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
