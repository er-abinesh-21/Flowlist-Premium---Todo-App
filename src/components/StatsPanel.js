import { Activity, CalendarCheck2, Flame, Sparkles } from "lucide-react";

import { calculateCompletionStats, calculateStreak, calculateTodayProgress } from "@/utils/stats";

import styles from "@/styles/components.module.css";

export default function StatsPanel({ todos }) {
  const stats = calculateCompletionStats(todos);
  const progress = calculateTodayProgress(todos);
  const streak = calculateStreak(todos);

  return (
    <section className={styles.statsWrap}>
      <div className={styles.statCard}>
        <span>
          <CalendarCheck2 size={16} />
          Completed
        </span>
        <strong>{stats.completed}</strong>
      </div>

      <div className={styles.statCard}>
        <span>
          <Activity size={16} />
          Completion
        </span>
        <strong>{stats.completionRate}%</strong>
      </div>

      <div className={styles.statCard}>
        <span>
          <Flame size={16} />
          Streak
        </span>
        <strong>{streak}d</strong>
      </div>

      <div className={styles.progressCard}>
        <header>
          <Sparkles size={16} />
          <span>Daily Progress</span>
        </header>

        <p>
          {progress.doneToday}/{progress.totalToday} tasks completed today
        </p>

        <div className={styles.progressTrack}>
          <span style={{ width: `${progress.progress}%` }} />
        </div>
      </div>
    </section>
  );
}
