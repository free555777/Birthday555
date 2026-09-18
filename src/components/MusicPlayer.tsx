import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Music, Disc } from 'lucide-react';
import { romanticAudio } from '../utils/audio';
import { SiteConfig } from '../types';

interface MusicPlayerProps {
  config: SiteConfig;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ config }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const unsub = romanticAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsub();
    };
  }, []);

  const handleTogglePlay = () => {
    setHasInteracted(true);
    romanticAudio.toggle(config.musicUrl);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    romanticAudio.setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      romanticAudio.setVolume(volume > 0 ? volume : 0.5);
    } else {
      setIsMuted(true);
      romanticAudio.setVolume(0);
    }
  };

  return (
    <div
      id="floating-music-player"
      data-cursor="play"
      className="fixed bottom-5 right-5 z-[9950] flex items-center select-none"
    >
      {/* Expanded Control Pod */}
      {isExpanded && (
        <div className="mr-3 p-4 rounded-2xl glass-card border border-white/15 shadow-2xl flex flex-col space-y-2 animate-fade-in min-w-[200px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-serif font-medium text-[#FFF7FB]">
                {config.musicTitle || 'Our Song ♡'}
              </span>
              <span className="text-[10px] text-[#FFB6D9]/70 font-mono">
                {config.musicArtist || 'Romantic Melody'}
              </span>
            </div>
            <Heart
              className={`w-3.5 h-3.5 ${
                isPlaying ? 'text-[#FF7EB6] fill-[#FF7EB6] animate-pulse' : 'text-white/40'
              }`}
            />
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 pt-1 border-t border-white/10">
            <button
              onClick={handleToggleMute}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#FFB6D9]" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF7EB6]"
            />
          </div>
        </div>
      )}

      {/* Floating Rotating Vinyl Record Disc */}
      <div className="relative flex items-center">
        {/* Initial First-time Callout Badge */}
        {!hasInteracted && !isPlaying && (
          <div
            onClick={handleTogglePlay}
            className="absolute right-16 px-3 py-1.5 rounded-full bg-[#FF7EB6] text-[#08090D] text-xs font-medium tracking-wide shadow-[0_0_20px_rgba(255,126,182,0.6)] whitespace-nowrap animate-bounce cursor-pointer flex items-center space-x-1.5"
          >
            <Music className="w-3 h-3" />
            <span>Play our song ♡</span>
          </div>
        )}

        <button
          onClick={handleTogglePlay}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          data-cursor="pointer"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className="group relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#08090D] border-2 border-white/20 p-1 shadow-2xl hover:border-[#FF7EB6] hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center"
        >
          {/* Vinyl Grooves Texture */}
          <div
            className={`absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,#111_0%,#000_15%,#222_16%,#000_30%,#222_31%,#000_50%,#222_51%,#000_70%,#222_71%,#000_100%)] ${
              isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-spin animate-vinyl-spin-paused'
            }`}
          >
            {/* Glossy light sheen reflection */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Center Record Label */}
          <div className="relative z-10 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-br from-[#FF7EB6] to-[#A78BFA] flex items-center justify-center shadow-inner">
            {isPlaying ? (
              <Pause className="w-3 h-3 text-[#08090D] fill-[#08090D]" />
            ) : (
              <Play className="w-3 h-3 text-[#08090D] fill-[#08090D] ml-0.5" />
            )}
          </div>
        </button>

        {/* Small settings toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 p-1.5 rounded-full glass-pill text-white/60 hover:text-white transition-colors cursor-pointer"
          title="Music options"
          aria-label="Toggle player details"
        >
          <Disc className="w-3.5 h-3.5 text-[#FFB6D9]" />
        </button>
      </div>
    </div>
  );
};
