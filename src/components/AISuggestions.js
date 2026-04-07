"use client";

import { motion } from "framer-motion";
import { BrainCircuit, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { fetchTaskSuggestions } from "@/services/ai/suggestions";

import styles from "@/styles/components.module.css";

export default function AISuggestions({ todos, searchQuery }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshSuggestions = async () => {
    setLoading(true);

    const nextSuggestions = await fetchTaskSuggestions({
      todos,
      searchQuery,
    });

    setSuggestions(nextSuggestions);
    setLoading(false);
  };

  useEffect(() => {
    refreshSuggestions();
    // Only rerun when signal changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos.length, searchQuery]);

  return (
    <section className={styles.aiCard}>
      <header className={styles.aiHeader}>
        <div>
          <h3>
            <BrainCircuit size={16} />
            Smart Suggestions
          </h3>
          <p>AI-supported planning ideas for your next focus block.</p>
        </div>

        <button type="button" className={styles.ghostButton} onClick={refreshSuggestions}>
          <RefreshCcw size={14} />
          {loading ? "Thinking..." : "Refresh"}
        </button>
      </header>

      <ul className={styles.aiList}>
        {suggestions.map((suggestion) => (
          <motion.li
            key={suggestion}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {suggestion}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
