import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Save,
  Check,
  Eye,
  Settings,
  Share2,
  Lock,
  Unlock,
  Upload,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Music,
  Cake,
  Flame,
  Volume2,
  VolumeX,
  Copy,
  ExternalLink,
  Wand2,
  Calendar,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Sliders,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { WebsiteStory, SiteConfig, RelationshipType, MemoryItem, TimelineMilestone, ExtraordinaryReason, LoveLetterItem } from '../../types';
import { updateEditorStory, publishEditorStory, deleteEditorStory } from '../../utils/api';
import { saveStoryReference, removeStoryReference } from '../../utils/storage';
import { AIGeneratorModal } from './AIGeneratorModal';
import { AppShell } from '../AppShell';
import { audioEngine } from '../../utils/audio';

interface EditorWizardProps {
  story: WebsiteStory;
  onStoryUpdated: (updatedStory: WebsiteStory) => void;
  onNavigate: (route: string) => void;
}

const WIZARD_STEPS = [
  { id: 'recipient', title: 'Who is this for?', icon: 'Heart', desc: 'Name, date & relationship' },
  { id: 'messages', title: 'Romantic Letters & Words', icon: 'Sparkles', desc: 'Love letter, birthday wish & intro' },
  { id: 'photos', title: 'Shared Photo Moments', icon: 'ImageIcon', desc: 'Upload memories & captions' },
  { id: 'song', title: 'Our Special Song', icon: 'Music', desc: 'Soundtrack, audio & melody' },
  { id: 'timeline', title: 'Secret Timeline', icon: 'Clock', desc: 'Milestones through the years' },
  { id: 'reasons', title: 'Why You Are Extraordinary', icon: 'Flame', desc: '6 heartfelt reasons & compliments' },
  { id: 'celebration', title: 'Candle & Celebration', icon: 'Cake', desc: 'Candle, fireworks & finale message' },
  { id: 'privacy', title: 'Privacy & Publish', icon: 'Globe', desc: 'Password gate & live link' },
];

const RELATIONSHIPS: { label: string; value: RelationshipType; icon: string }[] = [
  { label: 'Dating', value: 'Dating', icon: '♡' },
  { label: 'Engaged', value: 'Engaged', icon: '◇' },
  { label: 'Married', value: 'Married', icon: '⌂' },
  { label: 'Seeing Someone', value: 'Seeing Someone', icon: '✦' },
  { label: 'Friend', value: 'Friend', icon: '☺' },
  { label: 'Mother', value: 'Mother', icon: '❀' },
  { label: 'Father', value: 'Father', icon: '❀' },
  { label: 'Sibling', value: 'Sibling', icon: '❀' },
  { label: 'Other', value: 'Other', icon: '♥' },
];

