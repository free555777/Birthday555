import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_CONFIG } from './src/config';
import { WebsiteStory, SiteConfig } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// File-based persistent storage
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'stories.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper function to create default demo story
function createDemoStory(): WebsiteStory {
  return {
    id: 'demo-maya-001',
    editorToken: 'demo-maya-editor-token-888',
    publicSlug: 'maya-birthday',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: true,
    publishedAt: new Date().toISOString(),
    recipientInfo: {
      recipientName: 'Maya',
      nickname: 'My Love',
      birthdayDate: '2000-09-18',
      birthYearKnown: true,
      relationship: 'Dating',
    },
    celebrationSettings: {
      enableCandle: true,
      enableFireworks: true,
      enableConfetti: true,
      enableMusic: true,
    },
    security: {
      isPasswordProtected: false,
      hasEditorPassword: false,
    },
    config: INITIAL_CONFIG,
    publishedConfig: INITIAL_CONFIG,
    viewsCount: 12,
  };
}

function loadStories(): Record<string, WebsiteStory> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (typeof data === 'object' && data !== null) {
        // Ensure demo story exists
        if (!data['demo-maya-001'] && !Object.values(data).some((s: any) => s.publicSlug === 'maya-birthday')) {
          const demo = createDemoStory();
          data[demo.id] = demo;
          saveStories(data);
        }
        return data;
      }
    }
  } catch (err) {
    console.error('Error loading stories file:', err);
  }

  const initialData: Record<string, WebsiteStory> = {};
  const demo = createDemoStory();
  initialData[demo.id] = demo;
  saveStories(initialData);
  return initialData;
}

function saveStories(stories: Record<string, WebsiteStory>) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(stories, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving stories file:', err);
  }
}

