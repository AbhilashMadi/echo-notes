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

  tags: z
    .string()
    .optional()
    .transform(t => (t ? t.split(",") : []))
    .refine(tags => tags.every(tag => tag.trim().length > 0), {
      message: "Tags must be non-empty strings.",
    }),
});

export type GetNotesQuerySchema = z.infer<typeof getNotesQuerySchema>;
