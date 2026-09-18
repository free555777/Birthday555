import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Heart } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 12;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setPercent(100);

        // Sequence exit transition
        const tl = gsap.timeline({
          onComplete: () => {
            onComplete();
          },
        });

        tl.to(heartRef.current, {
          scale: 1.4,
          duration: 0.25,
          ease: 'power2.out',
        })
          .to(flashRef.current, {
            opacity: 0.7,
            duration: 0.15,
            ease: 'power2.in',
          }, '-=0.1')
          .to(textRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.2,
          }, '-=0.1')
          .to(containerRef.current, {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.inOut',
          });
      } else {
        setPercent(current);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      id="preloader"
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#08090D] select-none"
    >
      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 bg-[#FF7EB6] opacity-0 mix-blend-screen"
      />

      {/* Ambient background particles/glow */}
      <div className="absolute h-96 w-96 rounded-full bg-[#FF7EB6]/10 blur-[120px]" />
      <div className="absolute h-72 w-72 rounded-full bg-[#A78BFA]/10 blur-[100px]" />

      {/* Center glowing heart animation */}
      <div ref={heartRef} className="relative mb-8 flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full bg-[#FF7EB6]/30 blur-2xl animate-pulse" />
        <Heart
          className="relative h-14 w-14 text-[#FF7EB6] drop-shadow-[0_0_20px_rgba(255,126,182,0.8)] fill-[#FF7EB6]/20 transition-transform duration-300"
          strokeWidth={1.5}
        />
        {/* Orbiting micro dot */}
        <div className="absolute h-2 w-2 rounded-full bg-[#FFB6D9] shadow-[0_0_8px_#FFB6D9] animate-spin" style={{ width: '48px', height: '48px' }} />
      </div>

      {/* Text and Percentage */}
      <div ref={textRef} className="flex flex-col items-center space-y-3">
        <p className="font-serif text-lg md:text-xl tracking-wide text-[#FFF7FB]/90 italic">
          Loading our story...
        </p>

        <div className="flex items-center space-x-3">
          <div className="w-36 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#A78BFA] via-[#FF7EB6] to-[#FFB6D9] transition-all duration-75 ease-out rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="font-mono text-xs text-[#FFB6D9] min-w-[3ch]">
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
};
