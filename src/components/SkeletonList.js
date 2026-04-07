import styles from "@/styles/components.module.css";

export default function SkeletonList() {
  return (
    <div className={styles.skeletonList}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={String(index)} className={styles.skeletonCard}>
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRowShort} />
        </div>
      ))}
    </div>
  );
}
