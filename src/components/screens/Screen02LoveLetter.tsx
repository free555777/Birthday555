import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { SiteConfig } from '../../types';

interface Screen02LoveLetterProps {
  config: SiteConfig;
  onNext: () => void;
  onPrev: () => void;
}

export const Screen02LoveLetter: React.FC<Screen02LoveLetterProps> = ({ config, onNext, onPrev }) => {
  // Default letter fallback if config doesn't have loveLetters
  const letter = config.loveLetters && config.loveLetters.length > 0
    ? config.loveLetters[0]
    : {
        salutation: `Dearest ${config.partnerName || 'My Love'},`,
        body: [
          'Happy Birthday to the girl who made my entire universe stop spinning and start feeling like home.',
          'If someone had told me years ago that an ordinary day could turn into starlight just because of a single smile, I would not have believed them. Until you walked into my life.',
          'Your laughter is my favorite song, your kindness is the anchor of my world, and watching you grow into everything you dream of is the greatest honor I have ever had.',
          'Blow out every candle today knowing that every wish you make has already become my life’s mission to help come true.'
        ],
        postscript: 'P.S. You look breathtaking today. Just like you do every single day.',
        signoff: 'Forever & Always Yours,'
      };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-8 md:p-10 overflow-hidden select-none bg-gradient-to-b from-[#FFF8F5] via-[#FFE7EC] to-[#FFF0F2]">
      {/* Delicate floating background petals & sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#FFD5DD]/40 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-[#FFE3E8]/50 blur-3xl" />
        
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#F45B82]/20"
            style={{
              top: `${(i * 24 + 14) % 85}%`,
              left: `${(i * 31 + 8) % 88}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3.5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            <Sparkles className="w-4 h-4 text-[#E83D6F]" />
          </motion.div>
        ))}
      </div>

      {/* Screen Header */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-2xl mx-auto pt-2">
        <button
          onClick={onPrev}
          className="btn-romantic-secondary px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1.5 cursor-pointer"
          data-cursor="pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="inline-flex items-center space-x-1.5 text-xs text-[#9B6577] font-medium tracking-wide">
          <Heart className="w-3 h-3 text-[#F45B82] fill-[#F45B82]" />
          <span>Letter 01 of Love</span>
        </div>
      </div>

      {/* Center Love Letter Paper Card */}
      <div className="relative z-10 my-auto w-full max-w-2xl mx-auto py-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="card-romantic rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden border border-[#FFD5DD] shadow-xl"
        >
          {/* Subtle decorative wax seal / ribbon accent */}
          <div className="absolute top-4 right-5 sm:top-6 sm:right-7 flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#E83D6F] to-[#C93B61] text-white shadow-md flex items-center justify-center border-2 border-white">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            </div>
          </div>

          {/* Letter Title & Salutation */}
          <div className="mb-4 pr-12">
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#E83D6F] uppercase">
              To My Beautiful Love ♡
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#6D3046] mt-1 font-semibold tracking-tight">
              {letter.salutation}
            </h2>
          </div>

          {/* Letter Body - With Internal Scroll if on small screen */}
          <div className="max-h-[38vh] sm:max-h-[42vh] overflow-y-auto pr-2 no-scrollbar space-y-3.5 text-[#6D3046]/90 font-serif text-sm sm:text-base leading-relaxed">
            {letter.body.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}

            {letter.postscript && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="font-handwriting text-base sm:text-lg text-[#C93B61] pt-1"
              >
                {letter.postscript}
              </motion.p>
            )}
          </div>

          {/* Signoff */}
          <div className="mt-5 pt-3 border-t border-[#FFD5DD]/70 flex items-center justify-between">
            <span className="font-handwriting text-xl sm:text-2xl text-[#E83D6F]">
              {letter.signoff}
            </span>
            <div className="text-[11px] sm:text-xs text-[#9B6577] italic">
              Written with all my heart
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-end pb-3">
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
