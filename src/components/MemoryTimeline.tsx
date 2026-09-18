import React, { useRef } from 'react';
import { Sparkles, Calendar, MapPin, Milestone, ChevronRight } from 'lucide-react';
import { TimelineMilestone } from '../types';

interface MemoryTimelineProps {
  milestones: TimelineMilestone[];
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ milestones }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="memory-timeline-section"
      className="relative w-full py-28 bg-[#08090D] overflow-hidden px-6 select-none"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#A78BFA]/10 blur-[150px]" />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-[#A78BFA] uppercase mb-3">
          <Milestone className="w-3.5 h-3.5" />
          <span>Our Journey Through Time</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#FFF7FB] tracking-tight mb-4">
          The Chapters of Us
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#FFF7FB]/65 max-w-lg mx-auto font-light">
          From the very first greeting to this exact birthday, each year has been the best year because you were in it.
        </p>
      </div>

      {/* DESKTOP: Horizontal Timeline Carousel */}
      <div className="hidden md:block max-w-7xl mx-auto relative">
        {/* Next Arrow Hint */}
        <button
          onClick={scrollRight}
          data-cursor="pointer"
          aria-label="Scroll timeline forward"
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[#0E1017] border border-white/20 text-[#FF7EB6] hover:bg-white/10 transition-all shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Horizontal Scroll track */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-8 overflow-x-auto pb-8 pt-4 px-4 no-scrollbar scroll-smooth"
        >
          {milestones.map((item, idx) => (
            <div
              key={item.year}
              data-cursor="pointer"
              className="group relative flex-shrink-0 w-84 rounded-3xl glass-card border border-white/10 hover:border-[#FF7EB6]/50 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,126,182,0.15)] flex flex-col justify-between cursor-pointer"
            >
              {/* Year badge & milestone number */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF7EB6] to-[#A78BFA]">
                  {item.year}
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#FFF7FB]/50">
                  Chapter 0{idx + 1}
                </span>
              </div>

              {/* Photo */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-black/40">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2.5 left-3 flex items-center space-x-1 text-[11px] text-white/90 font-mono">
                  <MapPin className="w-3 h-3 text-[#FF7EB6]" />
                  <span>{item.location}</span>
                </div>
              </div>

              {/* Text */}
              <div>
                <span className="text-xs font-mono text-[#FFB6D9] block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="font-serif text-xl font-medium text-[#FFF7FB] mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-[#FFF7FB]/70 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Date foot */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center space-x-1.5 text-[11px] text-[#FFF7FB]/50 font-mono">
                <Calendar className="w-3 h-3 text-[#A78BFA]" />
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE: Vertical Stacked Timeline */}
      <div className="md:hidden max-w-lg mx-auto relative pl-6 border-l border-white/15 space-y-10">
        {milestones.map((item, idx) => (
          <div key={item.year} className="relative group">
            {/* Timeline Dot Node */}
            <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-[#08090D] border-2 border-[#FF7EB6] shadow-[0_0_10px_#FF7EB6] flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-[#FFB6D9]" />
            </div>

            {/* Card Content */}
            <div className="p-5 rounded-2xl glass-card border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-2xl font-bold text-[#FF7EB6]">
                  {item.year}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                  {item.date}
                </span>
              </div>

              <div className="w-full h-36 rounded-xl overflow-hidden mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="font-serif text-lg font-medium text-[#FFF7FB] mb-1">
                {item.title}
              </h4>
              <p className="font-sans text-xs text-[#FFF7FB]/70 font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
