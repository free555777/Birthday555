import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Play, Pause, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';
import { SiteConfig } from '../../types';
import { audioEngine } from '../../utils/audio';

interface Screen07OurSongProps {
  config: SiteConfig;
  onNext: () => void;
  onPrev: () => void;
}

export const Screen07OurSong: React.FC<Screen07OurSongProps> = ({ config, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = audioEngine.subscribe((playing: boolean) => {
      setIsPlaying(playing);
    });
    return () => unsub();
  }, []);

  const handleTogglePlay = () => {
    audioEngine.togglePlay(config.musicUrl);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-9 overflow-hidden select-none bg-gradient-to-b from-[#FFF0F2] via-[#FFF8F5] to-[#FFE7EC]">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute top-1/4 -right-16 w-80 h-80 rounded-full bg-[#FFD5DD]/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -left-16 w-80 h-80 rounded-full bg-[#FFE3E8]/50 blur-3xl" />

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
            Soundtrack Of Us
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#6D3046] font-semibold">
            Our Special Song
          </h2>
        </div>

        <div className="inline-flex items-center space-x-1 text-xs text-[#9B6577] font-medium">
          <Volume2 className="w-3.5 h-3.5 text-[#F45B82]" />
          <span>Romantic Melody</span>
        </div>
      </div>

      {/* Center Floating Rotating Vinyl Record */}
      <div className="relative z-10 my-auto w-full max-w-md mx-auto flex flex-col items-center justify-center py-2">
        <div className="relative w-56 h-56 sm:w-68 sm:h-68 md:w-76 md:h-76 flex items-center justify-center">
          {/* Turntable Arm Indicator */}
          <div
            className={`absolute -top-4 right-2 sm:right-6 w-12 sm:w-16 h-24 sm:h-32 border-r-2 border-t-2 border-[#D9A441] rounded-tr-2xl transition-transform duration-500 origin-top-right z-20 pointer-events-none ${
              isPlaying ? 'rotate-12' : '-rotate-12'
            }`}
          >
            <div className="absolute -bottom-2 -left-1 w-3 h-4 bg-[#6D3046] rounded-sm shadow-md" />
          </div>

          {/* Vinyl Disc */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`relative w-full h-full rounded-full bg-gradient-to-tr from-[#1A1318] via-[#2A1E24] to-[#140F13] shadow-2xl flex items-center justify-center border-4 border-[#3D2C34] ${
              isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-spin-paused'
            }`}
          >
            {/* Concentric Grooves */}
            <div className="absolute inset-4 rounded-full border border-[#44303B]/60" />
            <div className="absolute inset-8 rounded-full border border-[#44303B]/50" />
            <div className="absolute inset-12 rounded-full border border-[#44303B]/60" />
            <div className="absolute inset-16 rounded-full border border-[#44303B]/50" />
            <div className="absolute inset-20 rounded-full border border-[#44303B]/60" />

            {/* Subtle Vinyl Sheen / Reflection */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

            {/* Center Label (Blush Pink Romantic Label) */}
            <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-gradient-to-br from-[#FFE3E8] to-[#FFD5DD] border-4 border-[#FFF8F5] shadow-inner flex flex-col items-center justify-center p-2 text-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#E83D6F] fill-[#E83D6F]" />
              <span className="text-[9px] sm:text-[10px] font-sans font-bold text-[#6D3046] mt-0.5 tracking-wider uppercase">
                {config.partnerName || 'Our Song'}
              </span>
              {/* Spindle hole */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#1A1318] border border-white mt-1" />
            </div>
          </motion.div>
        </div>

        {/* Song Info & Dancing Audio Waves */}
        <div className="text-center mt-5 space-y-2">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#6D3046]">
            {config.musicTitle || 'Our Special Song'}
          </h3>
          <p className="text-xs sm:text-sm text-[#9B6577] font-medium">
            {config.musicArtist || 'A Melody Written in the Stars'}
          </p>

          {/* Dancing Audio Bars */}
          <div className="flex items-center justify-center space-x-1.5 h-6 pt-1">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-[#E83D6F]"
                animate={{
                  height: isPlaying ? [6, 18 + (i % 3) * 6, 6] : 4,
                }}
                transition={{
                  duration: 0.6 + (i % 4) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>
        </div>

        {/* Big Play / Pause Button */}
        <div className="mt-4">
          <button
            onClick={handleTogglePlay}
            className="group btn-romantic-primary py-3.5 px-8 rounded-full text-sm sm:text-base font-medium flex items-center space-x-3 cursor-pointer shadow-lg"
            data-cursor="play"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>PAUSE MELODY</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>PLAY OUR SONG ♡</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-end pb-2">
        <button
          onClick={onNext}
          className="group btn-romantic-primary py-3 px-7 rounded-full text-sm sm:text-base font-medium flex items-center space-x-2.5 cursor-pointer shadow-md"
          data-cursor="pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
