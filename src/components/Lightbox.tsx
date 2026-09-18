import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Heart } from 'lucide-react';
import { MemoryItem } from '../types';

interface LightboxProps {
  memory: MemoryItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ memory, onClose, onPrev, onNext }) => {
  useEffect(() => {
    if (!memory) return;

    // Subtle elegant romantic confetti burst when opening memory
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#FF7EB6', '#FFB6D9', '#A78BFA', '#FFF7FB'],
      disableForReducedMotion: true,
      scalar: 0.8,
      ticks: 120,
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [memory, onClose, onPrev, onNext]);

  if (!memory) return null;

  return (
    <div
      id="romantic-lightbox"
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#08090D]/90 backdrop-blur-2xl animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Floating subtle ambient lights */}
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-[#FF7EB6]/15 blur-[120px]" />
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-[#A78BFA]/15 blur-[120px] translate-x-32 translate-y-32" />

      {/* Main Lightbox Modal */}
      <div
        className="relative z-10 flex flex-col max-w-4xl w-full max-h-[92vh] overflow-hidden rounded-2xl glass-card border border-white/10 shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          data-cursor="pointer"
          aria-label="Close Lightbox"
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 text-white/90 hover:text-white hover:bg-black/90 transition-all cursor-pointer backdrop-blur-md border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Container with Nav Chevrons */}
        <div className="relative w-full flex-1 max-h-[60vh] sm:max-h-[65vh] bg-black/50 overflow-hidden flex items-center justify-center group">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-contain max-h-[65vh] transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            data-cursor="pointer"
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all cursor-pointer backdrop-blur-md border border-white/10 opacity-80 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            data-cursor="pointer"
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all cursor-pointer backdrop-blur-md border border-white/10 opacity-80 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Caption & Memory Meta */}
        <div className="p-5 sm:p-7 bg-[#0E1017]/90 border-t border-white/10 flex flex-col space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#FF7EB6] uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-[#FF7EB6]" />
              <span>One of my favorite memories</span>
            </span>

            <div className="flex items-center space-x-4 text-xs text-[#FFF7FB]/60">
              {memory.date && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FFB6D9]" />
                  <span>{memory.date}</span>
                </span>
              )}
              {memory.location && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>{memory.location}</span>
                </span>
              )}
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF7FB] font-normal">
            {memory.title}
          </h3>

          <p className="font-sans text-sm sm:text-base text-[#FFF7FB]/80 leading-relaxed font-light">
            {memory.description}
          </p>
        </div>
      </div>
    </div>
  );
};
