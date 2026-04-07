function localSuggestions(todos, searchQuery = "") {
  const openTodos = todos.filter((todo) => !todo.completed);
  const highPriority = openTodos.filter((todo) => todo.priority === "high");
  const withDueDate = openTodos.filter((todo) => todo.dueDate);

  const suggestions = [
    "Create one 25-minute focus block for your toughest task.",
    "Batch similar tasks with shared tags to reduce context switching.",
    "Close one overdue task before creating anything new.",
  ];

  if (highPriority.length > 0) {
    suggestions.unshift(`Start with \"${highPriority[0].title}\" while your energy is highest.`);
  }

  if (withDueDate.length > 0) {
    suggestions.unshift("Review tasks due in the next 24 hours and reschedule low-impact work.");
  }

  if (searchQuery) {
    suggestions.unshift(`Try a focused sprint: complete two \"${searchQuery}\" tasks before noon.`);
  }

  return suggestions.slice(0, 4);
}

export async function fetchTaskSuggestions({ todos, searchQuery }) {
  try {
    const response = await fetch("/api/ai-suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todos: todos.slice(0, 20),
        searchQuery,
      }),
    });

    if (!response.ok) {
      throw new Error("AI endpoint failed");
    }

    const data = await response.json();

    if (Array.isArray(data?.suggestions) && data.suggestions.length) {
      return data.suggestions;
    }

    return localSuggestions(todos, searchQuery);
  } catch {
    return localSuggestions(todos, searchQuery);
  }
}
