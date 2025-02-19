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

/* ####################################### "@blocknote/mantine" Conetent Schema ############################## */
// Define all possible block types
const blockTypes = [
  "paragraph",
  "heading",
  "list",
  "list-item",
  "blockquote",
  "code",
  "divider",
  "image",
  "table",
  "table-row",
  "table-cell",
] as const;

// Base Block Schema
const baseBlockSchema = z.object({
  type: z.enum(blockTypes), // Only allows predefined block types
});

// Heading Block (H1-H6)
const headingBlockSchema = baseBlockSchema.extend({
  type: z.literal("heading"),
  content: z.string().min(1, "Heading cannot be empty"),
  level: z.number().min(1).max(6), // Restrict heading levels to H1-H6
});

// Paragraph Block
const paragraphBlockSchema = baseBlockSchema.extend({
  type: z.literal("paragraph"),
  content: z.string().min(1, "Paragraph cannot be empty"),
});

// List Block
const listBlockSchema = baseBlockSchema.extend({
  type: z.literal("list"),
  ordered: z.boolean().default(false),
  children: z.array(
    z.object({
      type: z.literal("list-item"),
      content: z.string().min(1, "List item cannot be empty"),
    }),
  ).min(1, "List must have at least one item"),
});

// Blockquote Block
const blockquoteBlockSchema = baseBlockSchema.extend({
  type: z.literal("blockquote"),
  content: z.string().min(1, "Blockquote cannot be empty"),
});

// Code Block
const codeBlockSchema = baseBlockSchema.extend({
  type: z.literal("code"),
  content: z.string().min(1, "Code block cannot be empty"),
  language: z.string().optional(), // Optional programming language specifier
});

// Divider Block (No content needed)
const dividerBlockSchema = baseBlockSchema.extend({
  type: z.literal("divider"),
});

// Image Block
const imageBlockSchema = baseBlockSchema.extend({
  type: z.literal("image"),
  src: z.string().url("Invalid image URL"),
  caption: z.string().optional(),
});

// Table Schema
const tableCellSchema = baseBlockSchema.extend({
  type: z.literal("table-cell"),
  content: z.string().optional(), // Cells may be empty
});

const tableRowSchema = baseBlockSchema.extend({
  type: z.literal("table-row"),
  children: z.array(tableCellSchema).min(1, "Table row must have at least one cell"),
});

const tableBlockSchema = baseBlockSchema.extend({
  type: z.literal("table"),
  children: z.array(tableRowSchema).min(1, "Table must have at least one row"),
});

// Generic Block Schema (Union of all)
const blockSchema = z.discriminatedUnion("type", [
  headingBlockSchema,
  paragraphBlockSchema,
  listBlockSchema,
  blockquoteBlockSchema,
  codeBlockSchema,
  dividerBlockSchema,
  imageBlockSchema,
  tableBlockSchema,
  tableRowSchema,
  tableCellSchema,
]);

export const blockNoteContentSchema = z.array(blockSchema);
/* ################################################################################################ */

// Zod schema for creating new note
export const createNoteSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(255)
    .trim(),
  // content: z.array(z.any()),
  content: blockNoteContentSchema,
  images: z.array(z.string().url()).optional().default([]), // Must be valid URLs
  favorite: z.boolean().optional().default(false), // Defaults to false
  pinned: z.boolean().optional().default(false), // Defaults to false
  tags: z.array(z.string().trim().min(1)).max(10).optional().default([]),
});

// Zod schema for note update
export const updateNoteSchema = z.object({
  // noteId: z.string({ message: "NoteId is required for updating it" }).min(1, "NoteId is required for updating it"),
  title: z.string().min(1, "Title is required").max(255).optional(),
  content: blockNoteContentSchema,
  images: z.array(z.string().url()).optional(),
  favorite: z.boolean().optional(),
  pinned: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
}).strict();

export const NotesParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId")
    .nonempty("NoteId is required for updating it"),
});

export type BlockNoteContentSchema = z.infer<typeof blockNoteContentSchema>;
export type GetNotesQuerySchema = z.infer<typeof getNotesQuerySchema>;
export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
