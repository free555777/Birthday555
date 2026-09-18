import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { SiteConfig } from '../../types';

interface Screen01WelcomeProps {
  config: SiteConfig;
  onNext: () => void;
}

export const Screen01Welcome: React.FC<Screen01WelcomeProps> = ({ config, onNext }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-10 md:p-14 overflow-hidden select-none">
      {/* Soft Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[#FFD5DD]/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#FFE3E8]/60 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#FFF8F5]/80 blur-2xl" />

      {/* Decorative Floating Hearts & Petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#F45B82]/25"
            style={{
              top: `${(i * 21 + 8) % 88}%`,
              left: `${(i * 27 + 12) % 86}%`,
            }}
            animate={{
              y: [0, -12, 0],
              x: [0, (i % 2 === 0 ? 6 : -6), 0],
              rotate: [0, (i % 2 === 0 ? 8 : -8), 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 4 + (i % 3) * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          >
            <Heart
              style={{
                width: `${16 + (i % 3) * 10}px`,
                height: `${16 + (i % 3) * 10}px`,
                fill: 'currentColor',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 pt-2"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full pill-romantic text-xs sm:text-sm font-medium text-[#C93B61] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#F45B82] animate-pulse" />
          <span>A Special Birthday Celebration</span>
          <Heart className="w-3.5 h-3.5 text-[#F45B82] fill-[#F45B82]" />
        </div>
      </motion.div>

      {/* Center Typography (Editorial & Greeting Card Aesthetic) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto max-w-xl px-4">
        {/* Soft Floral Botanical Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150, delay: 0.2 }}
          className="w-14 h-14 sm:w-16 sm:h-16 mb-4 rounded-full bg-white/90 border border-[#FFD5DD] shadow-md flex items-center justify-center text-[#E83D6F]"
        >
          <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-[#F45B82] text-[#F45B82]" />
        </motion.div>

        {/* Large Elegant Serif "Happy Birthday" */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-[#6D3046] leading-[1.08] mb-2"
        >
          Happy<br />
          <span className="italic font-light text-[#E83D6F]">Birthday</span>
        </motion.h1>

        {/* Romantic Script Font */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-[#C93B61] mt-1 mb-3"
        >
          {config.partnerName ? `My Beautiful ${config.partnerName}` : 'My Beautiful Love'}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="font-sans text-sm sm:text-base text-[#9B6577] font-light tracking-wide max-w-sm mx-auto"
        >
          My favourite person ♡
        </motion.p>
      </div>

      {/* Bottom CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="relative z-10 w-full max-w-xs pb-4"
      >
        <button
          onClick={onNext}
          className="w-full group btn-romantic-primary py-4 px-8 rounded-full text-base font-medium tracking-wide flex items-center justify-center space-x-3 cursor-pointer"
          data-cursor="pointer"
        >
          <span>OPEN YOUR SURPRISE</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </button>
      </motion.div>
    </div>
  );
};
