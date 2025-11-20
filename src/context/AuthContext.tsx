import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";
import {setApiAccessToken} from "../api/api.ts";

type AuthContextValue = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getInitialAccessToken = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem('accessToken');
};

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(() => getInitialAccessToken());

    useEffect(() => {
        setApiAccessToken(accessToken);

        if (typeof window === 'undefined') {
            return;
        }

        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        } else {
            localStorage.removeItem('accessToken');
        }
    }, [accessToken]);

    const handleSetAccessToken = useCallback((token: string | null) => {
        setAccessTokenState(token);
    }, []);

    const value = useMemo(() => ({
        accessToken,
        setAccessToken: handleSetAccessToken
    }), [accessToken, handleSetAccessToken]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};

