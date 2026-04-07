"use client";

import { motion } from "framer-motion";
import { Bolt, LockKeyhole, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

import styles from "@/styles/landing.module.css";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Delightful by default",
    description: "Glassmorphism surfaces, intentional spacing, and kinetic micro-interactions.",
  },
  {
    icon: Bolt,
    title: "Fast and focused",
    description: "Realtime sync, debounced search, and drag-and-drop flow that stays responsive.",
  },
  {
    icon: LockKeyhole,
    title: "Secure by design",
    description: "Firebase Auth + Firestore rules keep every task private to each signed-in user.",
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const primaryHref = user ? "/dashboard" : "/auth/signup";

  return (
    <div className={styles.page}>
      <div className={styles.gradientOrbOne} />
      <div className={styles.gradientOrbTwo} />

      <header className={styles.navbar}>
        <Link href="/" className={styles.brand}>
          <Zap size={18} />
          <span>Flowlist</span>
        </Link>

        <div className={styles.navActions}>
          <ThemeToggle />
          <Link href={user ? "/dashboard" : "/auth/login"} className={styles.navLink}>
            {user ? "Dashboard" : "Log in"}
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <motion.section
          className={styles.hero}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className={styles.badge}>Premium serverless productivity</span>
          <h1>Focus deeply. Plan elegantly. Ship every day.</h1>
          <p>
            Flowlist combines modern SaaS polish with secure serverless architecture so your
            personal planning feels like a pro-grade product.
          </p>

          <div className={styles.heroActions}>
            <Link href={primaryHref} className={styles.primaryButton}>
              {user ? "Open Dashboard" : "Start for Free"}
            </Link>
            <Link href="/auth/login" className={styles.secondaryButton}>
              View Live Experience
            </Link>
          </div>
        </motion.section>

        <section className={styles.featureGrid}>
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 * (index + 1) }}
              >
                <Icon size={18} />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
