import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Heart, Sparkles, MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteConfig, MemoryItem } from '../../types';

interface Screen03MomentsProps {
  config: SiteConfig;
  onNext: () => void;
  onPrev: () => void;
}

export const Screen03Moments: React.FC<Screen03MomentsProps> = ({ config, onNext, onPrev }) => {
  const memories = config.memories && config.memories.length > 0 ? config.memories : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryItem | null>(null);

  const handlePrevCard = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : memories.length - 1));
  };

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev < memories.length - 1 ? prev + 1 : 0));
  };

  const handleOpenLightbox = (photo: MemoryItem) => {
    setSelectedPhoto(photo);
    // Subtle heart/sparkle confetti
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F45B82', '#E83D6F', '#FFD5DD', '#FFF8F5']
    });
  };

  if (memories.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl text-[#6D3046]">Our Moments</h2>
        <button onClick={onNext} className="mt-4 btn-romantic-primary px-6 py-2 rounded-full">
          Continue
        </button>
      </div>
    );
  }

  const activeMemory = memories[currentIndex];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-8 md:p-10 overflow-hidden select-none bg-gradient-to-b from-[#FFF0F2] via-[#FFF8F5] to-[#FFE7EC]">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute top-10 left-10 w-72 h-72 rounded-full bg-[#FFE3E8]/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#FFD5DD]/40 blur-3xl" />

      {/* Screen Header */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-4xl mx-auto pt-2">
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
            Memory Lane
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#6D3046] font-semibold">
            Our Precious Moments
          </h2>
        </div>

        <div className="text-xs text-[#9B6577] font-medium tracking-wide">
          {currentIndex + 1} / {memories.length}
        </div>
      </div>

      {/* Main Carousel Area */}
      <div className="relative z-10 my-auto w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-2">
        <div className="relative w-full flex items-center justify-center h-[52vh] sm:h-[55vh] max-h-[480px]">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevCard}
            className="absolute left-1 sm:left-4 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#FFD5DD] shadow-md flex items-center justify-center text-[#6D3046] hover:text-[#E83D6F] hover:scale-105 transition-all cursor-pointer"
            aria-label="Previous photo"
            data-cursor="pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNextCard}
            className="absolute right-1 sm:right-4 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#FFD5DD] shadow-md flex items-center justify-center text-[#6D3046] hover:text-[#E83D6F] hover:scale-105 transition-all cursor-pointer"
            aria-label="Next photo"
            data-cursor="pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Display with 3D Depth */}
          <div className="relative w-full max-w-sm sm:max-w-md h-full flex items-center justify-center">
            {/* Previous Card Peek */}
            {memories.length > 1 && (
              <div
                onClick={handlePrevCard}
                className="absolute left-[-22%] sm:left-[-28%] w-[68%] h-[82%] rounded-2xl overflow-hidden shadow-lg border border-[#FFD5DD]/70 opacity-40 scale-90 blur-[1px] transition-all duration-300 cursor-pointer hidden xs:block"
              >
                <img
                  src={memories[(currentIndex - 1 + memories.length) % memories.length].imageUrl}
                  alt="Previous memory"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Active Center Card */}
            <motion.div
              key={activeMemory.id}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => handleOpenLightbox(activeMemory)}
              className="card-romantic rounded-3xl overflow-hidden shadow-xl border-2 border-white w-full h-full flex flex-col cursor-pointer group"
              data-cursor="view"
            >
              <div className="relative flex-1 overflow-hidden">
                <img
                  src={activeMemory.imageUrl}
                  alt={activeMemory.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Tap to expand hint */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-[#FFB6D9]" />
                  <span>Tap to view</span>
                </div>

                {activeMemory.tag && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#C93B61] text-[11px] font-semibold tracking-wide">
                    {activeMemory.tag}
                  </div>
                )}
              </div>

              {/* Card Footer Info */}
              <div className="p-3.5 sm:p-4 bg-white/95 border-t border-[#FFD5DD]/50">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#6D3046] truncate">
                  {activeMemory.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-[#9B6577] mt-1">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-[#E83D6F]" />
                    <span>{activeMemory.date}</span>
                  </span>
                  {activeMemory.location && (
                    <span className="flex items-center space-x-1 truncate max-w-[120px]">
                      <MapPin className="w-3 h-3 text-[#E83D6F]" />
                      <span>{activeMemory.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Next Card Peek */}
            {memories.length > 1 && (
              <div
                onClick={handleNextCard}
                className="absolute right-[-22%] sm:right-[-28%] w-[68%] h-[82%] rounded-2xl overflow-hidden shadow-lg border border-[#FFD5DD]/70 opacity-40 scale-90 blur-[1px] transition-all duration-300 cursor-pointer hidden xs:block"
              >
                <img
                  src={memories[(currentIndex + 1) % memories.length].imageUrl}
                  alt="Next memory"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center space-x-1.5 mt-3">
          {memories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 bg-[#E83D6F]' : 'w-1.5 bg-[#FFD5DD]'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-end pb-3">
        <button
          onClick={onNext}
          className="group btn-romantic-primary py-3 px-7 rounded-full text-sm sm:text-base font-medium flex items-center space-x-2.5 cursor-pointer shadow-md"
          data-cursor="pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FFF0F2]/90 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="card-romantic rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col border-2 border-white shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md text-[#6D3046] hover:text-[#E83D6F] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative max-h-[55vh] overflow-hidden bg-black/5">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain max-h-[55vh]"
                />
              </div>

              <div className="p-6 bg-white flex flex-col space-y-2">
                <div className="flex items-center space-x-2 text-xs text-[#E83D6F] font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedPhoto.date}</span>
                  {selectedPhoto.location && (
                    <>
                      <span>•</span>
                      <span>{selectedPhoto.location}</span>
                    </>
                  )}
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#6D3046]">
                  {selectedPhoto.title}
                </h3>

                <p className="text-sm text-[#9B6577] font-serif leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
