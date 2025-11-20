import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { ROUTES } from '../constants/routes.ts';

export const useAuthBootstrap = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/refresh');
        setAccessToken(res.data.accessToken);
        navigate(ROUTES.dashboard, { replace: true });
      } catch {
        setAccessToken(null);
      }
    };

    checkAuth();
  }, [navigate, setAccessToken]);
};

