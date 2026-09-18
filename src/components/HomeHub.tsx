import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Plus, ExternalLink, Edit3, Trash2, Share2, Check, Cake, Eye } from 'lucide-react';
import { createWebsiteStory } from '../utils/api';
import { getStoredStories, saveStoryReference, removeStoryReference } from '../utils/storage';
import { StoredStoryReference, RelationshipType } from '../types';

interface HomeHubProps {
  onNavigate: (route: string) => void;
}

const RELATIONSHIPS: { label: string; value: RelationshipType; icon: string }[] = [
  { label: 'Dating', value: 'Dating', icon: '♡' },
  { label: 'Engaged', value: 'Engaged', icon: '◇' },
  { label: 'Married', value: 'Married', icon: '⌂' },
  { label: 'Seeing Someone', value: 'Seeing Someone', icon: '✦' },
  { label: 'Friend', value: 'Friend', icon: '☺' },
  { label: 'Family & Loved One', value: 'Other', icon: '❀' },
];

export const HomeHub: React.FC<HomeHubProps> = ({ onNavigate }) => {
  const [recipientName, setRecipientName] = useState('');
  const [nickname, setNickname] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('Dating');
  const [birthdayDate, setBirthdayDate] = useState('');
  const [birthYearKnown, setBirthYearKnown] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedStories, setStoredStories] = useState<StoredStoryReference[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setStoredStories(getStoredStories());
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setError('Please enter the name of the person this surprise is for ♡');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      const res = await createWebsiteStory({
        recipientName: recipientName.trim(),
        nickname: nickname.trim() || recipientName.trim(),
        relationship,
        birthdayDate,
        birthYearKnown,
      });

      // Save to local storage for quick access
      saveStoryReference({
        id: res.id,
        editorToken: res.editorToken,
        publicSlug: res.publicSlug,
        recipientName: res.story.recipientInfo.recipientName,
        relationship: res.story.recipientInfo.relationship,
        isPublished: false,
        updatedAt: new Date().toISOString(),
      });

      // Navigate to the editor
      onNavigate(`/edit/${res.editorToken}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create story. Please try again.');
      setIsCreating(false);
    }
  };

  const handleDeleteStory = (id: string, editorToken: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this story from your device list?')) {
      removeStoryReference(id || editorToken);
      setStoredStories(getStoredStories());
    }
  };

  const handleCopyLink = (slug: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/love/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF0F2] text-[#6D3046] flex flex-col justify-between overflow-y-auto px-4 py-8 sm:py-12 relative selection:bg-[#F45B82] selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#FFE4E8]/60 to-[#FFD5DD]/40 blur-3xl opacity-70" />
        <div className="absolute bottom-[-10%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#FFCAD4]/50 to-[#FFE4E8]/30 blur-3xl opacity-60" />
      </div>

      <div className="max-w-3xl w-full mx-auto relative z-10 flex-1 flex flex-col items-center">
        {/* Top Brand & Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#FFD5DD] shadow-sm mb-4">
            <Sparkles className="w-4 h-4 text-[#E83D6F]" />
            <span className="text-xs font-semibold text-[#6D3046] tracking-wide uppercase">
              Romantic Story Creator
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#6D3046] tracking-tight leading-tight mb-3">
            Create A Romantic Birthday Surprise
          </h1>
          <p className="text-sm sm:text-base text-[#9E5870] max-w-lg mx-auto font-sans leading-relaxed">
            Craft an enchanting, mobile-app-like interactive website with love letters, photos, milestones, and a blowable birthday candle. No login required.
          </p>
        </div>

        {/* Creator Card */}
        <div className="w-full card-romantic rounded-3xl p-6 sm:p-8 border border-[#FFD5DD] shadow-xl bg-white/90 backdrop-blur-md mb-8">
          <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-[#FFD5DD]/60">
            <Heart className="w-5 h-5 text-[#E83D6F] fill-[#E83D6F]" />
            <h2 className="font-serif text-xl font-bold text-[#6D3046]">
              Start A New Surprise Story
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-6">
            {/* Recipient Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                Who is this surprise for? <span className="text-[#E83D6F]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Maya, Rahul, Sophia, My Sweetheart..."
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] placeholder-[#C48B9F] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30 focus:border-[#E83D6F] transition-all"
                  required
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-[#C48B9F]">
                  {recipientName.length}/100
                </span>
              </div>
            </div>

            {/* Nickname & Relationship Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                  Sweet Nickname <span className="text-xs font-normal text-[#9E5870]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. My Whole Universe, Sunshine, Baby"
                  maxLength={50}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] placeholder-[#C48B9F] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30 focus:border-[#E83D6F] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                  Birthday Date <span className="text-xs font-normal text-[#9E5870]">(optional)</span>
                </label>
                <input
                  type={birthYearKnown ? 'date' : 'text'}
                  value={birthdayDate}
                  onChange={(e) => setBirthdayDate(e.target.value)}
                  placeholder={!birthYearKnown ? 'e.g. September 18' : ''}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] placeholder-[#C48B9F] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30 focus:border-[#E83D6F] transition-all"
                />
                <label className="mt-1.5 flex items-center space-x-2 text-xs text-[#9E5870] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!birthYearKnown}
                    onChange={(e) => {
                      setBirthYearKnown(!e.target.checked);
                      setBirthdayDate('');
                    }}
                    className="rounded border-[#FFD5DD] text-[#E83D6F] focus:ring-[#E83D6F]"
                  />
                  <span>I don't know the exact birth year</span>
                </label>
              </div>
            </div>

            {/* Relationship Pills */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-2">
                Relationship
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {RELATIONSHIPS.map((rel) => (
                  <button
                    key={rel.value}
                    type="button"
                    onClick={() => setRelationship(rel.value)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      relationship === rel.value
                        ? 'bg-[#E83D6F] text-white border-[#E83D6F] shadow-sm font-semibold'
                        : 'bg-[#FFF5F7] text-[#6D3046] border-[#FFD5DD] hover:border-[#E83D6F]/60'
                    }`}
                  >
                    <span>{rel.icon}</span>
                    <span>{rel.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F45B82] to-[#E83D6F] text-white font-serif font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Preparing Your Surprise Studio...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Start Creating Story →</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* My Created Stories List */}
        {storedStories.length > 0 && (
          <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-serif text-lg font-bold text-[#6D3046] flex items-center space-x-2">
                <span>My Stories on this Device</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FFE4E8] text-xs font-sans text-[#E83D6F]">
                  {storedStories.length}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {storedStories.map((s) => (
                <div
                  key={s.id || s.editorToken}
                  onClick={() => onNavigate(`/edit/${s.editorToken}`)}
                  className="card-romantic rounded-2xl p-4 border border-[#FFD5DD] bg-white/80 hover:bg-white transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#6D3046] group-hover:text-[#E83D6F] transition-colors">
                        For {s.recipientName}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-[#9E5870] mt-0.5">
                        <span>{s.relationship || 'Love Story'}</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-semibold ${
                            s.isPublished
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {s.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteStory(s.id, s.editorToken, e)}
                      className="p-1.5 rounded-lg text-[#C48B9F] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#FFD5DD]/40 text-xs font-semibold">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/edit/${s.editorToken}`);
                      }}
                      className="text-[#E83D6F] flex items-center space-x-1 hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit & Customize</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleCopyLink(s.publicSlug, s.id, e)}
                        className="px-2.5 py-1 rounded-lg bg-[#FFF0F2] hover:bg-[#FFE4E8] text-[#6D3046] border border-[#FFD5DD] flex items-center space-x-1"
                        title="Copy public link"
                      >
                        {copiedId === s.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 text-[11px]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3 text-[#E83D6F]" />
                            <span className="text-[11px]">Share</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/love/${s.publicSlug}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FFF5F7] text-[#6D3046] border border-[#FFD5DD] flex items-center space-x-1"
                        title="View public website"
                      >
                        <Eye className="w-3 h-3 text-[#6D3046]" />
                        <span className="text-[11px]">View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Try Live Sample Demo Button */}
        <div className="w-full text-center mt-2 mb-6">
          <button
            onClick={() => onNavigate('/love/maya-birthday')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/80 border border-[#FFD5DD] text-[#6D3046] hover:text-[#E83D6F] hover:border-[#E83D6F]/40 shadow-sm transition-all text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <Cake className="w-4 h-4 text-[#E83D6F]" />
            <span>View Sample Romantic Experience (Maya's Birthday) →</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-[#9E5870]/80 pt-6 pb-2 relative z-10 border-t border-[#FFD5DD]/40">
        <p className="font-serif italic">
          "Crafted with love and starlight for the moments that take your breath away."
        </p>
      </footer>
    </div>
  );
};
