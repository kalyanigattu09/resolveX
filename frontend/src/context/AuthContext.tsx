import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, demoApi } from "../api";
import { refreshSession, setAuthFailureHandler, tokenStore } from "../api/client";
import type { Role, User } from "../types";

const DEMO_FLAG_KEY = "resolvex:isDemo";

function readDemoFlag(): boolean {
  try {
    return sessionStorage.getItem(DEMO_FLAG_KEY) === "true";
  } catch {
    return false;
  }
}

function writeDemoFlag(active: boolean) {
  try {
    if (active) sessionStorage.setItem(DEMO_FLAG_KEY, "true");
    else sessionStorage.removeItem(DEMO_FLAG_KEY);
  } catch {}
}

interface AuthState {
  user: User | null;
  loading: boolean; // true while we check whether a session cookie exists
  isDemo: boolean;
  login: (organizationSlug: string, email: string, password: string) => Promise<User>;
  registerOrg: (body: { organizationName: string; organizationSlug: string; name: string; email: string; password: string }) => Promise<User>;
  registerCustomer: (body: { organizationSlug: string; name: string; email: string; password: string }) => Promise<User>;
  demoLogin: (role: Role) => Promise<User>;
  demoReset: () => Promise<void>;
  exitDemo: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthState | null>(null);
export const LAST_ORG_KEY = "resolvex:lastOrg";

function rememberOrg(slug: string) {
  try { localStorage.setItem(LAST_ORG_KEY, slug); } catch { /* storage may be blocked: not essential */ }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(readDemoFlag);

  // On page load, try to restore the session from the httpOnly refresh cookie.
  useEffect(() => {
    let cancelled = false;
    refreshSession().then((session) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });
    setAuthFailureHandler(() => {
      tokenStore.set(null);
      setUser(null);
      writeDemoFlag(false);
      setIsDemo(false);
    });
    return () => {
      cancelled = true;
      setAuthFailureHandler(null);
    };
  }, []);

  const accept = useCallback((data: { user: User; accessToken: string }, slug: string, demo = false) => {
    tokenStore.set(data.accessToken);
    rememberOrg(slug);
    writeDemoFlag(demo);
    setIsDemo(demo);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      tokenStore.set(null);
      setUser(null);
      writeDemoFlag(false);
      setIsDemo(false);
    }
  }, []);

  const demoLogin = useCallback(async (role: Role) => {
    const data = await demoApi.login(role);
    return accept(data, "demo-org", true);
  }, [accept]);

  const demoReset = useCallback(async () => {
    await demoApi.reset();
  }, []);

  const exitDemo = useCallback(async () => {
    await logout();
  }, [logout]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      isDemo,
      login: async (slug, email, password) => accept(await authApi.login({ organizationSlug: slug, email, password }), slug, false),
      registerOrg: async (body) => accept(await authApi.registerOrg(body), body.organizationSlug, false),
      registerCustomer: async (body) => accept(await authApi.registerCustomer(body), body.organizationSlug, false),
      demoLogin,
      demoReset,
      exitDemo,
      logout,
      setUser,
    }),
    [user, loading, isDemo, accept, demoLogin, demoReset, exitDemo, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
