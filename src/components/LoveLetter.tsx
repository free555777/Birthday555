import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Heart,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Feather,
  Cake,
  Moon,
  CloudRain,
  Flame,
  Compass,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { SiteConfig, LoveLetterItem } from '../types';
import { romanticAudio } from '../utils/audio';

interface LoveLetterProps {
  config: SiteConfig;
  onUpdateLetters?: (letters: LoveLetterItem[]) => void;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({ config, onUpdateLetters }) => {
  const [letters, setLetters] = useState<LoveLetterItem[]>(() => {
    return config.loveLetters && config.loveLetters.length > 0
      ? config.loveLetters
      : [
          {
            id: 'default-1',
            category: 'On Your Birthday',
            badge: 'Letter No. 01 • Birthday Edition',
            stampName: 'ROYAL AIR MAIL • 09.18',
            stampIcon: 'Cake',
            previewSubtitle: 'The day the universe made its greatest masterpiece.',
            sealColor: '#E11D48',
            salutation: config.loveLetterSalutation || `Dearest ${config.partnerName},`,
            body: config.loveLetterBody || [
              'Happy Birthday to the girl who made my entire universe stop spinning and start feeling like home.',
              'Because somehow, effortlessly and beautifully, you became the best part of every single day.'
            ],
            postscript: 'P.S. You look breathtaking today. Just like you do every single day.',
            signoff: config.loveLetterSignoff || 'Forever & Always Yours ❤️',
            dateTag: 'A Starlit Birthday'
          }
        ];
  });

  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);
  const [readLetters, setReadLetters] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // New letter draft state
  const [draftCategory, setDraftCategory] = useState('');
  const [draftSalutation, setDraftSalutation] = useState(`My Dearest ${config.partnerName},`);
  const [draftBody, setDraftBody] = useState('');
  const [draftPostscript, setDraftPostscript] = useState('');

  // Sync music state
  useEffect(() => {
    const unsub = romanticAudio.subscribe((playing) => setIsPlayingMusic(playing));
    return () => unsub();
  }, []);

  const activeIndex = letters.findIndex((l) => l.id === activeLetterId);
  const currentLetter = activeIndex !== -1 ? letters[activeIndex] : null;

  const handleOpenLetter = (letter: LoveLetterItem) => {
    // Play realistic wax seal break and chime sound!
    romanticAudio.playWaxSealBreak();
    setTimeout(() => {
      romanticAudio.playPaperRustle();
    }, 120);

    setActiveLetterId(letter.id);
    setReadLetters((prev) => new Set([...prev, letter.id]));
  };

  const handleClose = () => {
    setActiveLetterId(null);
    setCopied(false);
  };

  const handleNext = () => {
    if (activeIndex < letters.length - 1) {
      romanticAudio.playPaperRustle();
      const nextLetter = letters[activeIndex + 1];
      setActiveLetterId(nextLetter.id);
      setReadLetters((prev) => new Set([...prev, nextLetter.id]));
      setCopied(false);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      romanticAudio.playPaperRustle();
      const prevLetter = letters[activeIndex - 1];
      setActiveLetterId(prevLetter.id);
      setReadLetters((prev) => new Set([...prev, prevLetter.id]));
      setCopied(false);
    }
  };

