"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Globe2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { authSchema, validateWithSchema } from "@/utils/validation";

import styles from "@/styles/auth.module.css";

export default function AuthPage({ mode = "login" }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const { user, signInWithEmail, signInWithGoogle, signUpWithEmail } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const title = useMemo(() => (isSignup ? "Create your workspace" : "Welcome back"), [isSignup]);

  const subtitle = useMemo(
    () =>
      isSignup
        ? "Start your premium planning workflow in seconds."
        : "Pick up right where you left off.",
    [isSignup],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isSignup && form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    const validation = validateWithSchema(authSchema, {
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (!validation.success) {
      setError(validation.errors[0]);
      return;
    }

    setLoading(true);

    const result = isSignup
      ? await signUpWithEmail(validation.data)
      : await signInWithEmail(validation.data);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    toast.success(isSignup ? "Account created" : "Signed in successfully");
    router.replace("/dashboard");
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);

    const result = await signInWithGoogle();

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    toast.success("Signed in with Google");
    router.replace("/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className={styles.gradientOrbOne} />
      <div className={styles.gradientOrbTwo} />

      <header className={styles.navbar}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back
        </Link>
        <ThemeToggle />
      </header>

      <motion.main
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isSignup ? (
            <label className={styles.field}>
              <span>Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Alex Morgan"
                required
              />
            </label>
          ) : null}

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="alex@email.com"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="At least 8 characters"
              required
            />
          </label>

          {error ? <div className={styles.errorText}>{error}</div> : null}

          <button className={styles.primaryButton} type="submit" disabled={loading}>
            {loading ? <Loader2 className={styles.spinner} size={16} /> : null}
            {isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <Globe2 size={16} />
          Continue with Google
        </button>

        <div className={styles.switchText}>
          {isSignup ? "Already have an account?" : "Need an account?"}
          <Link href={isSignup ? "/auth/login" : "/auth/signup"}>
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </div>
      </motion.main>
    </div>
  );
}
