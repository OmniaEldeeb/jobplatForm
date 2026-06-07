"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { getMe } from "@/lib/api/auth";
import { setToken, clearToken } from "@/lib/api/client";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  // Check if user is logged in on mount
  const checkAuth = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const res = await getMe();
    if (res.result) {
      setState({
        user: res.data.user as User,
        loading: false,
        isAuthenticated: true,
      });
    } else {
      setState({ user: null, loading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Call this after login/register
  const saveAuth = useCallback((token: string, user: User) => {
    setToken(token);
    setState({ user, loading: false, isAuthenticated: true });
  }, []);

  // Call this on logout
  const signOut = useCallback(() => {
    clearToken();
    setState({ user: null, loading: false, isAuthenticated: false });
  }, []);

  return {
    ...state,
    saveAuth,
    signOut,
    refreshAuth: checkAuth,
  };
}