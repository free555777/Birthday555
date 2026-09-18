import { WebsiteStory, PublicWebsiteData, SiteConfig, RecipientInfo, CelebrationSettings, SecuritySettings } from '../types';

export async function createWebsiteStory(data: {
  recipientName: string;
  relationship?: string;
  nickname?: string;
  birthdayDate?: string;
  birthYearKnown?: boolean;
}): Promise<{ success: boolean; id: string; editorToken: string; publicSlug: string; story: WebsiteStory }> {
  const res = await fetch('/api/websites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create website');
  }
  return res.json();
}

export async function fetchEditorStory(
  token: string,
  editorPassword?: string
): Promise<{ success: boolean; story: WebsiteStory; requiresEditorPassword?: boolean }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (editorPassword) {
    headers['x-editor-password'] = editorPassword;
  }
  const res = await fetch(`/api/websites/editor/${encodeURIComponent(token)}`, { headers });
  if (res.status === 401) {
    return { success: false, requiresEditorPassword: true, story: {} as WebsiteStory };
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch story');
  }
  return res.json();
}

export async function updateEditorStory(
  token: string,
  payload: {
    config?: SiteConfig;
    recipientInfo?: Partial<RecipientInfo>;
    celebrationSettings?: Partial<CelebrationSettings>;
    security?: Partial<SecuritySettings>;
    publicSlug?: string;
  }
): Promise<{ success: boolean; story: WebsiteStory; updatedAt: string }> {
  const res = await fetch(`/api/websites/editor/${encodeURIComponent(token)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save changes');
  }
  return res.json();
}

export async function publishEditorStory(
  token: string
): Promise<{ success: boolean; publicSlug: string; publishedAt: string; story: WebsiteStory }> {
  const res = await fetch(`/api/websites/editor/${encodeURIComponent(token)}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to publish story');
  }
  return res.json();
}

export async function deleteEditorStory(token: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/websites/editor/${encodeURIComponent(token)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete story');
  }
  return res.json();
}

export async function fetchPublicStory(slug: string): Promise<PublicWebsiteData> {
  const res = await fetch(`/api/websites/public/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Story not found or not published');
  }
  return res.json();
}

export async function verifyPublicPassword(
  slug: string,
  password: string
): Promise<{ success: boolean; config: SiteConfig; recipientInfo: RecipientInfo; celebrationSettings: CelebrationSettings }> {
  const res = await fetch(`/api/websites/public/${encodeURIComponent(slug)}/verify-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Invalid password');
  }
  return res.json();
}

export async function generateAIMessage(payload: {
  promptType: 'love-letter' | 'birthday-wish' | 'story-intro' | 'why-reasons';
  recipientName: string;
  relationship?: string;
  tone?: string;
  extraNotes?: string;
}): Promise<{ success: boolean; result: any }> {
  const res = await fetch('/api/generate-ai-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate AI suggestion');
  }
  return res.json();
}
