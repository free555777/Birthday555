export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  location?: string;
  description: string;
  imageUrl: string;
  tag?: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}

export interface ExtraordinaryReason {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  accentColor: string;
}

export interface LoveLetterItem {
  id: string;
  category: string;
  badge: string;
  stampName: string;
  stampIcon: string;
  previewSubtitle: string;
  sealColor: string;
  salutation: string;
  body: string[];
  postscript?: string;
  signoff: string;
  dateTag: string;
}

export interface SiteConfig {
  partnerName: string;
  nickname: string;
  heroTitle: string;
  heroSubtitle: string;
  birthdayHeadline: string;
  birthdayMessage: string;
  storyIntroPart1: string;
  storyIntroPart2: string;
  fluidTypographyText: string;
  loveLetters: LoveLetterItem[];
  loveLetterTitle: string;
  loveLetterSalutation: string;
  loveLetterBody: string[];
  loveLetterSignoff: string;
  musicTitle: string;
  musicArtist: string;
  musicUrl: string;
  memories?: MemoryItem[];
  timeline?: TimelineMilestone[];
  reasons: ExtraordinaryReason[];
  finalQuote: string;
  finalSubquote: string;
}

export type RelationshipType =
  | 'Dating'
  | 'Engaged'
  | 'Married'
  | 'Seeing Someone'
  | 'Friend'
  | 'Mother'
  | 'Father'
  | 'Sibling'
  | 'Relative'
  | 'Other';

export interface RecipientInfo {
  recipientName: string;
  nickname: string;
  birthdayDate: string; // YYYY-MM-DD or MM-DD
  birthYearKnown: boolean;
  relationship: RelationshipType;
}

export interface CelebrationSettings {
  enableCandle: boolean;
  enableFireworks: boolean;
  enableConfetti: boolean;
  enableMusic: boolean;
}

export interface SecuritySettings {
  isPasswordProtected: boolean;
  publicPassword?: string;
  hasEditorPassword: boolean;
  editorPassword?: string;
}

export interface WebsiteStory {
  id: string;
  editorToken: string;
  publicSlug: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  publishedAt: string | null;
  recipientInfo: RecipientInfo;
  celebrationSettings: CelebrationSettings;
  security: SecuritySettings;
  config: SiteConfig; // Draft content
  publishedConfig: SiteConfig | null; // Live published snapshot
  viewsCount: number;
}

export interface PublicWebsiteData {
  id: string;
  publicSlug: string;
  isPublished: boolean;
  publishedAt: string | null;
  isPasswordProtected: boolean;
  recipientInfo: RecipientInfo;
  celebrationSettings: CelebrationSettings;
  config: SiteConfig | null; // null if locked behind password
}

export interface StoredStoryReference {
  id: string;
  editorToken: string;
  publicSlug: string;
  recipientName: string;
  relationship: string;
  isPublished: boolean;
  updatedAt: string;
  previewImage?: string;
}

export type CursorState = 'default' | 'pointer' | 'view' | 'play' | 'open';

