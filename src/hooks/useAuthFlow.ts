import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { use2FASetup } from './use2FASetup.ts';
import { usePushNotifications } from './usePushNotifications.ts';
import { useAuthBootstrap } from './useAuthBootstrap.ts';
import { ROUTES } from '../constants/routes.ts';

type UseAuthFlowArgs = {
  isDashboardActive: boolean;
};

export const useAuthFlow = ({ isDashboardActive }: UseAuthFlowArgs) => {
  useAuthBootstrap();
  const navigate = useNavigate();
  const { setAccessToken, accessToken } = useAuth();
  const {
    username,
    setUsername,
    token,
    setToken,
    qrCode,
    tempSecret,
    otpUri,
    handleLogin,
    handleVerify,
    resetSetupState,
    hasSetupContext,
  } = use2FASetup();

  const {
    isSubscribed,
    subscribeToPush,
    triggerNotification,
    triggerDelayedNotification,
    resetSubscriptionState,
  } =
    usePushNotifications(isDashboardActive);

  const handleLogout = useCallback(async () => {
    await api.post('/logout');
    setAccessToken(null);
    setUsername('');
    resetSetupState();
    resetSubscriptionState();
    navigate(ROUTES.login);
  }, [navigate, resetSetupState, resetSubscriptionState, setAccessToken, setUsername]);

  return {
    accessToken,
    username,
    setUsername,
    token,
    setToken,
    qrCode,
    tempSecret,
    otpUri,
    isSubscribed,
    hasSetupContext,
    handleLogin,
    handleVerify,
    handleLogout,
    subscribeToPush,
    triggerNotification,
    triggerDelayedNotification,
  };
};
