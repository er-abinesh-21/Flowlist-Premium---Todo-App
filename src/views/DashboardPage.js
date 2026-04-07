"use client";

import { motion } from "framer-motion";
import { LogOut, Plus, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import AISuggestions from "@/components/AISuggestions";
import SkeletonList from "@/components/SkeletonList";
import StatsPanel from "@/components/StatsPanel";
import ThemeToggle from "@/components/ThemeToggle";
import TodoComposer from "@/components/TodoComposer";
import TodoFilters from "@/components/TodoFilters";
import TodoList from "@/components/TodoList";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTodos } from "@/hooks/useTodos";
import { PRIORITY_WEIGHT } from "@/utils/constants";
import { toDate } from "@/utils/date";

import styles from "@/styles/dashboard.module.css";

function scoreDate(value) {
  const date = toDate(value);
  return date ? date.getTime() : Number.POSITIVE_INFINITY;
}

function scoreCreated(value) {
  const date = toDate(value);
  return date ? date.getTime() : 0;
}

function sortTodos(todos, sortBy) {
  const sorted = [...todos];

  if (sortBy === "created-asc") {
    return sorted.sort((a, b) => scoreCreated(a.createdAt) - scoreCreated(b.createdAt));
  }

  if (sortBy === "due-asc") {
    return sorted.sort((a, b) => scoreDate(a.dueDate) - scoreDate(b.dueDate));
  }

  if (sortBy === "priority-desc") {
    return sorted.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  }

  return sorted.sort((a, b) => scoreCreated(b.createdAt) - scoreCreated(a.createdAt));
}

export default function DashboardPage() {
  const { user, profile, signOutUser } = useAuth();
  const { todos, loading, saving, createTodo, editTodo, removeTodo, saveOrder, toggleTodo } =
    useTodos(user?.uid);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sortBy, setSortBy] = useState("created-desc");
  const [tag, setTag] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [composerOpen, setComposerOpen] = useState(true);

  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(search, 260);

  useKeyboardShortcuts(
    {
      onNew: () => {
        setComposerOpen(true);
        setEditingTodo(null);
      },
      onSearchFocus: () => searchRef.current?.focus(),
      onEscape: () => {
        setEditingTodo(null);
      },
    },
    true,
  );

  const filteredTodos = useMemo(() => {
    let next = [...todos];

    if (status === "open") {
      next = next.filter((todo) => !todo.completed);
    } else if (status === "completed") {
      next = next.filter((todo) => todo.completed);
    }

    if (priority !== "all") {
      next = next.filter((todo) => todo.priority === priority);
    }

    if (tag.trim()) {
      const needle = tag.trim().toLowerCase();
      next = next.filter((todo) => (todo.tags || []).some((value) => value.includes(needle)));
    }

    if (debouncedSearch.trim()) {
      const needle = debouncedSearch.toLowerCase();
      next = next.filter((todo) => {
        const pool = [todo.title, todo.description, ...(todo.tags || [])]
          .join(" ")
          .toLowerCase();

        return pool.includes(needle);
      });
    }

    return sortTodos(next, sortBy);
  }, [debouncedSearch, priority, sortBy, status, tag, todos]);

  const handleCreate = async (payload) => {
    const success = await createTodo(payload);
    if (success) {
      setComposerOpen(false);
    }

    return success;
  };

  const handleEdit = async (payload) => {
    if (!editingTodo) {
      return false;
    }

    const success = await editTodo(editingTodo.id, payload);

    if (success) {
      setEditingTodo(null);
    }

    return success;
  };

  const handleSignOut = async () => {
    await signOutUser();
    toast.success("Signed out");
  };

  const displayName = profile?.name || user?.displayName || "there";

  return (
    <div className={styles.page}>
      <div className={styles.gradientOrbOne} />
      <div className={styles.gradientOrbTwo} />

      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <h1>Hello, {displayName}</h1>
          <p>Let&apos;s turn today&apos;s priorities into finished work.</p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.newTaskButton}
            onClick={() => {
              setEditingTodo(null);
              setComposerOpen(true);
            }}
          >
            <Plus size={16} />
            New Task (N)
          </button>

          <ThemeToggle />

          <button type="button" className={styles.signOutButton} onClick={handleSignOut}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </motion.header>

      <main className={styles.grid}>
        <section className={styles.mainColumn}>
          {composerOpen || editingTodo ? (
            <TodoComposer
              key={editingTodo?.id || "new-task"}
              initialValue={editingTodo}
              onSubmit={editingTodo ? handleEdit : handleCreate}
              saving={saving}
              submitLabel={editingTodo ? "Save changes" : "Create task"}
              onCancel={() => {
                setEditingTodo(null);
                setComposerOpen(false);
              }}
            />
          ) : (
            <button type="button" className={styles.openComposerButton} onClick={() => setComposerOpen(true)}>
              <Sparkles size={16} />
              Quick add task
            </button>
          )}

          <TodoFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            priority={priority}
            onPriorityChange={setPriority}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            tag={tag}
            onTagChange={setTag}
            searchRef={searchRef}
          />

          {loading ? (
            <SkeletonList />
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={removeTodo}
              onEditStart={(todo) => {
                setComposerOpen(true);
                setEditingTodo(todo);
              }}
              onReorder={saveOrder}
            />
          )}
        </section>

        <aside className={styles.sideColumn}>
          <StatsPanel todos={todos} />
          <AISuggestions todos={filteredTodos} searchQuery={debouncedSearch} />

          <section className={styles.shortcutCard}>
            <h3>Keyboard shortcuts</h3>
            <ul>
              <li>
                <span>N</span>
                Create task
              </li>
              <li>
                <span>/</span>
                Focus search
              </li>
              <li>
                <span>Esc</span>
                Close edit mode
              </li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
