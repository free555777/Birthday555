import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Calendar, MapPin, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { SiteConfig } from '../../types';

interface Screen08TimelineProps {
  config: SiteConfig;
  onNext: () => void;
  onPrev: () => void;
}

export const Screen08Timeline: React.FC<Screen08TimelineProps> = ({ config, onNext, onPrev }) => {
  const milestones = config.timeline && config.timeline.length > 0 ? config.timeline : [];
  const [activeStep, setActiveStep] = useState(0);

  const handlePrevStep = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : milestones.length - 1));
  };

  const handleNextStep = () => {
    setActiveStep((prev) => (prev < milestones.length - 1 ? prev + 1 : 0));
  };

  if (milestones.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl text-[#6D3046]">Secret Memories</h2>
        <button onClick={onNext} className="mt-4 btn-romantic-primary px-6 py-2 rounded-full">
          Continue
        </button>
      </div>
    );
  }

  const currentMilestone = milestones[activeStep];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-9 overflow-hidden select-none bg-gradient-to-b from-[#FFF0F2] via-[#FFF8F5] to-[#FFE7EC]">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute top-1/4 -left-16 w-80 h-80 rounded-full bg-[#FFE3E8]/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-16 w-80 h-80 rounded-full bg-[#FFD5DD]/40 blur-3xl" />

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

        <div className="text-center">
          <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#E83D6F] uppercase block">
            Chapter by Chapter
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#6D3046] font-semibold">
            Secret Memories Timeline
          </h2>
        </div>

        <div className="text-xs text-[#9B6577] font-medium">
          {activeStep + 1} / {milestones.length}
        </div>
      </div>

      {/* Year Selector Pills */}
      <div className="relative z-10 flex items-center justify-center space-x-1.5 sm:space-x-3 w-full max-w-xl mx-auto my-2">
        {milestones.map((item, index) => (
          <button
            key={item.year}
            onClick={() => setActiveStep(index)}
            className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
              index === activeStep
                ? 'bg-[#E83D6F] text-white shadow-md scale-105'
                : 'bg-white/80 text-[#6D3046] border border-[#FFD5DD] hover:border-[#F45B82]'
            }`}
          >
            {item.year}
          </button>
        ))}
      </div>

      {/* Center Interactive Timeline Card */}
      <div className="relative z-10 my-auto w-full max-w-lg mx-auto flex items-center justify-center py-1">
        <button
          onClick={handlePrevStep}
          className="absolute left-0 sm:-left-12 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 border border-[#FFD5DD] shadow-md flex items-center justify-center text-[#6D3046] hover:text-[#E83D6F] cursor-pointer"
          aria-label="Previous milestone"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNextStep}
          className="absolute right-0 sm:-right-12 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 border border-[#FFD5DD] shadow-md flex items-center justify-center text-[#6D3046] hover:text-[#E83D6F] cursor-pointer"
          aria-label="Next milestone"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMilestone.year}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="card-romantic rounded-3xl overflow-hidden border-2 border-white shadow-xl w-full max-h-[50vh] sm:max-h-[52vh] flex flex-col"
          >
            {/* Top Milestone Image (if available) */}
            {currentMilestone.imageUrl && (
              <div className="relative h-36 sm:h-44 overflow-hidden">
                <img
                  src={currentMilestone.imageUrl}
                  alt={currentMilestone.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#E83D6F] font-bold text-xs shadow-sm">
                  {currentMilestone.year}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="p-4 sm:p-6 bg-white/95 flex flex-col flex-1 justify-between overflow-y-auto no-scrollbar">
              <div>
                <div className="flex items-center space-x-2 text-xs text-[#E83D6F] font-semibold tracking-wide">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentMilestone.date}</span>
                  {currentMilestone.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{currentMilestone.location}</span>
                      </span>
                    </>
                  )}
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#6D3046] mt-1">
                  {currentMilestone.title}
                </h3>

                <p className="text-xs text-[#E83D6F] italic mt-0.5">
                  "{currentMilestone.subtitle}"
                </p>

                <p className="font-serif text-xs sm:text-sm text-[#9B6577] mt-2.5 leading-relaxed">
                  {currentMilestone.description}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-[#FFD5DD]/50 flex items-center justify-between text-[11px] text-[#9B6577]">
                <span>A cherished memory</span>
                <Heart className="w-3.5 h-3.5 text-[#F45B82] fill-[#F45B82]" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-between pb-2">
        <span className="text-[11px] sm:text-xs text-[#9B6577] italic">
          Swipe or tap arrows to navigate years ♡
        </span>

        <button
          onClick={onNext}
          className="group btn-romantic-primary py-3 px-7 rounded-full text-sm sm:text-base font-medium flex items-center space-x-2.5 cursor-pointer shadow-md"
          data-cursor="pointer"
        >
          <span>Continue to Finale</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
