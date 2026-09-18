import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Heart, Volume2, VolumeX, Sparkles, Menu, X, Settings } from 'lucide-react';
import { SiteConfig } from '../types';
import { audioEngine } from '../utils/audio';

import { Screen01Welcome } from './screens/Screen01Welcome';
import { Screen02LoveLetter } from './screens/Screen02LoveLetter';
import { Screen03Moments } from './screens/Screen03Moments';
import { Screen04WhyExtraordinary } from './screens/Screen04WhyExtraordinary';
import { Screen05Cosmic } from './screens/Screen05Cosmic';
import { Screen06MakeAWish } from './screens/Screen06MakeAWish';
import { Screen07OurSong } from './screens/Screen07OurSong';
import { Screen08Timeline } from './screens/Screen08Timeline';
import { Screen09FinalMessage } from './screens/Screen09FinalMessage';

interface AppShellProps {
  config: SiteConfig;
  onOpenSettings: () => void;
}

const SCREEN_SLUGS = [
  'welcome',
  'letter',
  'moments',
  'why-extraordinary',
  'cosmic',
  'wish',
  'song',
  'timeline',
  'finale'
];

const SCREEN_NAMES = [
  'Welcome',
  'Love Letter',
  'Our Moments',
  'Why Extraordinary',
  'Cosmic Orbit',
  'Make a Wish',
  'Our Song',
  'Secret Timeline',
  'Final Message'
];

