import { z } from "zod";

export const authSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(64),
});

export const todoSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(700).optional().default(""),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  completed: z.boolean().optional(),
});

export function validateWithSchema(schema, value) {
  const result = schema.safeParse(value);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => issue.message),
      data: null,
    };
  }

  return {
    success: true,
    errors: [],
    data: result.data,
  };
}
