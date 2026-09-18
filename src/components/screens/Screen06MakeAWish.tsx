import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Wind, Mic, ArrowRight, ArrowLeft } from 'lucide-react';
import { SiteConfig } from '../../types';
import { audioEngine } from '../../utils/audio';

interface Screen06MakeAWishProps {
  config: SiteConfig;
  onNext: () => void;
  onPrev: () => void;
}

export const Screen06MakeAWish: React.FC<Screen06MakeAWishProps> = ({ config, onNext, onPrev }) => {
  const [isBlown, setIsBlown] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const triggerBlowOut = () => {
    if (isBlown) return;
    setIsBlown(true);
    setIsListeningMic(false);

    // Stop mic stream if active
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Play chime sound
    audioEngine.playChime();

    // Celebration Confetti burst
    const count = 120;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#F45B82', '#E83D6F', '#FFD5DD', '#D9A441', '#FFFFFF'],
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.5),
      spread: 70,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.35),
      spread: 110,
      decay: 0.92,
      scalar: 1.1,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.25),
      spread: 140,
      startVelocity: 45,
    });
  };

  // Optional microphone blow detection (Purely optional!)
  const handleToggleMic = async () => {
    if (isListeningMic) {
      setIsListeningMic(false);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setIsListeningMic(true);

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkBlow = () => {
        if (!analyserRef.current || isBlown) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Low frequency noise check for breath/blow
        let sum = 0;
        for (let i = 0; i < 20; i++) {
          sum += dataArray[i];
        }
        const average = sum / 20;

        if (average > 85) {
          triggerBlowOut();
          return;
        }

        animationFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch {
      // User declined or mic unavailable -> graceful fallback
      setIsListeningMic(false);
    }
  };

  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-9 overflow-hidden select-none bg-gradient-to-b from-[#FFF0F2] via-[#FFF8F5] to-[#FFE7EC]">
      {/* Background glow when wish is made */}
      <motion.div
        animate={{
          opacity: isBlown ? 0.75 : 0.25,
          scale: isBlown ? 1.2 : 1,
        }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-gradient-to-r from-[#FFD5DD] via-[#FFE3E8] to-[#FFF8F5] blur-3xl"
      />

      {/* Floating upward hearts when candle is blown */}
      {isBlown && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 250, opacity: 0, scale: 0.5 }}
              animate={{
                y: -150,
                opacity: [0, 0.9, 0],
                scale: [0.6, 1.2, 0.8],
                x: (i % 2 === 0 ? 1 : -1) * (15 + (i * 8)),
              }}
              transition={{
                duration: 2.5 + (i % 4) * 0.5,
                delay: i * 0.15,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute text-[#F45B82] left-1/2 -translate-x-1/2"
              style={{
                left: `${30 + (i * 5) % 45}%`,
                bottom: '18%',
              }}
            >
              <Heart className="w-5 h-5 fill-current" />
            </motion.div>
          ))}
        </div>
      )}

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
            Birthday Ritual
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#6D3046] font-semibold">
            Make a Wish
          </h2>
        </div>

        <div className="inline-flex items-center space-x-1 text-xs text-[#9B6577] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#F45B82]" />
          <span>Magic Moment</span>
        </div>
      </div>

      {/* Center Cake & Candle Illustration */}
      <div className="relative z-10 my-auto w-full max-w-sm mx-auto flex flex-col items-center justify-center py-2">
        <div className="relative flex flex-col items-center justify-center">
          {/* Candle & Flame */}
          <div className="relative flex flex-col items-center z-10 -mb-2">
            {/* Candle Flame or Smoke */}
            <AnimatePresence mode="wait">
              {!isBlown ? (
                <motion.div
                  key="flame"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0, y: -8 }}
                  className="relative flex flex-col items-center"
                >
                  {/* Warm outer glow */}
                  <div className="absolute -top-3 w-10 h-10 rounded-full bg-[#D9A441]/40 blur-md animate-pulse" />
                  {/* Outer Flame Tear */}
                  <div className="w-5 h-8 sm:w-6 sm:h-9 bg-gradient-to-t from-[#E83D6F] via-[#D9A441] to-[#FFF8F5] rounded-full animate-flame-flicker shadow-lg border border-[#FFF8F5]/50" />
                  {/* Inner Flame Core */}
                  <div className="absolute bottom-1 w-2 h-4 bg-white rounded-full opacity-90" />
                </motion.div>
              ) : (
                <motion.div
                  key="smoke"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.8, 0], y: -30, x: [0, 5, -5] }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  className="flex flex-col items-center"
                >
                  <div className="w-1.5 h-6 bg-[#9B6577]/40 rounded-full blur-[1px]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Candle Wick */}
            <div className="w-1 h-2.5 bg-[#6D3046]/70 rounded-full mt-0.5" />

            {/* Candle Stick */}
            <div className="w-3.5 h-14 sm:h-16 rounded-t-sm rounded-b-sm bg-gradient-to-b from-[#FFF8F5] via-[#FFE3E8] to-[#FFD5DD] border border-[#FFD5DD] shadow-sm flex flex-col items-center justify-around py-1">
              <div className="w-full h-1 bg-[#F45B82]/30" />
              <div className="w-full h-1 bg-[#F45B82]/30" />
            </div>
          </div>

          {/* Luxury Soft Pink Cake Tier */}
          <div className="relative flex flex-col items-center">
            {/* Top Tier */}
            <div className="w-40 sm:w-48 h-16 sm:h-20 rounded-2xl bg-gradient-to-b from-[#FFF8F5] to-[#FFE3E8] border-2 border-white shadow-md flex flex-col justify-between p-2 relative z-10">
              {/* Frosting drips & flowers */}
              <div className="flex justify-around items-center pt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xs">🌸</span>
                ))}
              </div>
              <div className="text-center font-handwriting text-[#E83D6F] text-base sm:text-lg">
                For {config.partnerName || 'My Love'}
              </div>
            </div>

            {/* Bottom Tier */}
            <div className="w-52 sm:w-60 h-20 sm:h-24 rounded-3xl bg-gradient-to-b from-[#FFE3E8] to-[#FFD5DD] border-2 border-white shadow-xl flex flex-col justify-between p-3 -mt-3 relative z-0">
              <div className="flex justify-around items-center pt-3 text-xs">
                <span>🍓</span>
                <span>✨</span>
                <span>💖</span>
                <span>✨</span>
                <span>🍓</span>
              </div>
              {/* Cake Stand Base */}
              <div className="w-full h-2 rounded-full bg-white/70" />
            </div>

            {/* Porcelain Plate */}
            <div className="w-60 sm:w-72 h-3.5 rounded-full bg-white border border-[#FFD5DD] shadow-md -mt-1" />
          </div>
        </div>

        {/* State Text & Celebration */}
        <div className="text-center mt-5">
          <AnimatePresence mode="wait">
            {!isBlown ? (
              <motion.div
                key="make-wish"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#6D3046]">
                  Close your eyes and make a wish...
                </h3>
                <p className="text-xs sm:text-sm text-[#9B6577] mt-0.5">
                  When you are ready, blow out the candle below.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="wish-made"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-1"
              >
                <div className="inline-flex items-center space-x-1.5 text-base sm:text-lg font-serif font-bold text-[#E83D6F]">
                  <Sparkles className="w-4 h-4" />
                  <span>Wish made. ♡</span>
                </div>
                <p className="text-xs sm:text-sm text-[#6D3046]/90 font-serif max-w-xs mx-auto">
                  May every dream in your heart unfold into reality this year.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-between pb-2">
        {!isBlown ? (
          <div className="flex items-center space-x-2 w-full justify-center">
            <button
              onClick={triggerBlowOut}
              className="group btn-romantic-primary py-3.5 px-8 rounded-full text-sm sm:text-base font-medium flex items-center space-x-2.5 cursor-pointer shadow-lg"
              data-cursor="pointer"
            >
              <Wind className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Blow the Candle 💨</span>
            </button>

            {/* Optional Mic helper */}
            <button
              onClick={handleToggleMic}
              className={`p-3 rounded-full border transition-all cursor-pointer ${
                isListeningMic
                  ? 'bg-[#E83D6F] text-white border-[#E83D6F] animate-pulse'
                  : 'bg-white/80 text-[#9B6577] border-[#FFD5DD] hover:text-[#E83D6F]'
              }`}
              title={isListeningMic ? 'Listening for blow (tap to stop)' : 'Use microphone to blow'}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-end">
            <button
              onClick={onNext}
              className="group btn-romantic-primary py-3 px-7 rounded-full text-sm sm:text-base font-medium flex items-center space-x-2.5 cursor-pointer shadow-md"
              data-cursor="pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
