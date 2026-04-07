import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { FIRESTORE_COLLECTIONS } from "@/utils/constants";
import { sanitizeDescription, sanitizeTags, sanitizeText } from "@/utils/sanitize";
import { todoSchema, validateWithSchema } from "@/utils/validation";

import { db, hasFirebaseConfig } from "./config";

const todosCollection = collection(db, FIRESTORE_COLLECTIONS.todos);

function parseDueDate(dueDate) {
  if (!dueDate) {
    return null;
  }

  const parsed = new Date(dueDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeTodoPayload(payload) {
  const normalized = {
    title: sanitizeText(payload.title, 160),
    description: sanitizeDescription(payload.description || "", 700),
    priority: payload.priority || "medium",
    dueDate: payload.dueDate || "",
    tags: sanitizeTags(payload.tags || []),
    completed: Boolean(payload.completed),
  };

  const validation = validateWithSchema(todoSchema, normalized);

  if (!validation.success) {
    throw new Error(validation.errors[0] || "Invalid todo payload.");
  }

  return {
    ...validation.data,
    dueDate: parseDueDate(validation.data.dueDate),
  };
}

export function subscribeToTodos(userId, onData, onError) {
  if (!hasFirebaseConfig()) {
    onData([]);
    return () => {};
  }

  const todoQuery = query(
    todosCollection,
    where("userId", "==", userId),
    orderBy("order", "asc"),
  );

  return onSnapshot(
    todoQuery,
    (snapshot) => {
      const todos = snapshot.docs.map((todoDoc) => ({
        id: todoDoc.id,
        ...todoDoc.data(),
      }));
      onData(todos);
    },
    onError,
  );
}

export async function addTodoForUser(userId, payload, order) {
  if (!hasFirebaseConfig()) {
    throw new Error("Firebase environment variables are missing.");
  }

  const todoPayload = normalizeTodoPayload(payload);

  return addDoc(todosCollection, {
    userId,
    title: todoPayload.title,
    description: todoPayload.description,
    completed: false,
    priority: todoPayload.priority,
    dueDate: todoPayload.dueDate,
    tags: todoPayload.tags,
    order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    completedAt: null,
  });
}

export async function updateTodoById(todoId, payload) {
  if (!hasFirebaseConfig()) {
    throw new Error("Firebase environment variables are missing.");
  }

  const todoPayload = normalizeTodoPayload(payload);
  const todoRef = doc(db, FIRESTORE_COLLECTIONS.todos, todoId);

  await updateDoc(todoRef, {
    title: todoPayload.title,
    description: todoPayload.description,
    priority: todoPayload.priority,
    dueDate: todoPayload.dueDate,
    tags: todoPayload.tags,
    updatedAt: serverTimestamp(),
  });
}

export async function toggleTodoStatus(todoId, completed) {
  if (!hasFirebaseConfig()) {
    throw new Error("Firebase environment variables are missing.");
  }

  const todoRef = doc(db, FIRESTORE_COLLECTIONS.todos, todoId);

  await updateDoc(todoRef, {
    completed,
    completedAt: completed ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTodoById(todoId) {
  if (!hasFirebaseConfig()) {
    throw new Error("Firebase environment variables are missing.");
  }

  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.todos, todoId));
}

export async function reorderTodos(items) {
  if (!hasFirebaseConfig()) {
    throw new Error("Firebase environment variables are missing.");
  }

  const batch = writeBatch(db);

  items.forEach((item, index) => {
    const todoRef = doc(db, FIRESTORE_COLLECTIONS.todos, item.id);
    batch.update(todoRef, {
      order: index * 100,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}