export const AppShell: React.FC<AppShellProps> = ({ config, onOpenSettings }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const screenContainerRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  // Read initial screen from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const index = SCREEN_SLUGS.indexOf(hash);
    if (index >= 0) {
      setCurrentScreen(index);
    } else {
      window.history.replaceState(null, '', `#${SCREEN_SLUGS[0]}`);
    }

    // Handle browser Back / Forward buttons
    const handlePopState = () => {
      const currentHash = window.location.hash.replace('#', '');
      const targetIndex = SCREEN_SLUGS.indexOf(currentHash);
      if (targetIndex >= 0 && targetIndex !== currentScreen) {
        goToScreen(targetIndex, false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentScreen]);

  // Audio Engine subscription
  useEffect(() => {
    const unsub = audioEngine.subscribe((playing: boolean) => {
      setIsMuted(!playing);
    });
    return () => unsub();
  }, []);

  // GSAP Luxury iOS-Style Screen Transition
  const goToScreen = (targetIndex: number, updateHistory = true) => {
    if (targetIndex < 0 || targetIndex >= SCREEN_SLUGS.length) return;
    if (targetIndex === currentScreen || isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    const container = screenContainerRef.current;

    if (!container) {
      setCurrentScreen(targetIndex);
      if (updateHistory) {
        window.history.pushState(null, '', `#${SCREEN_SLUGS[targetIndex]}`);
      }
      isTransitioningRef.current = false;
      return;
    }

    const direction = targetIndex > currentScreen ? 1 : -1;

    // Outgoing animation
    gsap.to(container, {
      opacity: 0,
      scale: 0.96,
      filter: 'blur(4px)',
      y: -12 * direction,
      duration: 0.28,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentScreen(targetIndex);
        if (updateHistory) {
          window.history.pushState(null, '', `#${SCREEN_SLUGS[targetIndex]}`);
        }

        // Prepare incoming element position
        gsap.set(container, {
          opacity: 0,
          scale: 0.96,
          filter: 'blur(4px)',
          y: 16 * direction,
        });

        // Incoming animation
        gsap.to(container, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.42,
          ease: 'power3.out',
          onComplete: () => {
            isTransitioningRef.current = false;
          },
        });
      },
    });
  };

  const handleNext = () => {
    if (currentScreen < SCREEN_SLUGS.length - 1) {
      goToScreen(currentScreen + 1);
    }
  };

  const handlePrev = () => {
    if (currentScreen > 0) {
      goToScreen(currentScreen - 1);
    }
  };

  const handleReplay = () => {
    goToScreen(0);
  };

  const toggleSound = () => {
    audioEngine.togglePlay(config.musicUrl);
  };

  // Keyboard arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentScreen < SCREEN_SLUGS.length - 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentScreen > 0) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen]);

  // Touch swipe support on screen borders
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only horizontal swipe if not scrolling vertical content
    if (Math.abs(deltaX) > 75 && Math.abs(deltaX) > Math.abs(deltaY) * 1.6) {
      if (deltaX < 0 && currentScreen < SCREEN_SLUGS.length - 1) {
        handleNext();
      } else if (deltaX > 0 && currentScreen > 0) {
        handlePrev();
      }
    }
  };

  return (
    <div
      className="w-full h-full min-h-screen bg-[#FFF0F2] flex items-center justify-center overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer App Frame Container */}
      <div className="app-screen-container shadow-2xl relative bg-[#FFF0F2] border-x border-[#FFD5DD]/40 flex flex-col justify-between">
        
        {/* Minimal App Top Navigation Bar */}
        <header className="relative z-30 w-full px-4 sm:px-8 py-3 flex items-center justify-between border-b border-[#FFD5DD]/40 bg-white/60 backdrop-blur-md">
          {/* Top-Left App Brand */}
          <button
            onClick={() => goToScreen(0)}
            className="flex items-center space-x-2 text-[#6D3046] hover:text-[#E83D6F] transition-colors cursor-pointer"
            data-cursor="pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F45B82] to-[#E83D6F] flex items-center justify-center text-white shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-serif font-bold text-sm sm:text-base tracking-tight">
              Our Story
            </span>
          </button>

          {/* Center Screen Progress Indicator */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="hidden sm:flex items-center space-x-1.5">
              {SCREEN_SLUGS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToScreen(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentScreen
                      ? 'w-5 sm:w-6 bg-[#E83D6F]'
                      : 'w-1.5 bg-[#FFD5DD] hover:bg-[#F45B82]/50'
                  }`}
                  aria-label={`Go to ${SCREEN_NAMES[index]}`}
                />
              ))}
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-[#FFF0F2] border border-[#FFD5DD] text-[11px] font-sans font-semibold text-[#E83D6F]">
              {String(currentScreen + 1).padStart(2, '0')} / {String(SCREEN_SLUGS.length).padStart(2, '0')}
            </div>
          </div>

          {/* Top-Right Controls */}
          <div className="flex items-center space-x-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                !isMuted
                  ? 'bg-[#E83D6F] text-white border-[#E83D6F] shadow-sm'
                  : 'bg-white/80 text-[#6D3046] border-[#FFD5DD] hover:text-[#E83D6F]'
              }`}
              title={!isMuted ? 'Mute romantic soundtrack' : 'Play romantic soundtrack'}
              data-cursor="pointer"
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick Screen Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-full bg-white/80 text-[#6D3046] border border-[#FFD5DD] hover:text-[#E83D6F] transition-all cursor-pointer"
              title="Jump to screen"
              data-cursor="pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Personalize Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-white/80 text-[#6D3046] border border-[#FFD5DD] hover:text-[#E83D6F] transition-all cursor-pointer"
              title="Personalize text & details"
              data-cursor="pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Active Screen View Container (Transforms & Fades with GSAP) */}
        <main ref={screenContainerRef} className="flex-1 w-full h-full relative overflow-hidden">
          {currentScreen === 0 && <Screen01Welcome config={config} onNext={handleNext} />}
          {currentScreen === 1 && <Screen02LoveLetter config={config} onNext={handleNext} onPrev={handlePrev} />}
          {currentScreen === 2 && <Screen03Moments config={config} onNext={handleNext} onPrev={handlePrev} />}
          {currentScreen === 3 && <Screen04WhyExtraordinary config={config} onNext={handleNext} onPrev={handlePrev} />}
          {currentScreen === 4 && <Screen05Cosmic config={config} onNext={handleNext} onPrev={handlePrev} />}
          {currentScreen === 5 && <Screen06MakeAWish config={config} onNext={handleNext} onPrev={handlePrev} />}
          {currentScreen === 6 && <Screen07OurSong config={config} onNext={handleNext} onPrev={handlePrev} />}
          {currentScreen === 7 && <Screen08Timeline config={config} onNext={handleNext} onPrev={handlePrev} />}
          {currentScreen === 8 && <Screen09FinalMessage config={config} onReplay={handleReplay} onPrev={handlePrev} />}
        </main>
      </div>

      {/* Screen Selection Modal / Drawer */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FFF0F2]/80 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card-romantic rounded-3xl p-6 max-w-sm w-full border border-[#FFD5DD] shadow-2xl relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#FFD5DD]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#E83D6F]" />
                <h3 className="font-serif font-bold text-base text-[#6D3046]">
                  Jump to Screen
                </h3>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#FFD5DD] flex items-center justify-center text-[#6D3046] hover:text-[#E83D6F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-1.5 max-h-[60vh] overflow-y-auto no-scrollbar">
              {SCREEN_NAMES.map((name, index) => (
                <button
                  key={index}
                  onClick={() => {
                    goToScreen(index);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-all cursor-pointer ${
                    index === currentScreen
                      ? 'bg-[#E83D6F] text-white font-semibold shadow-sm'
                      : 'hover:bg-white/80 text-[#6D3046]'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="opacity-60 text-xs">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{name}</span>
                  </span>
                  {index === currentScreen && <Heart className="w-3.5 h-3.5 fill-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
