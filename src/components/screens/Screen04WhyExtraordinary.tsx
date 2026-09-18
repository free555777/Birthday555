import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, HandHeart, Music, Coffee, Flame, ArrowRight, ArrowLeft } from 'lucide-react';
import { SiteConfig, ExtraordinaryReason } from '../../types';

interface Screen04WhyExtraordinaryProps {
  config: SiteConfig;
  onNext: () => void;
  onPrev: () => void;
}

export const Screen04WhyExtraordinary: React.FC<Screen04WhyExtraordinaryProps> = ({ config, onNext, onPrev }) => {
  const [activeReason, setActiveReason] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#E83D6F]" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-[#F45B82] fill-[#F45B82]" />;
      case 'HandHeart':
        return <HandHeart className="w-5 h-5 text-[#C93B61]" />;
      case 'Music':
        return <Music className="w-5 h-5 text-[#E83D6F]" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#D9A441]" />;
      case 'Flame':
      default:
        return <Flame className="w-5 h-5 text-[#F45B82]" />;
    }
  };

  const reasons = config.reasons && config.reasons.length > 0 ? config.reasons.slice(0, 6) : [];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-9 overflow-hidden select-none bg-gradient-to-b from-[#FFF0F2] via-[#FFF8F5] to-[#FFE7EC]">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute top-1/3 -left-16 w-64 h-64 rounded-full bg-[#FFD5DD]/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-16 w-72 h-72 rounded-full bg-[#FFE3E8]/50 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-4xl mx-auto pt-1">
        <button
          onClick={onPrev}
          className="btn-romantic-secondary px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1.5 cursor-pointer"
          data-cursor="pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#E83D6F] uppercase block">
            A Few Precious Truths
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#6D3046] font-semibold">
            Why You Are Extraordinary
          </h2>
        </div>

        <div className="inline-flex items-center space-x-1 text-xs text-[#9B6577] font-medium">
          <Heart className="w-3.5 h-3.5 text-[#F45B82] fill-[#F45B82]" />
          <span>6 Reasons</span>
        </div>
      </div>

      {/* Bento Grid - Designed to fit seamlessly inside viewport without overall page scroll */}
      <div className="relative z-10 my-auto w-full max-w-4xl mx-auto py-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5 max-h-[58vh] sm:max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
          {reasons.map((reason, index) => {
            const isExpanded = activeReason === reason.id;
            return (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                onClick={() => setActiveReason(isExpanded ? null : reason.id)}
                className={`card-romantic rounded-2xl p-3.5 sm:p-4.5 border border-[#FFD5DD] transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isExpanded
                    ? 'ring-2 ring-[#E83D6F] bg-white shadow-lg scale-[1.02]'
                    : 'hover:border-[#F45B82]/70 hover:shadow-md'
                }`}
                data-cursor="pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFF0F2] border border-[#FFD5DD] flex items-center justify-center">
                      {getIcon(reason.iconName)}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold font-sans text-[#E83D6F]/70 px-2 py-0.5 rounded-full bg-[#FFE3E8]/50">
                      {reason.number}
                    </span>
                  </div>

                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#6D3046] leading-snug">
                    {reason.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-[#E83D6F] font-medium mt-0.5">
                    {reason.subtitle}
                  </p>
                </div>

                <p className="text-[11px] sm:text-xs text-[#9B6577] mt-2 line-clamp-3 leading-relaxed font-serif">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between pb-2">
        <span className="text-[11px] sm:text-xs text-[#9B6577] italic">
          Tap any card to highlight ♡
        </span>

        <button
          onClick={onNext}
          className="group btn-romantic-primary py-3 px-7 rounded-full text-sm sm:text-base font-medium flex items-center space-x-2.5 cursor-pointer shadow-md"
          data-cursor="pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
