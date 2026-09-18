import React, { useState, useEffect, useRef } from 'react';
import { Heart, Lock, Sparkles, ArrowRight, Volume2, VolumeX, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { PublicWebsiteData, SiteConfig } from '../../types';
import { fetchPublicStory, verifyPublicPassword } from '../../utils/api';
import { audioEngine } from '../../utils/audio';

import { Screen01Welcome } from '../screens/Screen01Welcome';
import { Screen02LoveLetter } from '../screens/Screen02LoveLetter';
import { Screen03Moments } from '../screens/Screen03Moments';
import { Screen04WhyExtraordinary } from '../screens/Screen04WhyExtraordinary';
import { Screen05Cosmic } from '../screens/Screen05Cosmic';
import { Screen06MakeAWish } from '../screens/Screen06MakeAWish';
import { Screen07OurSong } from '../screens/Screen07OurSong';
import { Screen08Timeline } from '../screens/Screen08Timeline';
import { Screen09FinalMessage } from '../screens/Screen09FinalMessage';

interface PublicStoryViewProps {
  slug: string;
  onNavigateHome: () => void;
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
  'finale',
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
  'Final Message',
];

export const PublicStoryView: React.FC<PublicStoryViewProps> = ({ slug, onNavigateHome }) => {
  const [data, setData] = useState<PublicWebsiteData | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Password Unlock State
  const [isLocked, setIsLocked] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Navigation & Shell State
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const screenContainerRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  // Load public story data
  useEffect(() => {
    let isMounted = true;
    async function loadStory() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchPublicStory(slug);
        if (!isMounted) return;

        setData(res);
        if (res.isPasswordProtected && !res.config) {
          setIsLocked(true);
        } else if (res.config) {
          setConfig(res.config);
          setIsLocked(false);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || 'This romantic surprise could not be found.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadStory();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Audio Engine Subscription
  useEffect(() => {
    const unsub = audioEngine.subscribe((playing: boolean) => {
      setIsMuted(!playing);
    });
    return () => unsub();
  }, []);

  // GSAP Screen Transitions
  const goToScreen = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= SCREEN_SLUGS.length) return;
    if (targetIndex === currentScreen || isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    const container = screenContainerRef.current;

    if (!container) {
      setCurrentScreen(targetIndex);
      isTransitioningRef.current = false;
      return;
    }

    const direction = targetIndex > currentScreen ? 1 : -1;

    gsap.to(container, {
      opacity: 0,
      scale: 0.96,
      filter: 'blur(4px)',
      y: -12 * direction,
      duration: 0.28,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentScreen(targetIndex);
        gsap.set(container, {
          opacity: 0,
          scale: 0.96,
          filter: 'blur(4px)',
          y: 16 * direction,
        });

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
    if (config) {
      audioEngine.togglePlay(config.musicUrl);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (isLocked || !config) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentScreen < SCREEN_SLUGS.length - 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentScreen > 0) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, isLocked, config]);

  // Touch swipe support
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 75 && Math.abs(deltaX) > Math.abs(deltaY) * 1.6) {
      if (deltaX < 0 && currentScreen < SCREEN_SLUGS.length - 1) {
        handleNext();
      } else if (deltaX > 0 && currentScreen > 0) {
        handlePrev();
      }
    }
  };

  // Password Unlock Form Submit
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPassword.trim()) {
      setPasswordError('Please enter the secret password ♡');
      return;
    }
    try {
      setIsVerifying(true);
      setPasswordError(null);
      const res = await verifyPublicPassword(slug, enteredPassword.trim());
      if (res.success && res.config) {
        setConfig(res.config);
        setIsLocked(false);
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Incorrect password. Try again ♡');
    } finally {
      setIsVerifying(false);
    }
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="w-full h-full min-h-screen bg-[#FFF0F2] flex flex-col items-center justify-center text-[#6D3046]">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full bg-[#FFE4E8] flex items-center justify-center animate-ping opacity-60 absolute inset-0" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F45B82] to-[#E83D6F] flex items-center justify-center text-white shadow-xl relative z-10">
            <Heart className="w-8 h-8 fill-white" />
          </div>
        </div>
        <h2 className="font-serif text-xl font-bold text-[#6D3046]">
          Opening your surprise...
        </h2>
        <p className="text-xs text-[#9E5870] mt-1 font-sans">
          Gathering memories & starlight
        </p>
      </div>
    );
  }

  // ERROR / NOT FOUND SCREEN
  if (error || !data) {
    return (
      <div className="w-full h-full min-h-screen bg-[#FFF0F2] flex flex-col items-center justify-center p-6 text-center text-[#6D3046]">
        <div className="w-14 h-14 rounded-full bg-white border border-[#FFD5DD] flex items-center justify-center text-[#E83D6F] mb-4 shadow-md">
          <Heart className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-2">
          Story Not Found
        </h2>
        <p className="text-xs sm:text-sm text-[#9E5870] max-w-sm mx-auto mb-6">
          {error || "This romantic surprise link may be private or hasn't been published yet."}
        </p>
        <button
          onClick={onNavigateHome}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F45B82] to-[#E83D6F] text-white font-serif font-bold text-xs sm:text-sm shadow-md hover:brightness-105"
        >
          Create A Romantic Story →
        </button>
      </div>
    );
  }

  // PASSWORD PROTECTED GATE
  if (isLocked) {
    return (
      <div className="w-full h-full min-h-screen bg-[#FFF0F2] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#F45B82] selection:text-white">
        <div className="card-romantic rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#FFD5DD] shadow-2xl bg-white/95 text-center relative z-10 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F45B82] to-[#E83D6F] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-bold text-[#E83D6F] uppercase tracking-widest">
            Private Surprise
          </span>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#6D3046] mt-1 mb-2">
            A Story For {data.recipientInfo?.recipientName || 'You'} ♡
          </h2>
          <p className="text-xs text-[#9E5870] leading-relaxed mb-6">
            This surprise is locked with a secret passcode. Enter the secret word to open your universe.
          </p>

          {passwordError && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              placeholder="Enter secret passcode..."
              className="w-full px-4 py-3 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-center text-sm font-medium text-[#6D3046] placeholder-[#C48B9F] focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30 focus:border-[#E83D6F]"
              required
              autoFocus
            />

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F45B82] to-[#E83D6F] text-white font-serif font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Open Your Surprise →</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // UNLOCKED PUBLIC 9-SCREEN EXPERIENCE
  if (!config) return null;

  return (
    <div
      className="w-full h-full min-h-screen bg-[#FFF0F2] flex items-center justify-center overflow-hidden relative selection:bg-[#F45B82] selection:text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer App Frame */}
      <div className="app-screen-container shadow-2xl relative bg-[#FFF0F2] border-x border-[#FFD5DD]/40 flex flex-col justify-between">
        
        {/* Minimal Public Navigation Header */}
        <header className="relative z-30 w-full px-4 sm:px-8 py-3 flex items-center justify-between border-b border-[#FFD5DD]/40 bg-white/60 backdrop-blur-md">
          {/* Brand */}
          <button
            onClick={() => goToScreen(0)}
            className="flex items-center space-x-2 text-[#6D3046] hover:text-[#E83D6F] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F45B82] to-[#E83D6F] flex items-center justify-center text-white shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-serif font-bold text-sm sm:text-base tracking-tight">
              For {config.partnerName || 'You'}
            </span>
          </button>

          {/* Progress Indicators */}
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

          {/* Controls: Sound & Screen Menu (Read-only, no settings button!) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                !isMuted
                  ? 'bg-[#E83D6F] text-white border-[#E83D6F] shadow-sm'
                  : 'bg-white/80 text-[#6D3046] border-[#FFD5DD] hover:text-[#E83D6F]'
              }`}
              title={!isMuted ? 'Mute romantic soundtrack' : 'Play romantic soundtrack'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-full bg-white/80 text-[#6D3046] border border-[#FFD5DD] hover:text-[#E83D6F] transition-all cursor-pointer"
              title="Jump to screen"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Screen View Container */}
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

      {/* Screen Selection Modal */}
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
