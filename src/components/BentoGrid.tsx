import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  HandHeart,
  Music,
  Coffee,
  Flame,
  Star,
  LucideIcon,
} from 'lucide-react';
import { ExtraordinaryReason } from '../types';

interface BentoGridProps {
  reasons: ExtraordinaryReason[];
}

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Heart,
  HandHeart,
  Music,
  Coffee,
  Flame,
  Star,
};

export const BentoGrid: React.FC<BentoGridProps> = ({ reasons }) => {
  return (
    <section
      id="bento-grid-section"
      className="relative w-full py-28 bg-[#08090D] overflow-hidden px-6 select-none"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-[#FF7EB6]/10 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-[#A78BFA]/10 blur-[150px]" />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-[#FF7EB6] uppercase mb-3">
          <Star className="w-3.5 h-3.5" />
          <span>Infinite Qualities</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#FFF7FB] tracking-tight mb-4">
          Why You Are Extraordinary
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#FFF7FB]/65 max-w-lg mx-auto font-light">
          Just a few of the million reasons why loving you is the easiest thing I’ve ever done.
        </p>
      </div>

      {/* Bento Grid Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {reasons.map((reason, idx) => {
          // Asymmetric bento span for visual elegance
          const isWide = idx === 0 || idx === 5;
          return (
            <BentoCard
              key={reason.id}
              reason={reason}
              className={isWide ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}
            />
          );
        })}
      </div>
    </section>
  );
};

interface BentoCardProps {
  reason: ExtraordinaryReason;
  className?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ reason, className = '' }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const Icon = iconMap[reason.iconName] || Heart;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable heavy tilt on small/touch screens
    if (window.innerWidth < 1024) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ x: rotateX, y: rotateY });
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="pointer"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${
          isHovered ? -4 : 0
        }px)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className={`group relative p-7 sm:p-8 rounded-3xl glass-card border border-white/10 hover:border-[#FF7EB6]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer ${className}`}
    >
      {/* Dynamic cursor-following radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 280px at ${glowPos.x}% ${glowPos.y}%, rgba(255,126,182,0.18), transparent 70%)`,
        }}
      />

      {/* Top row: Number and floating icon */}
      <div className="flex items-center justify-between mb-8 z-10">
        <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#FF7EB6]">
          {reason.number}
        </span>

        <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 text-[#FFB6D9] group-hover:text-white group-hover:scale-110 group-hover:border-[#FF7EB6]/50 transition-all duration-300 shadow-md">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Content */}
      <div className="z-10 mt-auto">
        <span className="text-xs font-mono tracking-wider text-[#A78BFA] uppercase block mb-1.5">
          {reason.subtitle}
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FFF7FB] mb-3 leading-snug">
          {reason.title}
        </h3>
        <p className="font-sans text-sm sm:text-base text-[#FFF7FB]/70 font-light leading-relaxed">
          {reason.description}
        </p>
      </div>

      {/* Bottom subtle accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF7EB6]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};
