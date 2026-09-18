import React, { useState } from 'react';
import { Sparkles, X, RefreshCw, Check, Heart, Wand2 } from 'lucide-react';
import { generateAIMessage } from '../../utils/api';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptType: 'love-letter' | 'birthday-wish' | 'story-intro' | 'why-reasons';
  recipientName: string;
  relationship: string;
  onApply: (generated: any) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  promptType,
  recipientName,
  relationship,
  onApply,
}) => {
  const [tone, setTone] = useState('heartfelt, romantic, warm, poetic');
  const [extraNotes, setExtraNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await generateAIMessage({
        promptType,
        recipientName: recipientName || 'My Love',
        relationship,
        tone,
        extraNotes,
      });
      if (res.success && res.result) {
        setGeneratedResult(res.result);
      }
    } catch (err: any) {
      setError(err.message || 'Could not generate text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (promptType) {
      case 'love-letter':
        return 'Generate Romantic Love Letter';
      case 'birthday-wish':
        return 'Generate Birthday Headline & Wish';
      case 'story-intro':
        return 'Generate Poetic Story Intro';
      case 'why-reasons':
        return 'Generate 6 Extraordinary Reasons';
      default:
        return 'Generate with AI';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#6D3046]/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-[#FFD5DD] shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#FFD5DD]/60 mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F45B82] to-[#E83D6F] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#6D3046]">
                {getTitle()}
              </h3>
              <p className="text-xs text-[#9E5870]">
                Powered by Gemini AI for {recipientName || 'your love'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FFF0F2] text-[#6D3046] hover:text-[#E83D6F] border border-[#FFD5DD] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Parameters */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-[#6D3046] mb-1.5">
              Emotional Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: 'Deeply Heartfelt', val: 'deeply heartfelt, romantic, warm, poetic' },
                { label: 'Sweet & Playful', val: 'sweet, adorable, warm, slightly playful' },
                { label: 'Soulful & Intimate', val: 'soulful, intimate, timeless, tender' },
                { label: 'Starlit & Cinematic', val: 'cosmic, starlit, awe-inspiring, cinematic' },
                { label: 'Short & Powerful', val: 'concise, poignant, deeply touching' },
              ].map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTone(t.val)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    tone === t.val
                      ? 'bg-[#E83D6F] text-white border-[#E83D6F] shadow-sm font-semibold'
                      : 'bg-[#FFF5F7] text-[#6D3046] border-[#FFD5DD] hover:border-[#E83D6F]/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6D3046] mb-1.5">
              Personal Touches or Shared Memories <span className="text-[11px] font-normal text-[#9E5870]">(optional)</span>
            </label>
            <textarea
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              placeholder="e.g. loves hot cocoa on rainy Sundays, our trip to the ocean, laughing at silly inside jokes..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] placeholder-[#C48B9F] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30 focus:border-[#E83D6F]"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#F45B82] to-[#E83D6F] text-white font-serif font-bold text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Romantic Words...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>{generatedResult ? 'Regenerate Words ✨' : 'Generate Words ✨'}</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Generated Preview Box */}
        {generatedResult && (
          <div className="border border-[#FFD5DD] rounded-2xl p-4 bg-[#FFF5F7] space-y-3 mb-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#FFD5DD]/60">
              <span className="text-xs font-bold text-[#E83D6F] uppercase tracking-wider flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 fill-[#E83D6F]" />
                <span>Suggested Preview</span>
              </span>
              <span className="text-[11px] text-[#9E5870]">Review before applying</span>
            </div>

            {promptType === 'love-letter' && (
              <div className="text-xs sm:text-sm text-[#6D3046] font-serif space-y-2 leading-relaxed">
                <p className="font-bold text-[#E83D6F]">{generatedResult.salutation}</p>
                {Array.isArray(generatedResult.body) &&
                  generatedResult.body.map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                {generatedResult.postscript && (
                  <p className="italic text-[#9E5870]">{generatedResult.postscript}</p>
                )}
                <p className="font-bold">{generatedResult.signoff}</p>
              </div>
            )}

            {promptType === 'birthday-wish' && (
              <div className="space-y-2 text-xs sm:text-sm text-[#6D3046]">
                <p className="font-serif font-bold text-base text-[#E83D6F]">
                  {generatedResult.birthdayHeadline}
                </p>
                <p className="italic leading-relaxed">{generatedResult.birthdayMessage}</p>
              </div>
            )}

            {promptType === 'story-intro' && (
              <div className="space-y-2 text-xs sm:text-sm text-[#6D3046] font-serif italic">
                <p>"{generatedResult.part1}"</p>
                <p className="font-bold text-[#E83D6F]">"{generatedResult.part2}"</p>
              </div>
            )}

            {promptType === 'why-reasons' && Array.isArray(generatedResult.reasons) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {generatedResult.reasons.map((r: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white border border-[#FFD5DD]">
                    <p className="font-bold text-[#6D3046]">{r.title}</p>
                    <p className="text-[11px] text-[#E83D6F] italic">{r.subtitle}</p>
                    <p className="text-[11px] text-[#9E5870] mt-1">{r.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#FFD5DD]/40">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#FFD5DD] text-[#6D3046] text-xs font-semibold hover:bg-[#FFF0F2] flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Another</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onApply(generatedResult);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-[#E83D6F] text-white text-xs font-bold shadow-md hover:bg-[#F45B82] flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply to Story</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
