import React, { useState, useEffect } from 'react';
import { HomeHub } from './components/HomeHub';
import { EditorWizard } from './components/editor/EditorWizard';
import { PublicStoryView } from './components/public/PublicStoryView';
import { CustomCursor } from './components/CustomCursor';
import { fetchEditorStory } from './utils/api';
import { WebsiteStory } from './types';
import { Heart, Lock, Sparkles } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    // Check both pathname and hash
    const path = window.location.pathname;
    if (path.startsWith('/edit/') || path.startsWith('/love/')) {
      return path;
    }
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('/edit/') || hash.startsWith('/love/')) {
      return hash;
    }
    return '/';
  });

  // Editor token & state
  const [editorStory, setEditorStory] = useState<WebsiteStory | null>(null);
  const [loadingEditor, setLoadingEditor] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [requiresEditorPassword, setRequiresEditorPassword] = useState(false);
  const [enteredEditorPassword, setEnteredEditorPassword] = useState('');

  // Handle URL changes & popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/edit/') || path.startsWith('/love/')) {
        setCurrentRoute(path);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash.startsWith('/edit/') || hash.startsWith('/love/')) {
          setCurrentRoute(hash);
        } else {
          setCurrentRoute('/');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    window.history.pushState(null, '', route);
    setCurrentRoute(route);
  };

  // When route is `/edit/:token`, fetch editor story
  useEffect(() => {
    let isMounted = true;
    if (currentRoute.startsWith('/edit/')) {
      const token = currentRoute.replace('/edit/', '').split('/')[0].split('?')[0];
      if (token) {
        setLoadingEditor(true);
        setEditorError(null);
        fetchEditorStory(token)
          .then((res) => {
            if (!isMounted) return;
            if (res.requiresEditorPassword) {
              setRequiresEditorPassword(true);
            } else if (res.success && res.story) {
              setEditorStory(res.story);
            }
          })
          .catch((err) => {
            if (!isMounted) return;
            setEditorError(err.message || 'Invalid or expired editor token.');
          })
          .finally(() => {
            if (isMounted) setLoadingEditor(false);
          });
      }
    } else {
      setEditorStory(null);
      setEditorError(null);
      setRequiresEditorPassword(false);
    }
    return () => {
      isMounted = false;
    };
  }, [currentRoute]);

  const handleVerifyEditorPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = currentRoute.replace('/edit/', '').split('/')[0];
    try {
      setLoadingEditor(true);
      const res = await fetchEditorStory(token, enteredEditorPassword);
      if (res.success && res.story) {
        setEditorStory(res.story);
        setRequiresEditorPassword(false);
      } else {
        setEditorError('Incorrect editor password.');
      }
    } catch (err: any) {
      setEditorError(err.message || 'Verification failed.');
    } finally {
      setLoadingEditor(false);
    }
  };

  // Route: Public Story `/love/:slug`
  if (currentRoute.startsWith('/love/')) {
    const slug = currentRoute.replace('/love/', '').split('/')[0].split('?')[0];
    return (
      <div className="w-full h-full min-h-screen bg-[#FFF0F2] text-[#6D3046] overflow-hidden select-none font-sans">
        <CustomCursor />
        <PublicStoryView slug={slug} onNavigateHome={() => navigate('/')} />
      </div>
    );
  }

  // Route: Private Editor `/edit/:token`
  if (currentRoute.startsWith('/edit/')) {
    if (loadingEditor) {
      return (
        <div className="w-full h-full min-h-screen bg-[#FFF0F2] flex flex-col items-center justify-center text-[#6D3046]">
          <div className="w-12 h-12 rounded-full border-3 border-[#FFD5DD] border-t-[#E83D6F] animate-spin mb-4" />
          <h2 className="font-serif font-bold text-lg text-[#6D3046]">
            Loading Romantic Story Studio...
          </h2>
        </div>
      );
    }

    if (requiresEditorPassword) {
      return (
        <div className="w-full h-full min-h-screen bg-[#FFF0F2] flex flex-col items-center justify-center p-4">
          <CustomCursor />
          <div className="card-romantic rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#FFD5DD] shadow-xl bg-white/95 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFE4E8] text-[#E83D6F] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#6D3046] mb-1">
              Editor Passcode Required
            </h3>
            <p className="text-xs text-[#9E5870] mb-4">
              This story's editor studio is protected. Enter your passcode to continue editing.
            </p>
            {editorError && (
              <div className="p-2.5 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {editorError}
              </div>
            )}
            <form onSubmit={handleVerifyEditorPassword} className="space-y-3">
              <input
                type="password"
                value={enteredEditorPassword}
                onChange={(e) => setEnteredEditorPassword(e.target.value)}
                placeholder="Enter editor passcode"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F7] border border-[#FFD5DD] text-xs text-center text-[#6D3046]"
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E83D6F] text-white font-serif font-bold text-xs shadow-md"
              >
                Unlock Studio
              </button>
            </form>
          </div>
        </div>
      );
    }

    if (editorError || !editorStory) {
      return (
        <div className="w-full h-full min-h-screen bg-[#FFF0F2] flex flex-col items-center justify-center p-6 text-center text-[#6D3046]">
          <CustomCursor />
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">
            Story Editor Link Not Found
          </h2>
          <p className="text-xs sm:text-sm text-[#9E5870] max-w-sm mx-auto mb-6">
            {editorError || 'The private editor token was not recognized or has been deleted.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-[#E83D6F] text-white font-serif font-bold text-xs shadow-md"
          >
            Go to Stories Hub →
          </button>
        </div>
      );
    }

    return (
      <div className="w-full h-full min-h-screen bg-[#FFF0F2] text-[#6D3046] overflow-hidden select-none font-sans">
        <CustomCursor />
        <EditorWizard
          story={editorStory}
          onStoryUpdated={(updated) => setEditorStory(updated)}
          onNavigate={navigate}
        />
      </div>
    );
  }

  // Route: Home Hub `/`
  return (
    <div className="w-full h-full min-h-screen bg-[#FFF0F2] text-[#6D3046] overflow-y-auto selection:bg-[#F45B82] selection:text-white font-sans">
      <CustomCursor />
      <HomeHub onNavigate={navigate} />
    </div>
  );
}
