import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface SinapseProfile {
  user_id: string;
  display_name: string;
  handle: string | null;
  email: string;
  account_type: string;
  course: string | null;
  semester: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export type SinapseRole =
  | "aluno"
  | "professor"
  | "instituicao"
  | "empresa"
  | "admin";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SinapseProfile | null>(null);
  const [role, setRole] = useState<SinapseRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CRITICAL: subscribe BEFORE getSession
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (!newSession) {
          setProfile(null);
          setRole(null);
        } else {
          // Defer Supabase calls to avoid deadlocks inside the callback
          setTimeout(() => loadProfileAndRole(newSession.user.id), 0);
        }
      },
    );

    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing) loadProfileAndRole(existing.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadProfileAndRole = async (uid: string) => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .maybeSingle(),
    ]);
    if (p) setProfile(p as SinapseProfile);
    if (r) setRole(r.role as SinapseRole);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const deleteAccount = async () => {
    const { error } = await supabase.rpc("delete_my_account");
    if (error) {
      return { error: error.message };
    }

    await supabase.auth.signOut();
    return { error: null };
  };

  return { session, user, profile, role, loading, signOut, deleteAccount };
};
