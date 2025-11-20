import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { ROUTES } from '../constants/routes.ts';
import { OTP_ISSUER } from '../constants/auth.ts';

export const use2FASetup = () => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [tempSecret, setTempSecret] = useState<string | null>(null);
  const [otpUri, setOtpUri] = useState<string | null>(null);

  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const resetSetupState = useCallback(() => {
    setToken('');
    setOtpUri(null);
    setTempSecret(null);
    setQrCode(null);
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const res = await api.post('/login', { username });

      if (res.data.status === 'SETUP_NEEDED') {
        const temp = res.data.tempSecret;
        setQrCode(res.data.qrCode);
        setTempSecret(temp);
        const issuer = encodeURIComponent(OTP_ISSUER);
        const encodedUser = encodeURIComponent(username);
        const otpLink = `otpauth://totp/${issuer}:${encodedUser}?secret=${temp}&issuer=${issuer}`;
        setOtpUri(otpLink);
        navigate(ROUTES.setup2FA);
      } else {
        setOtpUri(null);
        setTempSecret(null);
        setQrCode(null);
        navigate(ROUTES.verify2FA);
      }
    } catch (err) {
      console.error(err);
      alert('Unable to sign in. Please check the username.');
    }
  }, [navigate, username]);

  const handleVerify = useCallback(async () => {
    try {
      const res = await api.post('/verify-2fa', {
        username,
        token,
        tempSecret: tempSecret ?? undefined,
      });
      setAccessToken(res.data.accessToken);
      resetSetupState();
      navigate(ROUTES.dashboard, { replace: true });
    } catch {
      alert('Invalid code. Please try again.');
    }
  }, [navigate, resetSetupState, setAccessToken, tempSecret, token, username]);

  const hasSetupContext = useMemo(() => Boolean(username && (tempSecret || qrCode)), [
    qrCode,
    tempSecret,
    username,
  ]);

  return {
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
  };
};
