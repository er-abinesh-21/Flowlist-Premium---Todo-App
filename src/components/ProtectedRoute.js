"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import styles from "@/styles/components.module.css";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className={styles.routeLoaderWrap}>
        <div className={styles.routeLoaderCard}>
          <div className={styles.skeletonBar} />
          <div className={styles.skeletonBar} />
          <div className={styles.skeletonBarShort} />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
