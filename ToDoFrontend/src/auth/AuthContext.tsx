import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, me as meApi, register as registerApi , type User } from './auth';
import { clearToken, getToken, setToken as saveToken } from './tokenStorage';


type AuthState = {
  user: User | null;
  token: string | null;
  isReady: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  register:(username:string,email:string,password:string)=>Promise<void>
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (!token) {
        setIsReady(true);
        return;
      }

      try {
        const res = await meApi();
        setUser(res.user);
      } catch {
        clearToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setIsReady(true);
      }
    })();
  }, [token]);

  const login = useCallback(async (login: string, password: string) => {
    const res = await loginApi(login, password);
    saveToken(res.token);
    setTokenState(res.token);
    setUser(res.user);
  }, []) 

  const register= useCallback( async (username:string,email:string,password:string)=>{
    const res= await registerApi (username,email,password);
    saveToken(res.token);
  setTokenState(res.token)
  setUser(res.user);
  },[])


  const logout =useCallback(function logout() {
    clearToken();
    setTokenState(null);
    setUser(null);
  },[])

  const value = useMemo<AuthState>(
    () => ({ user, token, isReady, login, logout,register }),
    [user, token, isReady,logout,login,register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

