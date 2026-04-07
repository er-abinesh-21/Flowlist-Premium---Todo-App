import { NextResponse } from "next/server";

import { sanitizeText } from "@/utils/sanitize";

function buildFallbackSuggestions(todos, query) {
  const openTodos = todos.filter((todo) => !todo.completed);

  const suggestions = [
    "Review your top three priorities and timebox each for 25 minutes.",
    "Complete one task under 10 minutes to build momentum quickly.",
    "Move one blocked item into a clear next action statement.",
  ];

  if (openTodos.length > 0) {
    suggestions.unshift(`Finish \"${sanitizeText(openTodos[0].title || "your first task", 80)}\" first.`);
  }

  if (query) {
    suggestions.unshift(`Bundle related \"${query}\" tasks into one focused sprint.`);
  }

  return suggestions.slice(0, 4);
}

function parseSuggestions(rawText) {
  if (!rawText) {
    return [];
  }

  return rawText
    .split("\n")
    .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
}

export async function POST(request) {
  let payload = {};

  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const todos = Array.isArray(payload?.todos) ? payload.todos.slice(0, 20) : [];
  const searchQuery = sanitizeText(payload?.searchQuery || "", 80);

  const fallbackSuggestions = buildFallbackSuggestions(todos, searchQuery);
  const groqApiKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  if (!groqApiKey) {
    return NextResponse.json({ suggestions: fallbackSuggestions, source: "fallback" });
  }

  const reducedTodos = todos
    .filter((todo) => !todo.completed)
    .slice(0, 8)
    .map((todo) => ({
      title: sanitizeText(todo.title || "", 120),
      priority: todo.priority || "medium",
      dueDate: todo.dueDate || null,
      tags: Array.isArray(todo.tags) ? todo.tags.slice(0, 4) : [],
    }));

  const prompt = [
    "You are a productivity coach.",
    "Return exactly 4 short task suggestions tailored to this todo list.",
    "Each suggestion must be plain text, under 16 words, and actionable.",
    "Do not add numbering or markdown.",
    `Search focus: ${searchQuery || "none"}`,
    `Open tasks: ${JSON.stringify(reducedTodos)}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          {
            role: "system",
            content:
              "You are a productivity coach. Return concise, actionable, plain-text suggestions only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.55,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
      throw new Error("Groq request failed");
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || "";

    const parsed = parseSuggestions(text);

    if (!parsed.length) {
      return NextResponse.json({ suggestions: fallbackSuggestions, source: "fallback" });
    }

    return NextResponse.json({ suggestions: parsed, source: "groq" });
  } catch {
    return NextResponse.json({ suggestions: fallbackSuggestions, source: "fallback" });
  }
}
