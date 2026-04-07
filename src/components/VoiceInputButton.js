"use client";

import { Mic, MicOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "@/styles/components.module.css";

export default function VoiceInputButton({ onTranscript }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript && typeof onTranscript === "function") {
        onTranscript(transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscript]);

  const label = useMemo(() => {
    if (!supported) {
      return "Voice unavailable";
    }

    return isListening ? "Stop" : "Voice";
  }, [isListening, supported]);

  if (!supported) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.voiceButton}
      onClick={() => {
        if (!recognitionRef.current) {
          return;
        }

        if (isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
        } else {
          recognitionRef.current.start();
          setIsListening(true);
        }
      }}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      <span>{label}</span>
    </button>
  );
}