  const handleCopy = () => {
    if (!currentLetter) return;
    const text = [
      currentLetter.salutation,
      '',
      ...currentLetter.body,
      '',
      currentLetter.postscript ? currentLetter.postscript : '',
      '',
      currentLetter.signoff
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleMusic = () => {
    romanticAudio.toggle(config.musicUrl);
  };

  const handleSaveNewLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftCategory.trim() || !draftBody.trim()) return;

    const newLetter: LoveLetterItem = {
      id: `letter-custom-${Date.now()}`,
      category: draftCategory.trim(),
      badge: `Letter No. 0${letters.length + 1} • Special Vow`,
      stampName: 'EXPRESS LOVE • VIP',
      stampIcon: 'Heart',
      previewSubtitle: draftBody.slice(0, 55) + '...',
      sealColor: '#E11D48',
      salutation: draftSalutation.trim() || `Dearest ${config.partnerName},`,
      body: draftBody.split('\n\n').filter((p) => p.trim().length > 0),
      postscript: draftPostscript.trim() ? `P.S. ${draftPostscript.trim()}` : undefined,
      signoff: `With all my heart, Forever Yours ❤️`,
      dateTag: 'Written With Love'
    };

    const updated = [...letters, newLetter];
    setLetters(updated);
    if (onUpdateLetters) {
      onUpdateLetters(updated);
    }

    // Reset draft
    setDraftCategory('');
    setDraftBody('');
    setDraftPostscript('');
    setIsComposing(false);

    // Automatically open newly created letter
    setTimeout(() => {
      handleOpenLetter(newLetter);
    }, 200);
  };

  const getStampIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cake':
        return <Cake className="w-4 h-4 text-[#FF7EB6]" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-[#A78BFA]" />;
      case 'CloudRain':
        return <CloudRain className="w-4 h-4 text-[#38BDF8]" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-[#FB7185]" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-[#34D399]" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-[#FDE047]" />;
    }
  };

  return (
    <section
      id="love-letters-section"
      className="relative w-full py-28 sm:py-36 bg-[#08090D] overflow-hidden px-4 sm:px-6 md:px-8 select-none"
    >
      {/* Background Refraction Glows for Glassmorphism */}
      <div className="pointer-events-none absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-[#FF7EB6]/10 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-[550px] w-[550px] rounded-full bg-[#A78BFA]/10 blur-[160px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-pill text-xs font-mono tracking-widest text-[#FFB6D9] uppercase mb-4 shadow-lg border border-white/10">
            <Mail className="w-3.5 h-3.5 text-[#FF7EB6]" />
            <span>A Sanctuary of Sealed Letters</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FF7EB6]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#FFF7FB] tracking-tight mb-4 drop-shadow-md">
            Love Letters for Every Season
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#FFF7FB]/70 max-w-lg mx-auto font-light leading-relaxed">
            Words written for ordinary mornings, rainy afternoons, and starlit birthdays. Click any
            sealed envelope to break the wax seal and unfold what is written inside.
          </p>

          <div className="mt-6 flex items-center justify-center space-x-3">
            <button
              onClick={() => setIsComposing(true)}
              data-cursor="pointer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full glass-pill border border-[#FF7EB6]/40 text-xs sm:text-sm text-[#FFB6D9] hover:text-white hover:border-[#FF7EB6] hover:bg-[#FF7EB6]/10 transition-all cursor-pointer shadow-md"
            >
              <Feather className="w-3.5 h-3.5 text-[#FF7EB6]" />
              <span>Write Another Letter ✍️</span>
            </button>
          </div>
        </div>

