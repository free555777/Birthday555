import React, { useState } from 'react';
import { Sparkles, Camera } from 'lucide-react';
import { MemoryItem } from '../types';
import { Lightbox } from './Lightbox';

interface MarqueeGalleryProps {
  memories: MemoryItem[];
}

export const MarqueeGallery: React.FC<MarqueeGalleryProps> = ({ memories }) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Divide into 3 distinct offsets (1 set per block, seamless loop)
  const row1 = memories;
  const row2 = [...memories.slice(3), ...memories.slice(0, 3)];
  const row3 = [...memories.slice(6), ...memories.slice(0, 6)];

  const handleOpenImage = (memory: MemoryItem) => {
    const idx = memories.findIndex((m) => m.id === memory.id);
    setSelectedIndex(idx !== -1 ? idx : 0);
    setSelectedMemory(memory);
  };

  const handlePrev = () => {
    const nextIdx = (selectedIndex - 1 + memories.length) % memories.length;
    setSelectedIndex(nextIdx);
    setSelectedMemory(memories[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % memories.length;
    setSelectedIndex(nextIdx);
    setSelectedMemory(memories[nextIdx]);
  };

  return (
    <section
      id="marquee-gallery"
      className="relative w-full py-24 bg-[#08090D] overflow-hidden select-none"
    >
      {/* Section Header */}
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-[#FF7EB6] uppercase mb-3">
          <Camera className="w-3.5 h-3.5" />
          <span>Moments In Time</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#FFF7FB] tracking-tight mb-4">
          A Gallery of Forever
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#FFF7FB]/65 max-w-lg mx-auto font-light">
          Every photo carries a whisper of a day I never want to forget. Click any memory to step back in.
        </p>
      </div>

      {/* Marquee Rows Container */}
      <div className="relative flex flex-col space-y-6 sm:space-y-8">
        {/* Soft edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#08090D] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#08090D] to-transparent z-20" />

        {/* Row 1: Left */}
        <div className="group flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee space-x-5 sm:space-x-7 group-hover:[animation-play-state:paused]">
            {row1.map((item, idx) => (
              <PhotoCard
                key={`r1-${item.id}-${idx}`}
                item={item}
                onClick={() => handleOpenImage(item)}
              />
            ))}
          </div>
          <div className="flex shrink-0 animate-marquee space-x-5 sm:space-x-7 group-hover:[animation-play-state:paused]" aria-hidden="true">
            {row1.map((item, idx) => (
              <PhotoCard
                key={`r1-dup-${item.id}-${idx}`}
                item={item}
                onClick={() => handleOpenImage(item)}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Right */}
        <div className="group flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee-reverse space-x-5 sm:space-x-7 group-hover:[animation-play-state:paused]">
            {row2.map((item, idx) => (
              <PhotoCard
                key={`r2-${item.id}-${idx}`}
                item={item}
                onClick={() => handleOpenImage(item)}
              />
            ))}
          </div>
          <div className="flex shrink-0 animate-marquee-reverse space-x-5 sm:space-x-7 group-hover:[animation-play-state:paused]" aria-hidden="true">
            {row2.map((item, idx) => (
              <PhotoCard
                key={`r2-dup-${item.id}-${idx}`}
                item={item}
                onClick={() => handleOpenImage(item)}
              />
            ))}
          </div>
        </div>

        {/* Row 3: Left */}
        <div className="group flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee space-x-5 sm:space-x-7 group-hover:[animation-play-state:paused]">
            {row3.map((item, idx) => (
              <PhotoCard
                key={`r3-${item.id}-${idx}`}
                item={item}
                onClick={() => handleOpenImage(item)}
              />
            ))}
          </div>
          <div className="flex shrink-0 animate-marquee space-x-5 sm:space-x-7 group-hover:[animation-play-state:paused]" aria-hidden="true">
            {row3.map((item, idx) => (
              <PhotoCard
                key={`r3-dup-${item.id}-${idx}`}
                item={item}
                onClick={() => handleOpenImage(item)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
};

interface PhotoCardProps {
  item: MemoryItem;
  onClick: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      data-cursor="view"
      className="group/card relative w-64 sm:w-76 md:w-84 aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#FF7EB6]/60 hover:shadow-[0_15px_35px_rgba(255,126,182,0.25)] cursor-pointer transform-gpu"
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-110 will-change-transform"
      />

      {/* Glass overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090D]/90 via-black/25 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        {item.tag && (
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FF7EB6]/30 border border-[#FF7EB6]/50 text-[10px] font-mono tracking-wider text-[#FFF7FB] w-fit mb-1">
            {item.tag}
          </span>
        )}
        <h4 className="font-serif text-base sm:text-lg font-medium text-[#FFF7FB] leading-snug">
          {item.title}
        </h4>
        <p className="text-xs text-[#FFF7FB]/70 line-clamp-1">{item.date}</p>
      </div>
    </div>
  );
};
