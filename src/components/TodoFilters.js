import { PRIORITY_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from "@/utils/constants";

import styles from "@/styles/components.module.css";

export default function TodoFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  tag,
  onTagChange,
  searchRef,
}) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.field}>
        <label htmlFor="search-tasks">Search</label>
        <input
          id="search-tasks"
          ref={searchRef}
          className={styles.textInput}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search title or description"
        />
      </div>

      <div className={styles.filterGrid}>
        <div className={styles.field}>
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            className={styles.selectInput}
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="priority-filter">Priority</label>
          <select
            id="priority-filter"
            className={styles.selectInput}
            value={priority}
            onChange={(event) => onPriorityChange(event.target.value)}
          >
            <option value="all">All</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="sort-filter">Sort</label>
          <select
            id="sort-filter"
            className={styles.selectInput}
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="tag-filter">Tag</label>
          <input
            id="tag-filter"
            className={styles.textInput}
            value={tag}
            onChange={(event) => onTagChange(event.target.value)}
            placeholder="work"
          />
        </div>
      </div>
    </div>
  );
}
