import { z } from "zod";

export const getNotesQuerySchema = z.object({
  sort: z
    .enum(["asc", "desc"], { message: "Sort must be either 'asc' or 'desc'." })
    .default("desc")
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/, { message: "Page must be a positive integer." })
    .default("1"),
  limit: z
    .string()
    .regex(/^\d+$/, { message: "Limit must be a positive integer." })
    .default("10"),
  search: z
    .string()
    .max(100, { message: "Search query must be at most 100 characters long." })
    .optional(),
  favorite: z
    .enum(["true", "false"], { message: "Favorite must be either 'true' or 'false'." })
    .optional(),
  pinned: z
    .enum(["true", "false"], { message: "Pinned must be either 'true' or 'false'." })
    .optional(),
  tags: z
    .string()
    .optional()
    .transform(t => (t ? t.split(",") : []))
    .refine(tags => tags.every(tag => tag.trim().length > 0), {
      message: "Tags must be non-empty strings.",
    }),
});

// Zod schema for creating new note
export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"), // Markdown content
  images: z.array(z.string().url()).optional().default([]), // Validate URLs
  favorite: z.boolean().optional().default(false),
  pinned: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]), // Must be an array of strings
});

// Zod schema for note update
export const updateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  content: z.string().optional(), // Markdown content
  images: z.array(z.string().url()).optional(), // Validate image URLs
  favorite: z.boolean().optional(),
  pinned: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export type GetNotesQuerySchema = z.infer<typeof getNotesQuerySchema>;
export type CreateNoteSchema = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
