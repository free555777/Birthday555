import React from 'react';
import { Heart } from 'lucide-react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
  onReplay: () => void;
  onOpenSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onReplay, onOpenSettings }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full py-12 border-t border-white/10 bg-[#08090D] text-[#FFF7FB]/60 text-xs select-none">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Made with love */}
        <div className="flex items-center space-x-2">
          <span>Made with love for {config.partnerName}</span>
          <Heart className="w-3.5 h-3.5 text-[#FF7EB6] fill-[#FF7EB6]" />
          <span>• © {new Date().getFullYear()} Our Story</span>
        </div>

        {/* Center / Right Links */}
        <div className="flex items-center space-x-6 text-xs tracking-wider">
          <button
            onClick={() => scrollToSection('love-letters-section')}
            data-cursor="pointer"
            className="hover:text-[#FFF7FB] transition-colors cursor-pointer text-[#FFB6D9]"
          >
            Love Letters 💌
          </button>

          <button
            onClick={() => scrollToSection('candle-section')}
            data-cursor="pointer"
            className="hover:text-[#FFF7FB] transition-colors cursor-pointer"
          >
            Birthday Cake & Wish
          </button>

          <button
            onClick={() => scrollToSection('cosmic-orbit')}
            data-cursor="pointer"
            className="hover:text-[#FFF7FB] transition-colors cursor-pointer"
          >
            Our Constellation
          </button>

          <button
            onClick={onReplay}
            data-cursor="pointer"
            className="text-[#FF7EB6] hover:text-[#FFB6D9] transition-colors cursor-pointer"
          >
            Replay
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              data-cursor="pointer"
              className="text-[#A78BFA] hover:text-[#C4B5FD] transition-colors cursor-pointer border-b border-[#A78BFA]/40 pb-0.5"
            >
              Personalize ✨
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
