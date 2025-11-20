import { useCallback, useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const isIOSDevice = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // @ts-expect-error - iOS Safari exposes standalone on navigator
  window.navigator.standalone === true;

export const usePwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowAndroidPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (isIOSDevice() && !isStandalone()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowIOSInstructions(true);
    }
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setShowAndroidPrompt(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismissAndroidPrompt = useCallback(() => {
    setShowAndroidPrompt(false);
  }, []);

  const dismissIOSInstructions = useCallback(() => {
    setShowIOSInstructions(false);
  }, []);

  return useMemo(
    () => ({
      showAndroidPrompt,
      showIOSInstructions,
      promptInstall,
      dismissAndroidPrompt,
      dismissIOSInstructions,
    }),
    [dismissAndroidPrompt, dismissIOSInstructions, promptInstall, showAndroidPrompt, showIOSInstructions],
  );
};