export const EditorWizard: React.FC<EditorWizardProps> = ({ story, onStoryUpdated, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<SiteConfig>(story.config);
  const [recipientInfo, setRecipientInfo] = useState(story.recipientInfo);
  const [celebrationSettings, setCelebrationSettings] = useState(story.celebrationSettings);
  const [security, setSecurity] = useState(story.security || { isPasswordProtected: false, hasEditorPassword: false });
  const [publicSlug, setPublicSlug] = useState(story.publicSlug);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessModal, setPublishSuccessModal] = useState(false);
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEditorLink, setCopiedEditorLink] = useState(false);

  // View state: 'wizard' vs 'live-preview' vs 'split'
  const [viewMode, setViewMode] = useState<'wizard' | 'preview'>('wizard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // AI Modal
  const [aiModalType, setAiModalType] = useState<'love-letter' | 'birthday-wish' | 'story-intro' | 'why-reasons' | null>(null);

  // Debounced Autosave
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAutosave = (
    newConfig = config,
    newRecipient = recipientInfo,
    newCeleb = celebrationSettings,
    newSec = security,
    newSlug = publicSlug
  ) => {
    setSaveStatus('saving');
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        const res = await updateEditorStory(story.editorToken, {
          config: newConfig,
          recipientInfo: newRecipient,
          celebrationSettings: newCeleb,
          security: newSec,
          publicSlug: newSlug,
        });
        setSaveStatus('saved');
        onStoryUpdated(res.story);
        // Also update local storage reference
        saveStoryReference({
          id: res.story.id,
          editorToken: res.story.editorToken,
          publicSlug: res.story.publicSlug,
          recipientName: res.story.recipientInfo.recipientName,
          relationship: res.story.recipientInfo.relationship,
          isPublished: res.story.isPublished,
          updatedAt: res.story.updatedAt,
        });
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (e) {
        console.warn('Autosave error:', e);
        setSaveStatus('idle');
      }
    }, 800);
  };

  // Helper updates
  const updateConfig = (updates: Partial<SiteConfig>) => {
    const updated = { ...config, ...updates };
    setConfig(updated);
    triggerAutosave(updated, recipientInfo, celebrationSettings, security, publicSlug);
  };

  const updateRecipient = (updates: Partial<typeof recipientInfo>) => {
    const updated = { ...recipientInfo, ...updates };
    setRecipientInfo(updated);
    // If name changes, update partnerName in config as well
    if (updates.recipientName !== undefined) {
      const updatedConf = { ...config, partnerName: updates.recipientName };
      setConfig(updatedConf);
      triggerAutosave(updatedConf, updated, celebrationSettings, security, publicSlug);
    } else {
      triggerAutosave(config, updated, celebrationSettings, security, publicSlug);
    }
  };

  const updateCelebration = (updates: Partial<typeof celebrationSettings>) => {
    const updated = { ...celebrationSettings, ...updates };
    setCelebrationSettings(updated);
    triggerAutosave(config, recipientInfo, updated, security, publicSlug);
  };

  const updateSecurity = (updates: Partial<typeof security>) => {
    const updated = { ...security, ...updates };
    setSecurity(updated);
    triggerAutosave(config, recipientInfo, celebrationSettings, updated, publicSlug);
  };

  // Handle Publish
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const res = await publishEditorStory(story.editorToken);
      onStoryUpdated(res.story);
      saveStoryReference({
        id: res.story.id,
        editorToken: res.story.editorToken,
        publicSlug: res.story.publicSlug,
        recipientName: res.story.recipientInfo.recipientName,
        relationship: res.story.recipientInfo.relationship,
        isPublished: true,
        updatedAt: res.story.updatedAt,
      });
      setShowConfirmPublish(false);
      setPublishSuccessModal(true);
    } catch (err: any) {
      alert(err.message || 'Failed to publish story');
    } finally {
      setIsPublishing(false);
    }
  };

  // Photo Upload Handler (Supports drag/drop and file selector with size compression)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const result = uploadEvent.target?.result as string;
          if (result) {
            const currentMemories = config.memories || [];
            if (currentMemories.length >= 20) {
              alert('You can add up to 20 photo moments ♡');
              return;
            }
            const newMemory: MemoryItem = {
              id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              title: file.name.replace(/\.[^/.]+$/, ''),
              date: 'Our Special Moment',
              location: 'Wherever we are',
              description: 'One of my absolute favorite memories with you.',
              imageUrl: result,
              tag: 'Moments',
            };
            const updatedMemories = [...currentMemories, newMemory];
            updateConfig({ memories: updatedMemories });
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Audio Upload Handler
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          updateConfig({
            musicUrl: result,
            musicTitle: file.name.replace(/\.[^/.]+$/, ''),
            musicArtist: 'Our Custom Track ♡',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Web Share or Copy Link
  const publicUrl = `${window.location.origin}/love/${publicSlug}`;
  const editorUrl = `${window.location.origin}/edit/${story.editorToken}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `A Birthday Surprise For ${recipientInfo.recipientName} ♡`,
          text: `I made something special for you. Open your surprise here:`,
          url: publicUrl,
        });
      } catch (err) {
        // Fallback to copy
        copyPublicLink();
      }
    } else {
      copyPublicLink();
    }
  };

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyEditorLink = () => {
    navigator.clipboard.writeText(editorUrl);
    setCopiedEditorLink(true);
    setTimeout(() => setCopiedEditorLink(false), 2500);
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#FFF0F2] text-[#6D3046] flex flex-col justify-between overflow-hidden selection:bg-[#F45B82] selection:text-white">
      {/* Top Application Bar */}
      <header className="w-full px-4 sm:px-8 py-3 bg-white/80 backdrop-blur-md border-b border-[#FFD5DD] flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('/')}
            className="p-2 rounded-full hover:bg-[#FFF0F2] text-[#6D3046] hover:text-[#E83D6F] transition-colors border border-transparent hover:border-[#FFD5DD] cursor-pointer"
            title="Back to My Stories"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif font-bold text-sm sm:text-base text-[#6D3046]">
                Editing Story for {recipientInfo.recipientName || 'My Love'}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  story.isPublished
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {story.isPublished ? 'Live' : 'Draft'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-[#9E5870]">
              {saveStatus === 'saving' && (
                <span className="flex items-center space-x-1 text-[#E83D6F]">
                  <div className="w-2.5 h-2.5 border-2 border-[#E83D6F] border-t-transparent rounded-full animate-spin" />
                  <span>Autosaving...</span>
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center space-x-1 text-emerald-600">
                  <Check className="w-3 h-3" />
                  <span>Saved ✓</span>
                </span>
              )}
              {saveStatus === 'idle' && <span>Autosaved to your private link</span>}
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Primary Actions */}
        <div className="flex items-center space-x-2">
          {/* View Mode Switcher */}
          <div className="hidden sm:flex p-1 bg-[#FFF5F7] border border-[#FFD5DD] rounded-2xl">
            <button
              onClick={() => setViewMode('wizard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'wizard'
                  ? 'bg-white text-[#E83D6F] shadow-sm'
                  : 'text-[#6D3046] hover:text-[#E83D6F]'
              }`}
            >
              Step-by-Step Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white text-[#E83D6F] shadow-sm'
                  : 'text-[#6D3046] hover:text-[#E83D6F]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live App Preview</span>
            </button>
          </div>

          {/* Settings Toggle (gear) */}
          <button
            onClick={() => setViewMode(viewMode === 'preview' ? 'wizard' : 'preview')}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] hover:text-[#E83D6F] text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            title="Toggle Editor / Live Preview"
          >
            {viewMode === 'wizard' ? (
              <>
                <Eye className="w-4 h-4 text-[#E83D6F]" />
                <span className="hidden md:inline">Preview App</span>
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 text-[#E83D6F]" />
                <span className="hidden md:inline">Open Editor</span>
              </>
            )}
          </button>

          {/* Publish / Share Button */}
          <button
            onClick={() => setShowConfirmPublish(true)}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#F45B82] to-[#E83D6F] text-white font-serif font-bold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{story.isPublished ? 'Update Live Story' : 'Publish Story'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex">
        {/* IF PREVIEW MODE: Show the full interactive romantic 9-screen experience */}
        {viewMode === 'preview' ? (
          <div className="w-full h-full relative">
            <AppShell
              config={config}
              onOpenSettings={() => setViewMode('wizard')}
            />
          </div>
        ) : (
          /* IF WIZARD MODE: Show Step-by-Step App-Like Wizard */
          <div className="w-full h-full overflow-y-auto px-4 py-6 sm:py-8">
            <div className="max-w-3xl mx-auto">
              
              {/* Wizard Step Navigation Pills */}
              <div className="mb-6 overflow-x-auto no-scrollbar pb-1">
                <div className="flex items-center space-x-2 min-w-max">
                  {WIZARD_STEPS.map((step, idx) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(idx)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-medium border flex items-center space-x-2 transition-all cursor-pointer ${
                        currentStep === idx
                          ? 'bg-[#E83D6F] text-white border-[#E83D6F] shadow-sm font-semibold'
                          : 'bg-white/80 text-[#6D3046] border-[#FFD5DD] hover:border-[#E83D6F]/40'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wizard Active Card */}
              <div className="card-romantic rounded-3xl p-6 sm:p-8 border border-[#FFD5DD] shadow-xl bg-white/95 relative">
                
                {/* Step Title Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#FFD5DD]/60">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-[#E83D6F] uppercase">
                      Step {currentStep + 1} of {WIZARD_STEPS.length}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#6D3046]">
                      {WIZARD_STEPS[currentStep].title}
                    </h2>
                    <p className="text-xs text-[#9E5870] mt-0.5">
                      {WIZARD_STEPS[currentStep].desc}
                    </p>
                  </div>

                  {/* Quick AI Help for relevant steps */}
                  {(currentStep === 1 || currentStep === 5 || currentStep === 6) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (currentStep === 1) setAiModalType('love-letter');
                        else if (currentStep === 5) setAiModalType('why-reasons');
                        else if (currentStep === 6) setAiModalType('birthday-wish');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFF0F2] to-[#FFE4E8] text-[#E83D6F] border border-[#FFD5DD] text-xs font-bold hover:border-[#E83D6F] flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E83D6F]" />
                      <span>Generate with AI ✨</span>
                    </button>
                  )}
                </div>

                {/* STEP 1: Who is this for? */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                        Recipient Name <span className="text-[#E83D6F]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={recipientInfo.recipientName}
                          onChange={(e) => updateRecipient({ recipientName: e.target.value })}
                          placeholder="e.g. Maya, Sophia, Rahul..."
                          maxLength={150}
                          className="w-full px-4 py-3 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30 focus:border-[#E83D6F]"
                        />
                        <span className="absolute right-3.5 top-3.5 text-xs text-[#C48B9F]">
                          {(recipientInfo.recipientName || '').length}/150
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                          Sweet Nickname <span className="text-xs font-normal text-[#9E5870]">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={recipientInfo.nickname || ''}
                          onChange={(e) => {
                            updateRecipient({ nickname: e.target.value });
                            updateConfig({ nickname: e.target.value });
                          }}
                          placeholder="e.g. My Whole World, Angel, Sunshine"
                          maxLength={50}
                          className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30 focus:border-[#E83D6F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                          Birthday Date
                        </label>
                        <input
                          type={recipientInfo.birthYearKnown ? 'date' : 'text'}
                          value={recipientInfo.birthdayDate || ''}
                          onChange={(e) => updateRecipient({ birthdayDate: e.target.value })}
                          placeholder={!recipientInfo.birthYearKnown ? 'e.g. September 18' : ''}
                          className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30 focus:border-[#E83D6F]"
                        />
                        <label className="mt-1.5 flex items-center space-x-2 text-xs text-[#9E5870] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!recipientInfo.birthYearKnown}
                            onChange={(e) => updateRecipient({ birthYearKnown: !e.target.checked })}
                            className="rounded border-[#FFD5DD] text-[#E83D6F] focus:ring-[#E83D6F]"
                          />
                          <span>I don't know the exact birth year</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-2">
                        Relationship
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {RELATIONSHIPS.map((rel) => (
                          <button
                            key={rel.value}
                            type="button"
                            onClick={() => updateRecipient({ relationship: rel.value })}
                            className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium border flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                              recipientInfo.relationship === rel.value
                                ? 'bg-[#E83D6F] text-white border-[#E83D6F] shadow-sm font-semibold'
                                : 'bg-[#FFF5F7] text-[#6D3046] border-[#FFD5DD] hover:border-[#E83D6F]/40'
                            }`}
                          >
                            <span>{rel.icon}</span>
                            <span>{rel.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Romantic Letters & Messages */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    {/* Main Love Letter */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs sm:text-sm font-semibold text-[#6D3046]">
                          Your Main Love Letter / Message
                        </label>
                        <button
                          type="button"
                          onClick={() => setAiModalType('love-letter')}
                          className="text-xs text-[#E83D6F] font-semibold hover:underline flex items-center space-x-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Letter Writer</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.loveLetterSalutation || ''}
                          onChange={(e) => updateConfig({ loveLetterSalutation: e.target.value })}
                          placeholder="e.g. Dearest Maya,"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] font-serif font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30"
                        />

                        <textarea
                          value={Array.isArray(config.loveLetterBody) ? config.loveLetterBody.join('\n\n') : ''}
                          onChange={(e) => updateConfig({ loveLetterBody: e.target.value.split('\n\n').filter(Boolean) })}
                          rows={6}
                          placeholder="Write your heartfelt message here (separate paragraphs with blank lines)..."
                          className="w-full px-4 py-3 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] text-xs sm:text-sm font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30"
                        />

                        <input
                          type="text"
                          value={config.loveLetterSignoff || ''}
                          onChange={(e) => updateConfig({ loveLetterSignoff: e.target.value })}
                          placeholder="e.g. Forever & Always Yours, ❤️"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] font-serif font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30"
                        />
                      </div>
                    </div>

                    {/* Birthday Headline & Wish */}
                    <div className="pt-4 border-t border-[#FFD5DD]/40">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs sm:text-sm font-semibold text-[#6D3046]">
                          Birthday Headline & Celebration Wish
                        </label>
                        <button
                          type="button"
                          onClick={() => setAiModalType('birthday-wish')}
                          className="text-xs text-[#E83D6F] font-semibold hover:underline flex items-center space-x-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Wish Generator</span>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={config.birthdayHeadline || ''}
                        onChange={(e) => updateConfig({ birthdayHeadline: e.target.value })}
                        placeholder="e.g. Happy Birthday, My Whole World"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] font-serif font-bold text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30"
                      />

                      <textarea
                        value={config.birthdayMessage || ''}
                        onChange={(e) => updateConfig({ birthdayMessage: e.target.value })}
                        rows={2}
                        placeholder="May every star in this sky remind you of how deeply you are loved..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-[#6D3046] text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#E83D6F]/30"
                      />
                    </div>

                    {/* Poetic Intro */}
                    <div className="pt-4 border-t border-[#FFD5DD]/40">
                      <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                        Story Opening Thought
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.storyIntroPart1 || ''}
                          onChange={(e) => updateConfig({ storyIntroPart1: e.target.value })}
                          placeholder="Some people enter your life..."
                          className="w-full px-3.5 py-2 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs text-[#6D3046]"
                        />
                        <input
                          type="text"
                          value={config.storyIntroPart2 || ''}
                          onChange={(e) => updateConfig({ storyIntroPart2: e.target.value })}
                          placeholder="...and turn ordinary moments into magic."
                          className="w-full px-3.5 py-2 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs text-[#6D3046]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Photos */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Upload Drop Area */}
                    <div className="border-2 border-dashed border-[#FFD5DD] hover:border-[#E83D6F] rounded-3xl p-6 sm:p-8 text-center bg-[#FFF5F7]/60 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="photo-upload-input"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <label htmlFor="photo-upload-input" className="cursor-pointer flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white border border-[#FFD5DD] flex items-center justify-center text-[#E83D6F] shadow-sm mb-3">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="font-serif font-bold text-sm sm:text-base text-[#6D3046]">
                          Click to upload or drag & drop photos
                        </span>
                        <span className="text-xs text-[#9E5870] mt-1">
                          PNG, JPG, WEBP (Add up to 20 romantic photos)
                        </span>
                      </label>
                    </div>

                    {/* Photos Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#6D3046]">
                          Your Added Photos ({(config.memories || []).length}/20)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto no-scrollbar p-1">
                        {(config.memories || []).map((m, index) => (
                          <div
                            key={m.id}
                            className="p-3 rounded-2xl bg-white border border-[#FFD5DD] shadow-sm flex items-start space-x-3 group"
                          >
                            <img
                              src={m.imageUrl}
                              alt={m.title}
                              className="w-20 h-20 rounded-xl object-cover border border-[#FFD5DD] flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={m.title}
                                onChange={(e) => {
                                  const updated = [...(config.memories || [])];
                                  updated[index].title = e.target.value;
                                  updateConfig({ memories: updated });
                                }}
                                placeholder="Photo Title / Location"
                                className="w-full text-xs font-bold text-[#6D3046] border-b border-transparent focus:border-[#E83D6F] bg-transparent focus:outline-none"
                              />
                              <input
                                type="text"
                                value={m.description}
                                onChange={(e) => {
                                  const updated = [...(config.memories || [])];
                                  updated[index].description = e.target.value;
                                  updateConfig({ memories: updated });
                                }}
                                placeholder="Caption or sweet note..."
                                className="w-full text-[11px] text-[#9E5870] border-b border-transparent focus:border-[#E83D6F] bg-transparent focus:outline-none mt-1"
                              />
                              <div className="flex items-center space-x-2 mt-2">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...(config.memories || [])];
                                      const temp = updated[index];
                                      updated[index] = updated[index - 1];
                                      updated[index - 1] = temp;
                                      updateConfig({ memories: updated });
                                    }}
                                    className="p-1 rounded bg-[#FFF0F2] text-[#6D3046] hover:text-[#E83D6F]"
                                    title="Move up"
                                  >
                                    <MoveUp className="w-3 h-3" />
                                  </button>
                                )}
                                {index < (config.memories || []).length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...(config.memories || [])];
                                      const temp = updated[index];
                                      updated[index] = updated[index + 1];
                                      updated[index + 1] = temp;
                                      updateConfig({ memories: updated });
                                    }}
                                    className="p-1 rounded bg-[#FFF0F2] text-[#6D3046] hover:text-[#E83D6F]"
                                    title="Move down"
                                  >
                                    <MoveDown className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (config.memories || []).filter((_, i) => i !== index);
                                    updateConfig({ memories: updated });
                                  }}
                                  className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
                                  title="Delete photo"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Our Song */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                        Song Title & Artist
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={config.musicTitle || ''}
                          onChange={(e) => updateConfig({ musicTitle: e.target.value })}
                          placeholder="e.g. Our Song ♡"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs sm:text-sm text-[#6D3046] font-medium"
                        />
                        <input
                          type="text"
                          value={config.musicArtist || ''}
                          onChange={(e) => updateConfig({ musicArtist: e.target.value })}
                          placeholder="e.g. Taylor Swift / Acoustic Piano"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs sm:text-sm text-[#6D3046] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                        Upload Custom MP3 Audio File or Enter Audio URL
                      </label>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.musicUrl || ''}
                          onChange={(e) => updateConfig({ musicUrl: e.target.value })}
                          placeholder="Direct audio URL (e.g. https://.../song.mp3) or leave empty for built-in acoustic piano"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs text-[#6D3046]"
                        />

                        <div className="flex items-center space-x-3">
                          <input
                            type="file"
                            accept="audio/*"
                            id="audio-upload-input"
                            onChange={handleAudioUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="audio-upload-input"
                            className="px-4 py-2 rounded-xl bg-white border border-[#FFD5DD] text-[#6D3046] hover:text-[#E83D6F] text-xs font-semibold flex items-center space-x-2 cursor-pointer shadow-sm"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload MP3 Audio File</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => audioEngine.togglePlay(config.musicUrl)}
                            className="px-4 py-2 rounded-xl bg-[#E83D6F] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Test Live Audio Preview</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs text-[#9E5870]">
                      <p className="font-bold text-[#6D3046] mb-1 flex items-center space-x-1">
                        <Music className="w-3.5 h-3.5 text-[#E83D6F]" />
                        <span>Built-in Acoustic Romance Synthesizer</span>
                      </p>
                      <p>
                        If no audio URL is provided, the site automatically generates an enchanting Web Audio ambient acoustic piano chord progression in 432Hz.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 5: Timeline */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#6D3046]">
                        Milestone Timeline Moments ({(config.timeline || []).length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newMilestone: TimelineMilestone = {
                            year: String(new Date().getFullYear()),
                            title: 'A Beautiful Memory',
                            subtitle: 'Our shared chapter',
                            description: 'The story we wrote together with laughter and joy.',
                            date: 'Present Day',
                            location: 'Everywhere with you',
                            imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
                          };
                          updateConfig({ timeline: [...(config.timeline || []), newMilestone] });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#E83D6F] text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Milestone</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[420px] overflow-y-auto no-scrollbar">
                      {(config.timeline || []).map((t, index) => (
                        <div key={index} className="p-4 rounded-2xl bg-white border border-[#FFD5DD] shadow-sm space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={t.year}
                              onChange={(e) => {
                                const updated = [...(config.timeline || [])];
                                updated[index].year = e.target.value;
                                updateConfig({ timeline: updated });
                              }}
                              placeholder="Year (e.g. 2024)"
                              className="px-3 py-1.5 rounded-lg bg-[#FFF5F7] border border-[#FFD5DD] text-xs font-bold text-[#E83D6F]"
                            />
                            <input
                              type="text"
                              value={t.title}
                              onChange={(e) => {
                                const updated = [...(config.timeline || [])];
                                updated[index].title = e.target.value;
                                updateConfig({ timeline: updated });
                              }}
                              placeholder="Milestone Title"
                              className="col-span-2 px-3 py-1.5 rounded-lg bg-[#FFF5F7] border border-[#FFD5DD] text-xs font-bold text-[#6D3046]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={t.date}
                              onChange={(e) => {
                                const updated = [...(config.timeline || [])];
                                updated[index].date = e.target.value;
                                updateConfig({ timeline: updated });
                              }}
                              placeholder="Date tag (e.g. September 2024)"
                              className="px-3 py-1.5 rounded-lg bg-[#FFF5F7] border border-[#FFD5DD] text-xs text-[#9E5870]"
                            />
                            <input
                              type="text"
                              value={t.location}
                              onChange={(e) => {
                                const updated = [...(config.timeline || [])];
                                updated[index].location = e.target.value;
                                updateConfig({ timeline: updated });
                              }}
                              placeholder="Location (e.g. Sunset Point)"
                              className="px-3 py-1.5 rounded-lg bg-[#FFF5F7] border border-[#FFD5DD] text-xs text-[#9E5870]"
                            />
                          </div>

                          <textarea
                            value={t.description}
                            onChange={(e) => {
                              const updated = [...(config.timeline || [])];
                              updated[index].description = e.target.value;
                              updateConfig({ timeline: updated });
                            }}
                            rows={2}
                            placeholder="Milestone memory description..."
                            className="w-full px-3 py-2 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs leading-relaxed text-[#6D3046]"
                          />

                          <div className="flex items-center justify-between pt-1">
                            <input
                              type="text"
                              value={t.imageUrl}
                              onChange={(e) => {
                                const updated = [...(config.timeline || [])];
                                updated[index].imageUrl = e.target.value;
                                updateConfig({ timeline: updated });
                              }}
                              placeholder="Image URL"
                              className="flex-1 mr-2 px-2.5 py-1 rounded bg-[#FFF5F7] border border-[#FFD5DD] text-[11px] text-[#9E5870]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (config.timeline || []).filter((_, i) => i !== index);
                                updateConfig({ timeline: updated });
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                              title="Delete milestone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Why You Are Extraordinary */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#9E5870]">
                        Customize the 6 reasons why {recipientInfo.recipientName || 'your love'} is one of a kind.
                      </p>
                      <button
                        type="button"
                        onClick={() => setAiModalType('why-reasons')}
                        className="text-xs text-[#E83D6F] font-semibold hover:underline flex items-center space-x-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Reasons Generator</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto no-scrollbar">
                      {(config.reasons || []).map((r, index) => (
                        <div key={r.id || index} className="p-3.5 rounded-2xl bg-white border border-[#FFD5DD] shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#E83D6F] bg-[#FFF0F2] px-2 py-0.5 rounded-full">
                              Reason {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={r.title}
                            onChange={(e) => {
                              const updated = [...(config.reasons || [])];
                              updated[index].title = e.target.value;
                              updateConfig({ reasons: updated });
                            }}
                            placeholder="Reason Title (e.g. Your Smile)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFF5F7] border border-[#FFD5DD] text-xs font-bold text-[#6D3046]"
                          />
                          <input
                            type="text"
                            value={r.subtitle}
                            onChange={(e) => {
                              const updated = [...(config.reasons || [])];
                              updated[index].subtitle = e.target.value;
                              updateConfig({ reasons: updated });
                            }}
                            placeholder="Subtitle (e.g. The sun after winter)"
                            className="w-full px-2.5 py-1 rounded-lg bg-[#FFF5F7] border border-[#FFD5DD] text-[11px] italic text-[#E83D6F]"
                          />
                          <textarea
                            value={r.description}
                            onChange={(e) => {
                              const updated = [...(config.reasons || [])];
                              updated[index].description = e.target.value;
                              updateConfig({ reasons: updated });
                            }}
                            rows={2}
                            placeholder="Heartfelt description..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FFF5F7] border border-[#FFD5DD] text-xs text-[#9E5870]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 7: Candle & Celebration */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    {/* Celebration Interactive Toggles */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#6D3046] mb-3">
                        Interactive Celebration Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="p-3.5 rounded-2xl bg-white border border-[#FFD5DD] flex items-center justify-between cursor-pointer hover:border-[#E83D6F]/60">
                          <div className="flex items-center space-x-2.5">
                            <Cake className="w-4 h-4 text-[#E83D6F]" />
                            <div>
                              <p className="text-xs font-bold text-[#6D3046]">Blowable Birthday Candle</p>
                              <p className="text-[11px] text-[#9E5870]">Mic-enabled or click-to-blow flame</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={celebrationSettings.enableCandle}
                            onChange={(e) => updateCelebration({ enableCandle: e.target.checked })}
                            className="rounded border-[#FFD5DD] text-[#E83D6F] focus:ring-[#E83D6F]"
                          />
                        </label>

                        <label className="p-3.5 rounded-2xl bg-white border border-[#FFD5DD] flex items-center justify-between cursor-pointer hover:border-[#E83D6F]/60">
                          <div className="flex items-center space-x-2.5">
                            <Sparkles className="w-4 h-4 text-[#E83D6F]" />
                            <div>
                              <p className="text-xs font-bold text-[#6D3046]">Celebration Confetti</p>
                              <p className="text-[11px] text-[#9E5870]">Explodes upon making a wish</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={celebrationSettings.enableConfetti}
                            onChange={(e) => updateCelebration({ enableConfetti: e.target.checked })}
                            className="rounded border-[#FFD5DD] text-[#E83D6F] focus:ring-[#E83D6F]"
                          />
                        </label>

                        <label className="p-3.5 rounded-2xl bg-white border border-[#FFD5DD] flex items-center justify-between cursor-pointer hover:border-[#E83D6F]/60">
                          <div className="flex items-center space-x-2.5">
                            <Flame className="w-4 h-4 text-[#E83D6F]" />
                            <div>
                              <p className="text-xs font-bold text-[#6D3046]">Starlit Fireworks</p>
                              <p className="text-[11px] text-[#9E5870]">Celebratory background sparkles</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={celebrationSettings.enableFireworks}
                            onChange={(e) => updateCelebration({ enableFireworks: e.target.checked })}
                            className="rounded border-[#FFD5DD] text-[#E83D6F] focus:ring-[#E83D6F]"
                          />
                        </label>

                        <label className="p-3.5 rounded-2xl bg-white border border-[#FFD5DD] flex items-center justify-between cursor-pointer hover:border-[#E83D6F]/60">
                          <div className="flex items-center space-x-2.5">
                            <Volume2 className="w-4 h-4 text-[#E83D6F]" />
                            <div>
                              <p className="text-xs font-bold text-[#6D3046]">Background Soundtrack</p>
                              <p className="text-[11px] text-[#9E5870]">Romantic audio playback</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={celebrationSettings.enableMusic}
                            onChange={(e) => updateCelebration({ enableMusic: e.target.checked })}
                            className="rounded border-[#FFD5DD] text-[#E83D6F] focus:ring-[#E83D6F]"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Finale Screen Messages */}
                    <div className="pt-4 border-t border-[#FFD5DD]/40">
                      <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-2">
                        Finale Love Statement
                      </label>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.finalQuote || ''}
                          onChange={(e) => updateConfig({ finalQuote: e.target.value })}
                          placeholder="And if I had to choose again..."
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs sm:text-sm font-serif font-bold text-[#6D3046]"
                        />
                        <input
                          type="text"
                          value={config.finalSubquote || ''}
                          onChange={(e) => updateConfig({ finalSubquote: e.target.value })}
                          placeholder="I'd still choose you. ♡"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs sm:text-sm font-serif text-[#E83D6F]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: Privacy & Publish */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    {/* Public URL Slug */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#6D3046] mb-1.5">
                        Public Share Link
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-[#9E5870] font-mono bg-[#FFF5F7] px-3 py-2.5 rounded-xl border border-[#FFD5DD]">
                          {window.location.origin}/love/
                        </span>
                        <input
                          type="text"
                          value={publicSlug}
                          onChange={(e) => setPublicSlug(e.target.value)}
                          onBlur={() => triggerAutosave(config, recipientInfo, celebrationSettings, security, publicSlug)}
                          placeholder="custom-slug"
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs sm:text-sm font-mono text-[#6D3046] font-semibold"
                        />
                      </div>
                    </div>

                    {/* Password Protection Gate */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {security.isPasswordProtected ? (
                            <Lock className="w-4 h-4 text-[#E83D6F]" />
                          ) : (
                            <Unlock className="w-4 h-4 text-[#9E5870]" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-[#6D3046]">Password Protection</p>
                            <p className="text-[11px] text-[#9E5870]">
                              Require a secret password before recipient can open the surprise
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={security.isPasswordProtected}
                          onChange={(e) => updateSecurity({ isPasswordProtected: e.target.checked })}
                          className="rounded border-[#FFD5DD] text-[#E83D6F] focus:ring-[#E83D6F]"
                        />
                      </div>

                      {security.isPasswordProtected && (
                        <div className="pt-2 border-t border-[#FFD5DD]/40 animate-fadeIn">
                          <label className="block text-xs font-semibold text-[#6D3046] mb-1">
                            Set Secret Password
                          </label>
                          <input
                            type="text"
                            value={security.publicPassword || ''}
                            onChange={(e) => updateSecurity({ publicPassword: e.target.value })}
                            placeholder="e.g. ouranniversary / 0918 / love123"
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#FFD5DD] text-xs font-medium text-[#6D3046]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Secret Private Editor Link Info */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#FFD5DD] space-y-2">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-xs font-bold text-[#6D3046]">Your Private Editor Link</h4>
                      </div>
                      <p className="text-[11px] text-[#9E5870]">
                        Save this secret link to edit or customize this surprise anytime. No password or login required.
                      </p>
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="text"
                          readOnly
                          value={editorUrl}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#FFF5F7] border border-[#FFD5DD] text-[11px] font-mono text-[#6D3046]"
                        />
                        <button
                          type="button"
                          onClick={copyEditorLink}
                          className="px-3 py-1.5 rounded-lg bg-[#E83D6F] text-white text-xs font-semibold flex items-center space-x-1"
                        >
                          {copiedEditorLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedEditorLink ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Big Publish Action Card */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPublish(true)}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F45B82] to-[#E83D6F] text-white font-serif font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Publish & Share Story With {recipientInfo.recipientName || 'My Love'} →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Wizard Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#FFD5DD]/60">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-4 py-2 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs font-semibold text-[#6D3046] hover:bg-[#FFE4E8] disabled:opacity-40 flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('preview')}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#FFD5DD] text-xs font-semibold text-[#E83D6F] hover:bg-[#FFF0F2] flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Live</span>
                    </button>

                    {currentStep < WIZARD_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="px-5 py-2 rounded-xl bg-[#E83D6F] text-white text-xs font-bold hover:bg-[#F45B82] flex items-center space-x-1 shadow-sm cursor-pointer"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowConfirmPublish(true)}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F45B82] to-[#E83D6F] text-white text-xs font-bold shadow-md hover:brightness-105 flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ready to Publish</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal Before Publishing */}
      {showConfirmPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#6D3046]/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#FFD5DD] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFE4E8] text-[#E83D6F] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 fill-[#E83D6F]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#6D3046] mb-2">
              Ready to send your story? ♡
            </h3>
            <p className="text-xs sm:text-sm text-[#9E5870] leading-relaxed mb-6">
              Publishing will update the live public website for{' '}
              <span className="font-bold text-[#E83D6F]">{recipientInfo.recipientName || 'your love'}</span> at{' '}
              <span className="font-mono font-semibold text-[#6D3046]">/love/{publicSlug}</span>.
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConfirmPublish(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs font-semibold text-[#6D3046] hover:bg-[#FFE4E8]"
              >
                Keep Editing
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#F45B82] to-[#E83D6F] text-white text-xs font-bold shadow-md hover:brightness-105 flex items-center justify-center space-x-1.5"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Live ♡</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Published Success & Share Screen */}
      {publishSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#6D3046]/50 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#FFD5DD] shadow-2xl text-center relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F45B82] to-[#E83D6F] text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-[#E83D6F] tracking-widest uppercase">
              Story Is Live & Published
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#6D3046] mt-1 mb-2">
              Your surprise is ready ♡
            </h3>
            <p className="text-xs sm:text-sm text-[#9E5870] max-w-sm mx-auto mb-6">
              Send this link to {recipientInfo.recipientName || 'your love'} whenever you're ready to surprise them!
            </p>

            {/* Public Link Box */}
            <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] mb-6 text-left space-y-2">
              <span className="text-[11px] font-bold text-[#6D3046] uppercase tracking-wider">
                Public Shareable Link
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#FFD5DD] text-xs font-mono font-medium text-[#6D3046]"
                />
                <button
                  type="button"
                  onClick={copyPublicLink}
                  className="px-4 py-2.5 rounded-xl bg-[#E83D6F] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={handleShare}
                className="py-3 rounded-2xl bg-[#FFF5F7] border border-[#FFD5DD] hover:border-[#E83D6F] text-[#6D3046] font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <Share2 className="w-4 h-4 text-[#E83D6F]" />
                <span>Share via App / WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPublishSuccessModal(false);
                  onNavigate(`/love/${publicSlug}`);
                }}
                className="py-3 rounded-2xl bg-gradient-to-r from-[#F45B82] to-[#E83D6F] text-white font-serif font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md hover:brightness-105 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Open Public Website →</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPublishSuccessModal(false)}
              className="text-xs text-[#9E5870] hover:text-[#6D3046] underline mt-2"
            >
              Continue editing in Studio
            </button>
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      {aiModalType && (
        <AIGeneratorModal
          isOpen={true}
          onClose={() => setAiModalType(null)}
          promptType={aiModalType}
          recipientName={recipientInfo.recipientName}
          relationship={recipientInfo.relationship}
          onApply={(generated) => {
            if (aiModalType === 'love-letter') {
              updateConfig({
                loveLetterSalutation: generated.salutation || config.loveLetterSalutation,
                loveLetterBody: Array.isArray(generated.body) ? generated.body : config.loveLetterBody,
                loveLetterSignoff: generated.signoff || config.loveLetterSignoff,
              });
            } else if (aiModalType === 'birthday-wish') {
              updateConfig({
                birthdayHeadline: generated.birthdayHeadline || config.birthdayHeadline,
                birthdayMessage: generated.birthdayMessage || config.birthdayMessage,
              });
            } else if (aiModalType === 'story-intro') {
              updateConfig({
                storyIntroPart1: generated.part1 || config.storyIntroPart1,
                storyIntroPart2: generated.part2 || config.storyIntroPart2,
              });
            } else if (aiModalType === 'why-reasons') {
              if (Array.isArray(generated.reasons)) {
                const mapped = generated.reasons.map((r: any, i: number) => ({
                  id: `reason-${i + 1}`,
                  number: String(i + 1).padStart(2, '0'),
                  title: r.title || 'Special Reason',
                  subtitle: r.subtitle || 'Always in my heart',
                  description: r.description || '',
                  iconName: (config.reasons && config.reasons[i]?.iconName) || 'Heart',
                  accentColor: (config.reasons && config.reasons[i]?.accentColor) || '#FF7EB6',
                }));
                updateConfig({ reasons: mapped });
              }
            }
          }}
        />
      )}
    </div>
  );
};
