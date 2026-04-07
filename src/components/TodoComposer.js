"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { DEFAULT_TODO_FORM, PRIORITY_OPTIONS } from "@/utils/constants";
import { toDateTimeLocalValue } from "@/utils/date";
import { sanitizeTags } from "@/utils/sanitize";

import VoiceInputButton from "./VoiceInputButton";

import styles from "@/styles/components.module.css";

function buildInitialForm(initialValue) {
  if (!initialValue) {
    return DEFAULT_TODO_FORM;
  }

  return {
    title: initialValue.title || "",
    description: initialValue.description || "",
    priority: initialValue.priority || "medium",
    dueDate: toDateTimeLocalValue(initialValue.dueDate),
    tags: Array.isArray(initialValue.tags) ? initialValue.tags.join(", ") : "",
  };
}

export default function TodoComposer({
  onSubmit,
  initialValue,
  onCancel,
  saving,
  submitLabel = "Create task",
}) {
  const [form, setForm] = useState(() => buildInitialForm(initialValue));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const success = await onSubmit({
      ...form,
      tags: sanitizeTags(form.tags),
    });

    if (success && !initialValue) {
      setForm(DEFAULT_TODO_FORM);
    }
  };

  return (
    <motion.form
      className={styles.composerCard}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className={styles.composerHeader}>
        <h3>{initialValue ? "Edit task" : "New task"}</h3>
        <VoiceInputButton
          onTranscript={(transcript) =>
            setForm((current) => ({
              ...current,
              title: current.title ? `${current.title} ${transcript}` : transcript,
            }))
          }
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          className={styles.textInput}
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Design sprint plan"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          className={styles.textareaInput}
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Context, blockers, and expected outcome"
          rows={3}
        />
      </div>

      <div className={styles.composerGrid}>
        <div className={styles.field}>
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            className={styles.selectInput}
            value={form.priority}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                priority: event.target.value,
              }))
            }
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="task-due-date">Due date</label>
          <input
            id="task-due-date"
            className={styles.textInput}
            type="datetime-local"
            value={form.dueDate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                dueDate: event.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="task-tags">Tags</label>
        <input
          id="task-tags"
          className={styles.textInput}
          value={form.tags}
          onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
          placeholder="design, sprint, team"
        />
      </div>

      <div className={styles.actionRow}>
        {typeof onCancel === "function" ? (
          <button type="button" className={styles.ghostButton} onClick={onCancel}>
            Cancel
          </button>
        ) : null}

        <button type="submit" className={styles.primaryButton} disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </motion.form>
  );
}
