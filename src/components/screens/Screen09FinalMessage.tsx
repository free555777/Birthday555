import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, RotateCcw, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteConfig } from '../../types';

interface Screen09FinalMessageProps {
  config: SiteConfig;
  onReplay: () => void;
  onPrev: () => void;
}

export const Screen09FinalMessage: React.FC<Screen09FinalMessageProps> = ({ config, onReplay, onPrev }) => {
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Cinematic timed sequence
    const timer1 = setTimeout(() => {
      setShowSecondLine(true);
      // Gentle celebratory confetti
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#F45B82', '#E83D6F', '#FFD5DD', '#D9A441'],
      });
    }, 1800);

    const timer2 = setTimeout(() => {
      setShowButton(true);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-hidden select-none bg-gradient-to-b from-[#FFF4F1] via-[#FFE0E6] to-[#FFF0F2]">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#FFD5DD]/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FFE3E8]/60 blur-3xl" />

      {/* Floating Gentle Petals & Stars */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#F45B82]/20"
            style={{
              top: `${(i * 22 + 10) % 85}%`,
              left: `${(i * 29 + 12) % 86}%`,
            }}
            animate={{
              y: [0, -12, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-4 h-4 text-[#E83D6F]" />
          </motion.div>
        ))}
      </div>

      {/* Screen Header */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-2xl mx-auto pt-1">
        <button
          onClick={onPrev}
          className="btn-romantic-secondary px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1.5 cursor-pointer"
          data-cursor="pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="inline-flex items-center space-x-1.5 text-xs text-[#E83D6F] font-semibold tracking-widest uppercase">
          <Heart className="w-3.5 h-3.5 fill-[#F45B82] text-[#F45B82]" />
          <span>Our Infinity</span>
        </div>
      </div>

      {/* Center Cinematic Typography */}
      <div className="relative z-10 my-auto w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center px-4">
        {/* Central Beating Heart Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150, delay: 0.2 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mb-6 rounded-full bg-white border border-[#FFD5DD] shadow-lg flex items-center justify-center text-[#E83D6F]"
        >
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-[#F45B82] text-[#F45B82] animate-heart-pulse" />
        </motion.div>

        {/* First Line */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#6D3046] font-normal tracking-tight leading-tight"
        >
          "And if I had to choose again..."
        </motion.h2>

        {/* Second Line (Sequenced Reveal) */}
        {showSecondLine && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="mt-4 sm:mt-6"
          >
            <span className="font-handwriting text-3xl sm:text-5xl md:text-6xl text-[#E83D6F] font-bold block">
              I'd still choose you. ♡
            </span>

            <p className="font-serif text-sm sm:text-base text-[#9B6577] mt-4 max-w-md mx-auto leading-relaxed">
              Every lifetime, in every world, without hesitation. Happy Birthday, {config.partnerName || 'My Love'}.
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Replay Action */}
      <div className="relative z-10 w-full max-w-xs mx-auto flex items-center justify-center pb-4">
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={onReplay}
            className="w-full group btn-romantic-primary py-4 px-8 rounded-full text-sm sm:text-base font-medium flex items-center justify-center space-x-2.5 cursor-pointer shadow-xl"
            data-cursor="pointer"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-180" />
            <span>REPLAY OUR STORY</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
