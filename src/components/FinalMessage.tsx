import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import { SiteConfig } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface FinalMessageProps {
  config: SiteConfig;
  onReplay: () => void;
}

export const FinalMessage: React.FC<FinalMessageProps> = ({ config, onReplay }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // First line reveal
      gsap.fromTo(
        line1Ref.current,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          scrollTrigger: {
            trigger: line1Ref.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );

      // Second line reveal with glow
      gsap.fromTo(
        line2Ref.current,
        { opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          scrollTrigger: {
            trigger: line2Ref.current,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );

      // Heart pulse
      gsap.fromTo(
        heartRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: heartRef.current,
            start: 'top 85%',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="final-message-section"
      className="relative min-h-[90vh] w-full flex flex-col items-center justify-center bg-[#08090D] overflow-hidden px-6 py-28 text-center select-none"
    >
      {/* Soft romantic backdrop lighting */}
      <div className="pointer-events-none absolute h-[600px] w-[600px] rounded-full bg-[#FF7EB6]/10 blur-[160px]" />
      <div className="pointer-events-none absolute h-[400px] w-[400px] rounded-full bg-[#A78BFA]/10 blur-[130px] translate-y-24" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-10">
        <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-[#FF7EB6] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Vow</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* First text line */}
        <h3
          ref={line1Ref}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#FFF7FB]/80 tracking-tight"
        >
          {config.finalQuote || 'And if I had to choose again...'}
        </h3>

        {/* Second text line */}
        <h2
          ref={line2Ref}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FF7EB6] via-[#FFB6D9] to-[#FFF7FB] tracking-tight text-glow-pink"
        >
          {config.finalSubquote || "I'd still choose you."}
        </h2>

        {/* Glowing Heart Icon */}
        <div ref={heartRef} className="relative py-4 flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-[#FF7EB6]/30 blur-2xl animate-pulse" />
          <Heart className="relative h-12 w-12 text-[#FF7EB6] fill-[#FF7EB6]/30 animate-heart-pulse drop-shadow-[0_0_20px_rgba(255,126,182,0.8)]" />
        </div>

        {/* Bottom Subtitle */}
        <p className="font-sans text-sm sm:text-base text-[#FFF7FB]/65 max-w-md font-light tracking-wide">
          Forever starts with another memory. Happy Birthday, {config.partnerName}.
        </p>

        {/* Replay CTA */}
        <button
          onClick={onReplay}
          data-cursor="pointer"
          className="group inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-white/[0.06] hover:bg-[#FF7EB6] hover:text-[#08090D] text-[#FFF7FB] border border-white/15 hover:border-[#FF7EB6] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,126,182,0.5)] cursor-pointer text-sm font-medium tracking-wider uppercase"
        >
          <span>Replay Our Story ↗</span>
          <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </section>
  );
};
