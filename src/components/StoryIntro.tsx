import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { SiteConfig } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface StoryIntroProps {
  config: SiteConfig;
}

export const StoryIntro: React.FC<StoryIntroProps> = ({ config }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal first sentence
      gsap.fromTo(
        text1Ref.current,
        { opacity: 0, y: 50, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          scrollTrigger: {
            trigger: text1Ref.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );

      // Reveal second sentence with glow
      gsap.fromTo(
        text2Ref.current,
        { opacity: 0, y: 60, scale: 0.95, filter: 'blur(12px)' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.4,
          scrollTrigger: {
            trigger: text2Ref.current,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );

      // Glow expanding
      gsap.fromTo(
        glowRef.current,
        { scale: 0.6, opacity: 0.2 },
        {
          scale: 1.3,
          opacity: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story-intro"
      className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#08090D] px-6 py-28 text-center"
    >
      {/* Dynamic ambient background glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[450px] w-[450px] rounded-full bg-[#A78BFA]/15 blur-[120px] transition-all duration-700"
      />
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-[#FF7EB6]/15 blur-[90px] -translate-y-16" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-10">
        <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#FF7EB6] uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chapter I • The Beginning</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* First sentence */}
        <h2
          ref={text1Ref}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#FFF7FB]/85 leading-snug tracking-tight"
        >
          {config.storyIntroPart1}
        </h2>

        {/* Decorative divider */}
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#FF7EB6]/60 to-transparent" />

        {/* Second sentence with highlighted romantic glow */}
        <h2
          ref={text2Ref}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#FFF7FB] leading-tight tracking-tight"
        >
          ...and somehow make{' '}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#FF7EB6] via-[#FFB6D9] to-[#A78BFA] text-glow-pink">
            ordinary moments
          </span>{' '}
          unforgettable.
        </h2>
      </div>
    </section>
  );
};
