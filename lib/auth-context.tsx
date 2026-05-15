import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User, AuthError } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type Profile = {
  id: string;
  prenom: string;
  nom: string;
  telephone: string | null;
  role: "entrepreneur" | "admin";
  langue: "fr" | "nl" | "en";
  created_at: string;
  updated_at: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (params: {
    email: string;
    password: string;
    prenom: string;
    nom: string;
    telephone: string;
    raisonSociale: string;
    numeroTva: string;
  }) => Promise<{ error: AuthError | Error | null }>;
  signIn: (params: {
    email: string;
    password: string;
  }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data ?? null);
    setLoading(false);
  }

  async function signUp({
    email,
    password,
    prenom,
    nom,
    telephone,
    raisonSociale,
    numeroTva,
  }: {
    email: string;
    password: string;
    prenom: string;
    nom: string;
    telephone: string;
    raisonSociale: string;
    numeroTva: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { prenom, nom, telephone } },
    });
    if (error || !data.user) return { error };

    const { error: entError } = await supabase
      .from("entrepreneurs")
      .insert({ profile_id: data.user.id, raison_sociale: raisonSociale, numero_tva: numeroTva });

    if (entError) return { error: new Error(entError.message) };
    return { error: null };
  }

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
