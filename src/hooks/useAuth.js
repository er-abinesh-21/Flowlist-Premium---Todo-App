"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  getUserProfile,
  onAuthStateChange,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
} from "@/services/firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (!firebaseUser) {
        if (!active) {
          return;
        }

        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!active) {
        return;
      }

      setUser(firebaseUser);

      getUserProfile(firebaseUser.uid)
        .then((profileData) => {
          if (!active) {
            return;
          }

          setProfile(
            profileData || {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "Member",
              email: firebaseUser.email || "",
            },
          );
        })
        .catch(() => {
          if (!active) {
            return;
          }

          setProfile({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "Member",
            email: firebaseUser.email || "",
          });
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOutUser,
    }),
    [loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
