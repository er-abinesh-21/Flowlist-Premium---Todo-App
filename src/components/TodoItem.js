import clsx from "clsx";
import { motion } from "framer-motion";
import { CalendarClock, GripVertical, PencilLine, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { formatDueDate, isOverdue } from "@/utils/date";

import styles from "@/styles/components.module.css";

export default function TodoItem({ todo, onToggle, onDelete, onEditStart }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={itemStyle}
      layout
      className={clsx(styles.todoCard, {
        [styles.todoCardDone]: todo.completed,
        [styles.todoCardDragging]: isDragging,
      })}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className={clsx(styles.checkboxButton, {
          [styles.checkboxDone]: todo.completed,
        })}
        onClick={() => onToggle(todo.id, !todo.completed)}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <motion.span
          className={styles.checkboxCore}
          animate={todo.completed ? { scale: [1, 1.22, 1] } : { scale: 1 }}
          transition={{ duration: 0.22 }}
        />
      </button>

      <div className={styles.todoContent}>
        <div className={styles.todoTopLine}>
          <h4 className={todo.completed ? styles.todoTitleDone : styles.todoTitle}>{todo.title}</h4>
          <span className={clsx(styles.priorityBadge, styles[`priority_${todo.priority}`])}>
            {todo.priority}
          </span>
        </div>

        {todo.description ? <p className={styles.todoDescription}>{todo.description}</p> : null}

        <div className={styles.todoMetaRow}>
          <span
            className={clsx(styles.dueMeta, {
              [styles.dueOverdue]: !todo.completed && todo.dueDate && isOverdue(todo.dueDate),
            })}
          >
            <CalendarClock size={14} />
            {formatDueDate(todo.dueDate)}
          </span>

          <div className={styles.tagRow}>
            {(todo.tags || []).map((tag) => (
              <span key={`${todo.id}-${tag}`} className={styles.tagChip}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.todoActions}>
        <button type="button" className={styles.iconButton} onClick={() => onEditStart(todo)}>
          <PencilLine size={16} />
        </button>

        <button type="button" className={styles.iconButtonDanger} onClick={() => onDelete(todo.id)}>
          <Trash2 size={16} />
        </button>

        <button type="button" className={styles.dragHandle} {...attributes} {...listeners}>
          <GripVertical size={16} />
        </button>
      </div>
    </motion.li>
  );
}
