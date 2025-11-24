import { useCallback, useEffect, useState } from 'react';
import api from '../api/api.ts';
import { urlBase64ToUint8Array } from '../utils/ConvertBase64toUint8.ts';

export const usePushNotifications = (isDashboardActive: boolean) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!isDashboardActive || !('serviceWorker' in navigator)) {
      return;
    }

    const syncSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          setIsSubscribed(true);
          await api.post('/subscribe', subscription);
        }
      } catch (error) {
        console.error('Failed to sync subscription:', error);
      }
    };

    syncSubscription();
  }, [isDashboardActive]);

  const subscribeToPush = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      alert('Service Worker is not supported in this browser.');
      return;
    }

    try {
      if (!('Notification' in window)) {
        alert('Notifications are not supported in this browser.');
        return;
      }

      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        alert('Please enable notifications to receive push messages.');
        return;
      }

      await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
        });
      }

      await api.post('/subscribe', subscription);

      setIsSubscribed(true);
      alert('Subscription successful! You can now send notifications.');
    } catch (error) {
      console.error('Error during subscription:', error);
    }
  }, []);

  const triggerNotification = useCallback(async () => {
    await api.post('/send-notification');
  }, []);

  const triggerDelayedNotification = useCallback(async () => {
    await api.post('/send-delayed-notification', { delayMs: 30000 });
  }, []);

  const resetSubscriptionState = useCallback(() => {
    setIsSubscribed(false);
  }, []);

  return {
    isSubscribed,
    subscribeToPush,
    triggerNotification,
    triggerDelayedNotification,
    resetSubscriptionState,
  };
};