        {/* 6 Glassmorphic Envelopes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {letters.map((letter, index) => {
            const isRead = readLetters.has(letter.id);

            return (
              <motion.div
                key={letter.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={() => handleOpenLetter(letter)}
                data-cursor="open"
                className="group relative cursor-pointer"
              >
                {/* Envelope Container with Frosted Glass */}
                <div className="relative aspect-[7/5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.45)] group-hover:border-[#FF7EB6]/60 group-hover:shadow-[0_20px_50px_rgba(255,126,182,0.2)] transition-all duration-500">
                  {/* Subtle Inner Glass Highlight */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/30 rounded-3xl" />

                  {/* Envelope Flap Geometrical styling */}
                  <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent [clip-path:polygon(0_0,100%_0,50%_100%)] group-hover:from-[#FF7EB6]/10 transition-colors" />

                  {/* Top Bar: Airmail Stamp & Badge */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#FF7EB6] uppercase">
                        {letter.badge}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono mt-0.5">
                        {letter.dateTag}
                      </span>
                    </div>

                    {/* Vintage Postage Stamp */}
                    <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-dashed border-white/30 bg-black/40 backdrop-blur-md text-[9px] font-mono tracking-wider text-white/80 group-hover:border-[#FF7EB6]/60 transition-colors">
                      {getStampIcon(letter.stampIcon)}
                      <span className="truncate max-w-[85px]">{letter.stampName}</span>
                    </div>
                  </div>

                  {/* Center: Envelope Prompt Title */}
                  <div className="relative z-10 my-auto text-center px-2">
                    <span className="block text-[11px] font-mono uppercase tracking-widest text-[#FFB6D9]/70 mb-1">
                      Open When...
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FFF7FB] tracking-tight group-hover:text-[#FFB6D9] transition-colors line-clamp-1">
                      {letter.category}
                    </h3>
                    <p className="font-sans text-xs text-white/60 line-clamp-2 mt-1.5 font-light leading-relaxed">
                      "{letter.previewSubtitle}"
                    </p>
                  </div>

                  {/* Bottom: 3D Wax Seal & Status */}
                  <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      {isRead ? (
                        <span className="inline-flex items-center text-[11px] font-mono text-[#34D399]">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Unsealed
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-mono text-[#FF7EB6] group-hover:underline">
                          Break Seal 💌
                        </span>
                      )}
                    </div>

                    {/* 3D Wax Seal Emboss */}
                    <div
                      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-115"
                      style={{
                        backgroundColor: letter.sealColor,
                        boxShadow: `0 4px 15px ${letter.sealColor}66, inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.5)`,
                      }}
                    >
                      <Heart className="w-4 h-4 text-white fill-white drop-shadow" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Unfolded Love Letter Reader Modal */}
      <AnimatePresence>
        {activeLetterId && currentLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9985] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-2xl overflow-y-auto"
            onClick={handleClose}
          >
            {/* Ambient Floating Hearts background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <Heart
                  key={i}
                  className="absolute text-[#FF7EB6]/15 fill-[#FF7EB6]/10 animate-pulse"
                  style={{
                    top: `${(i * 19 + 5) % 92}%`,
                    left: `${(i * 23 + 8) % 92}%`,
                    width: `${18 + (i % 3) * 12}px`,
                    height: `${18 + (i % 3) * 12}px`,
                    animationDuration: `${3 + (i % 4)}s`,
                  }}
                />
              ))}
            </div>

            {/* Letter Paper Container */}
            <motion.div
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 max-w-3xl w-full my-auto rounded-3xl bg-[#0E1017]/95 border border-[#FF7EB6]/30 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Decorative Bar with Navigation and Controls */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
                {/* Left: Previous / Next letter arrows */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    data-cursor="pointer"
                    aria-label="Previous Letter"
                    className={`p-2 rounded-full border border-white/10 text-white/70 transition-all ${
                      activeIndex === 0
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-white/10 hover:text-white cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-mono text-white/50 px-1">
                    {activeIndex + 1} of {letters.length}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={activeIndex === letters.length - 1}
                    data-cursor="pointer"
                    aria-label="Next Letter"
                    className={`p-2 rounded-full border border-white/10 text-white/70 transition-all ${
                      activeIndex === letters.length - 1
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-white/10 hover:text-white cursor-pointer'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Audio toggle, Copy & Close */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleMusic}
                    data-cursor="pointer"
                    title={isPlayingMusic ? 'Mute Background Piano' : 'Play Romantic Piano'}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-[#FFB6D9] bg-white/[0.06] hover:bg-white/[0.12] transition-colors border border-white/10 cursor-pointer"
                  >
                    {isPlayingMusic ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#FF7EB6]" />
                        <span className="hidden sm:inline">Piano Playing</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-white/50" />
                        <span className="hidden sm:inline">Play Melody</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopy}
                    data-cursor="pointer"
                    title="Copy Letter Words"
                    className="p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#34D399]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={handleClose}
                    data-cursor="pointer"
                    aria-label="Close Letter"
                    className="p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Letter Scrollable Body */}
              <div className="p-6 sm:p-10 md:p-14 overflow-y-auto max-h-[75vh] flex flex-col space-y-6">
                {/* Envelope Origin Stamp Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FF7EB6]">
                      {currentLetter.badge}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF7FB] mt-0.5">
                      {currentLetter.category}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                      style={{
                        backgroundColor: currentLetter.sealColor,
                        boxShadow: `0 2px 8px ${currentLetter.sealColor}66`,
                      }}
                    >
                      <Heart className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                    <span className="text-xs font-mono text-white/50">
                      {currentLetter.dateTag}
                    </span>
                  </div>
                </div>

                {/* Salutation */}
                <div className="pt-2">
                  <h4 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#FFB6D9] font-normal">
                    {currentLetter.salutation}
                  </h4>
                </div>

                {/* Body Paragraphs with Elegant Editorial Typography */}
                <div className="space-y-5 font-serif text-lg sm:text-xl md:text-2xl text-[#FFF7FB]/95 leading-relaxed sm:leading-loose font-light">
                  {currentLetter.body.map((paragraph, i) => (
                    <p key={i} className={i === 0 ? 'first-letter:text-4xl first-letter:font-serif first-letter:text-[#FF7EB6] first-letter:mr-1' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Postscript (P.S.) Callout if available */}
                {currentLetter.postscript && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-[#FF7EB6]/20 text-sm sm:text-base font-sans italic text-[#FFB6D9]/90 flex items-start space-x-3">
                    <Heart className="w-4 h-4 text-[#FF7EB6] shrink-0 mt-1 fill-[#FF7EB6]" />
                    <span>{currentLetter.postscript}</span>
                  </div>
                )}

                {/* Signoff */}
                <div className="pt-6 border-t border-white/10 flex flex-col items-end">
                  <span className="font-serif italic text-xl sm:text-2xl text-[#FF7EB6]">
                    {currentLetter.signoff}
                  </span>
                  <span className="text-xs font-mono text-white/40 mt-1">
                    Written with all my heart
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compose Custom Love Letter Modal */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
            onClick={() => setIsComposing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#0E1017]/95 border border-white/20 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center space-x-2">
                  <Feather className="w-4 h-4 text-[#FF7EB6]" />
                  <h3 className="font-serif text-xl text-[#FFF7FB]">Write A New Love Letter</h3>
                </div>
                <button
                  onClick={() => setIsComposing(false)}
                  data-cursor="pointer"
                  className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNewLetter} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[#FFB6D9] font-mono mb-1">
                    Letter Occasion / Title (e.g. "Open When You Need A Hug", "On Our Anniversary")
                  </label>
                  <input
                    type="text"
                    required
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                    placeholder="e.g. Open When You Feel Tired"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7EB6]"
                  />
                </div>

                <div>
                  <label className="block text-[#FFB6D9] font-mono mb-1">Salutation</label>
                  <input
                    type="text"
                    value={draftSalutation}
                    onChange={(e) => setDraftSalutation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7EB6]"
                  />
                </div>

                <div>
                  <label className="block text-[#FFB6D9] font-mono mb-1">
                    Letter Body (Separate paragraphs with blank lines)
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    placeholder="Write from your heart..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7EB6] font-serif text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[#FFB6D9] font-mono mb-1">
                    Optional Postscript (P.S.)
                  </label>
                  <input
                    type="text"
                    value={draftPostscript}
                    onChange={(e) => setDraftPostscript(e.target.value)}
                    placeholder="e.g. I left a sweet treat in your coat pocket..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7EB6]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    data-cursor="pointer"
                    className="px-4 py-2.5 rounded-xl text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    data-cursor="pointer"
                    className="px-6 py-2.5 rounded-xl bg-[#FF7EB6] text-[#08090D] font-medium tracking-wide hover:bg-[#FFB6D9] transition-colors cursor-pointer shadow-lg shadow-[#FF7EB6]/30 flex items-center space-x-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Seal & Add Letter</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
