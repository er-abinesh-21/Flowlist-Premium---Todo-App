import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
import { sanitizeText } from "@/utils/sanitize";

import { auth, db, ensureAuthPersistence, googleProvider, hasFirebaseConfig } from "./config";

function configErrorResult() {
  return {
    success: false,
    user: null,
    error: "Firebase environment variables are missing. Add them to .env.local.",
  };
}

function mapAuthError(error) {
  const code = error?.code || "";

  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password")) {
    return "Email or password is not correct.";
  }

  if (code.includes("auth/email-already-in-use")) {
    return "An account with this email already exists.";
  }

  if (code.includes("auth/popup-closed-by-user")) {
    return "Google sign-in was closed before completion.";
  }

  if (code.includes("auth/too-many-requests")) {
    return "Too many attempts. Please wait and try again.";
  }

  return "Authentication failed. Please try again.";
}

async function syncUserDocument(user, nameFallback = "") {
  const userRef = doc(db, FIRESTORE_COLLECTIONS.users, user.uid);
  const existing = await getDoc(userRef);
  const displayName = sanitizeText(user.displayName || nameFallback || "Member", 60);

  await setDoc(
    userRef,
    {
      id: user.uid,
      name: displayName,
      email: user.email,
      updatedAt: serverTimestamp(),
      createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
    },
    { merge: true },
  );
}

export async function signUpWithEmail({ name, email, password }) {
  if (!hasFirebaseConfig()) {
    return configErrorResult();
  }

  try {
    await ensureAuthPersistence();
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
      await updateProfile(result.user, {
        displayName: sanitizeText(name, 60),
      });
    }

    await syncUserDocument(result.user, name);
    return { success: true, user: result.user, error: "" };
  } catch (error) {
    return { success: false, user: null, error: mapAuthError(error) };
  }
}

export async function signInWithEmail({ email, password }) {
  if (!hasFirebaseConfig()) {
    return configErrorResult();
  }

  try {
    await ensureAuthPersistence();
    const result = await signInWithEmailAndPassword(auth, email, password);
    await syncUserDocument(result.user);

    return { success: true, user: result.user, error: "" };
  } catch (error) {
    return { success: false, user: null, error: mapAuthError(error) };
  }
}

export async function signInWithGoogle() {
  if (!hasFirebaseConfig()) {
    return configErrorResult();
  }

  try {
    await ensureAuthPersistence();
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserDocument(result.user);

    return { success: true, user: result.user, error: "" };
  } catch (error) {
    return { success: false, user: null, error: mapAuthError(error) };
  }
}

export async function signOutUser() {
  if (!hasFirebaseConfig()) {
    return;
  }

  await signOut(auth);
}

export function onAuthStateChange(callback) {
  if (!hasFirebaseConfig()) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid) {
  if (!hasFirebaseConfig()) {
    return null;
  }

  const userRef = doc(db, FIRESTORE_COLLECTIONS.users, uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
}
