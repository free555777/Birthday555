import React, { useState } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { SiteConfig } from '../types';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onSave: (newConfig: Partial<SiteConfig>) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [partnerName, setPartnerName] = useState(config.partnerName);
  const [birthdayHeadline, setBirthdayHeadline] = useState(config.birthdayHeadline);
  const [birthdayMessage, setBirthdayMessage] = useState(config.birthdayMessage);
  const [musicUrl, setMusicUrl] = useState(config.musicUrl || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      partnerName: partnerName.trim() || 'My Love',
      birthdayHeadline: birthdayHeadline.trim(),
      birthdayMessage: birthdayMessage.trim(),
      musicUrl: musicUrl.trim(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-[#FFF0F2]/85 backdrop-blur-xl select-none"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl card-romantic border border-[#FFD5DD] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#FFD5DD] mb-5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#E83D6F]" />
            <h3 className="font-serif text-xl font-bold text-[#6D3046]">
              Personalize Her Story
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#FFD5DD] flex items-center justify-center text-[#6D3046] hover:text-[#E83D6F] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-[#E83D6F] font-semibold mb-1">
              Her Name
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="e.g. Maya, Sophia, Emma..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FFD5DD] text-[#6D3046] placeholder-[#9B6577]/50 focus:outline-none focus:border-[#E83D6F]"
            />
          </div>

          <div>
            <label className="block text-[#E83D6F] font-semibold mb-1">
              Birthday Headline
            </label>
            <input
              type="text"
              value={birthdayHeadline}
              onChange={(e) => setBirthdayHeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FFD5DD] text-[#6D3046] placeholder-[#9B6577]/50 focus:outline-none focus:border-[#E83D6F]"
            />
          </div>

          <div>
            <label className="block text-[#E83D6F] font-semibold mb-1">
              Birthday Wish Message
            </label>
            <textarea
              rows={3}
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FFD5DD] text-[#6D3046] placeholder-[#9B6577]/50 focus:outline-none focus:border-[#E83D6F]"
            />
          </div>

          <div>
            <label className="block text-[#E83D6F] font-semibold mb-1">
              Custom Song URL (Optional MP3)
            </label>
            <input
              type="url"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              placeholder="Leave empty for synthesized acoustic romantic piano"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FFD5DD] text-[#6D3046] placeholder-[#9B6577]/50 focus:outline-none focus:border-[#E83D6F]"
            />
            <span className="text-[10px] text-[#9B6577] block mt-1">
              By default, an atmospheric romantic piano synthesizer plays automatically without needing an external link!
            </span>
          </div>

          <div className="pt-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-romantic-secondary px-4 py-2 rounded-full font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-romantic-primary px-6 py-2 rounded-full font-medium flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Apply Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