function generateSlug(name: string, existingStories: Record<string, WebsiteStory>): string {
  const base = (name || 'my-love')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'love';
  
  let candidate = `${base}-birthday`;
  let counter = 1;
  const takenSlugs = new Set(Object.values(existingStories).map((s) => s.publicSlug.toLowerCase()));

  while (takenSlugs.has(candidate.toLowerCase())) {
    counter++;
    candidate = `${base}-${counter}`;
  }
  return candidate;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Create new website story (No login required!)
app.post('/api/websites', (req, res) => {
  try {
    const { recipientName, relationship, nickname, birthdayDate, birthYearKnown } = req.body;
    const stories = loadStories();

    const id = crypto.randomUUID();
    const editorToken = crypto.randomBytes(24).toString('hex');
    const name = (recipientName || 'My Love').trim();
    const publicSlug = generateSlug(name, stories);

    // Deep clone initial config and customize name
    const customizedConfig: SiteConfig = JSON.parse(JSON.stringify(INITIAL_CONFIG));
    customizedConfig.partnerName = name;
    customizedConfig.nickname = nickname || name;
    customizedConfig.birthdayHeadline = `Happy Birthday, ${name}`;
    customizedConfig.loveLetterSalutation = `Dearest ${name},`;
    if (customizedConfig.loveLetters && customizedConfig.loveLetters.length > 0) {
      customizedConfig.loveLetters[0].salutation = `Dearest ${name},`;
    }

    const newStory: WebsiteStory = {
      id,
      editorToken,
      publicSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
      publishedAt: null,
      recipientInfo: {
        recipientName: name,
        nickname: nickname || name,
        birthdayDate: birthdayDate || '',
        birthYearKnown: birthYearKnown !== false,
        relationship: relationship || 'Dating',
      },
      celebrationSettings: {
        enableCandle: true,
        enableFireworks: true,
        enableConfetti: true,
        enableMusic: true,
      },
      security: {
        isPasswordProtected: false,
        hasEditorPassword: false,
      },
      config: customizedConfig,
      publishedConfig: null,
      viewsCount: 0,
    };

    stories[id] = newStory;
    saveStories(stories);

    res.status(201).json({
      success: true,
      id: newStory.id,
      editorToken: newStory.editorToken,
      publicSlug: newStory.publicSlug,
      story: newStory,
    });
  } catch (err: any) {
    console.error('Error creating story:', err);
    res.status(500).json({ error: 'Failed to create story', details: err.message });
  }
});

// Get story for editor by private editor token
app.get('/api/websites/editor/:token', (req, res) => {
  try {
    const { token } = req.params;
    const stories = loadStories();
    const story = Object.values(stories).find((s) => s.editorToken === token);

    if (!story) {
      return res.status(404).json({ error: 'Story not found or invalid editor link.' });
    }

    // Check if editor password is required
    if (story.security?.hasEditorPassword && story.security.editorPassword) {
      const providedPassword = req.headers['x-editor-password'] as string;
      if (providedPassword !== story.security.editorPassword) {
        return res.status(401).json({
          requiresEditorPassword: true,
          error: 'Editor password required to access this story.',
        });
      }
    }

    res.json({
      success: true,
      story,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch story', details: err.message });
  }
});

// Update draft data (Autosave)
app.patch('/api/websites/editor/:token', (req, res) => {
  try {
    const { token } = req.params;
    const { config, recipientInfo, celebrationSettings, security, publicSlug } = req.body;
    const stories = loadStories();
    const story = Object.values(stories).find((s) => s.editorToken === token);

    if (!story) {
      return res.status(404).json({ error: 'Story not found or invalid editor link.' });
    }

    if (config) story.config = config;
    if (recipientInfo) story.recipientInfo = { ...story.recipientInfo, ...recipientInfo };
    if (celebrationSettings) story.celebrationSettings = { ...story.celebrationSettings, ...celebrationSettings };
    if (security) {
      story.security = {
        ...story.security,
        isPasswordProtected: security.isPasswordProtected ?? story.security.isPasswordProtected,
        publicPassword: security.publicPassword !== undefined ? security.publicPassword : story.security.publicPassword,
        hasEditorPassword: security.hasEditorPassword ?? story.security.hasEditorPassword,
        editorPassword: security.editorPassword !== undefined ? security.editorPassword : story.security.editorPassword,
      };
    }

    if (publicSlug && publicSlug.trim() && publicSlug.trim() !== story.publicSlug) {
      const cleanSlug = publicSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
      const isTaken = Object.values(stories).some((s) => s.id !== story.id && s.publicSlug.toLowerCase() === cleanSlug);
      if (!isTaken) {
        story.publicSlug = cleanSlug;
      }
    }

    story.updatedAt = new Date().toISOString();
    stories[story.id] = story;
    saveStories(stories);

    res.json({
      success: true,
      updatedAt: story.updatedAt,
      publicSlug: story.publicSlug,
      story,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update story', details: err.message });
  }
});

// Publish draft to live public view
app.post('/api/websites/editor/:token/publish', (req, res) => {
  try {
    const { token } = req.params;
    const stories = loadStories();
    const story = Object.values(stories).find((s) => s.editorToken === token);

    if (!story) {
      return res.status(404).json({ error: 'Story not found or invalid editor link.' });
    }

    story.isPublished = true;
    story.publishedAt = new Date().toISOString();
    story.updatedAt = new Date().toISOString();
    // Snapshot current config into publishedConfig
    story.publishedConfig = JSON.parse(JSON.stringify(story.config));

    stories[story.id] = story;
    saveStories(stories);

    res.json({
      success: true,
      publicSlug: story.publicSlug,
      publishedAt: story.publishedAt,
      story,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to publish story', details: err.message });
  }
});

// Delete story
app.delete('/api/websites/editor/:token', (req, res) => {
  try {
    const { token } = req.params;
    const stories = loadStories();
    const story = Object.values(stories).find((s) => s.editorToken === token);

    if (!story) {
      return res.status(404).json({ error: 'Story not found.' });
    }

    delete stories[story.id];
    saveStories(stories);

    res.json({ success: true, message: 'Story deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete story', details: err.message });
  }
});

// Public endpoint to view published story (Sanitized: never leaks token or secret passwords!)
app.get('/api/websites/public/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const stories = loadStories();
    const story = Object.values(stories).find((s) => s.publicSlug.toLowerCase() === slug.toLowerCase());

    if (!story || !story.isPublished) {
      return res.status(404).json({ error: 'Romantic story not found or is still a private draft.' });
    }

    // Increment view count
    story.viewsCount = (story.viewsCount || 0) + 1;
    stories[story.id] = story;
    saveStories(stories);

    const isPasswordProtected = !!story.security?.isPasswordProtected;

    // If password protected, do not return secret content until unlocked
    if (isPasswordProtected) {
      return res.json({
        id: story.id,
        publicSlug: story.publicSlug,
        isPublished: true,
        publishedAt: story.publishedAt,
        isPasswordProtected: true,
        recipientInfo: {
          recipientName: story.recipientInfo.recipientName,
          nickname: story.recipientInfo.nickname,
          relationship: story.recipientInfo.relationship,
        },
        celebrationSettings: story.celebrationSettings,
        config: null, // Locked
      });
    }

    // Unprotected story: return public data
    res.json({
      id: story.id,
      publicSlug: story.publicSlug,
      isPublished: true,
      publishedAt: story.publishedAt,
      isPasswordProtected: false,
      recipientInfo: story.recipientInfo,
      celebrationSettings: story.celebrationSettings,
      config: story.publishedConfig || story.config,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch public story', details: err.message });
  }
});

// Verify public password for password-protected stories
app.post('/api/websites/public/:slug/verify-password', (req, res) => {
  try {
    const { slug } = req.params;
    const { password } = req.body;
    const stories = loadStories();
    const story = Object.values(stories).find((s) => s.publicSlug.toLowerCase() === slug.toLowerCase());

    if (!story || !story.isPublished) {
      return res.status(404).json({ error: 'Story not found.' });
    }

    if (!story.security?.isPasswordProtected) {
      return res.json({
        success: true,
        config: story.publishedConfig || story.config,
        recipientInfo: story.recipientInfo,
        celebrationSettings: story.celebrationSettings,
      });
    }

    const expected = story.security.publicPassword || '';
    if (password === expected) {
      return res.json({
        success: true,
        config: story.publishedConfig || story.config,
        recipientInfo: story.recipientInfo,
        celebrationSettings: story.celebrationSettings,
      });
    } else {
      return res.status(401).json({ success: false, error: 'Incorrect secret password. Please try again ♡' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Verification failed', details: err.message });
  }
});

// Gemini AI romantic message generation
app.post('/api/generate-ai-message', async (req, res) => {
  try {
    const { promptType, recipientName, relationship, tone, extraNotes } = req.body;
    const name = recipientName || 'My Love';
    const rel = relationship || 'Partner';
    const chosenTone = tone || 'romantic, heartfelt, warm, poetic';

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        let systemInstruction = `You are a world-class romantic poet and intimate love letter writer. Write touching, deeply personal, authentic, emotionally evocative content for a romantic birthday and love website. Avoid clichés, overly cheesy tropes, and robotic phrasing. Output pure beauty and sincere warmth.`;

        let prompt = '';
        if (promptType === 'love-letter') {
          prompt = `Write a deep, breathtaking romantic love letter for ${name} (Relationship: ${rel}). Tone: ${chosenTone}. ${extraNotes ? `Personal details: ${extraNotes}` : ''}. Format as JSON with: { "salutation": "Dearest ${name},", "body": ["Paragraph 1...", "Paragraph 2...", "Paragraph 3...", "Paragraph 4..."], "postscript": "P.S. ...", "signoff": "Forever & Always Yours," }`;
        } else if (promptType === 'birthday-wish') {
          prompt = `Write a heart-melting birthday headline and birthday message for ${name} (Relationship: ${rel}). Tone: ${chosenTone}. ${extraNotes ? `Personal details: ${extraNotes}` : ''}. Format as JSON with: { "birthdayHeadline": "Happy Birthday...", "birthdayMessage": "..." }`;
        } else if (promptType === 'story-intro') {
          prompt = `Write a 2-part poetic opening thought about meeting ${name} and how they changed everything. Format as JSON with: { "part1": "...", "part2": "..." }`;
        } else if (promptType === 'why-reasons') {
          prompt = `Write 6 unique, deeply touching reasons why ${name} is extraordinary. Format as JSON with: { "reasons": [ { "title": "...", "subtitle": "...", "description": "..." }, ... ] }`;
        } else {
          prompt = `Write a romantic love message for ${name}. Format as JSON with: { "message": "..." }`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, result: parsed });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to curated romantic templates:', geminiError.message);
      }
    }

    // High quality graceful romantic template fallback
    if (promptType === 'love-letter') {
      res.json({
        success: true,
        result: {
          salutation: `Dearest ${name},`,
          body: [
            `Happy Birthday to the one person who made my entire universe stop spinning and start feeling like home.`,
            `If someone had told me years ago that an ordinary day could turn into starlight just because of a single person’s smile, I wouldn’t have believed them. Until you walked into my world.`,
            `Your laughter is my favorite melody, your kindness is the anchor of my life, and watching you grow into everything you dream of is the greatest honor I’ve ever known.`,
            `Blow out every candle today knowing that every wish you make has already become my heart's quiet mission to help come true.`,
          ],
          postscript: `P.S. You look breathtaking today. Just like you do every single day.`,
          signoff: `Forever & Always Yours,`,
        },
      });
    } else if (promptType === 'birthday-wish') {
      res.json({
        success: true,
        result: {
          birthdayHeadline: `Happy Birthday, My Whole World`,
          birthdayMessage: `May every star in this sky remind you of how deeply and endlessly you are cherished, today and for all the years ahead.`,
        },
      });
    } else if (promptType === 'story-intro') {
      res.json({
        success: true,
        result: {
          part1: `Some people enter your life quietly...`,
          part2: `...and somehow turn every ordinary moment into unforgettable magic.`,
        },
      });
    } else if (promptType === 'why-reasons') {
      res.json({
        success: true,
        result: {
          reasons: [
            { title: 'Your Smile', subtitle: 'The morning sun after winter', description: 'The genuine, unreserved smile that lights up an entire room and disarms any worry.' },
            { title: 'Your Heart', subtitle: 'Pure, patient and deep', description: 'The boundless compassion and empathy you offer so freely to everyone around you.' },
            { title: 'Your Gentle Kindness', subtitle: 'Grace in quiet action', description: 'How you remember the smallest details and always choose gentleness and patience.' },
            { title: 'Your Laugh', subtitle: 'My favorite symphony', description: 'The sudden burst of pure joy when something is hilarious. I could listen to it forever.' },
            { title: 'Your Little Habits', subtitle: 'Nuances only I know', description: 'The way you tuck your hair behind your ear when concentrating or get excited over sweet treats.' },
            { title: 'You Make Life Magic', subtitle: 'The greatest gift', description: 'Every grocery run and quiet evening feels like an adventure when holding your hand.' },
          ],
        },
      });
    } else {
      res.json({
        success: true,
        result: {
          message: `Loving you is the easiest, sweetest thing I have ever done in this lifetime.`,
        },
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate message', details: err.message });
  }
});

// ----------------------------------------------------
// VITE & STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Romantic Story Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
