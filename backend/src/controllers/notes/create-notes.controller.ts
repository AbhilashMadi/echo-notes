import type { Context } from "hono";

import { StatusCodes } from "http-status-codes";

import type { CreateNoteSchema } from "@/validations/schemas/notes.schema.js";

import Note from "@/models/notes.model.js";
import User from "@/models/user.model.js";
import { responseHandler } from "@/utils/response.js";

export default async (c: Context) => {
  // Extract and validate request body
  const note = await c.req.json<CreateNoteSchema>();
  const { userId } = await c.get("user");

  // Verify if the user exists (Fast Existence Check)
  const userExists = await User.exists({ _id: userId }).lean();
  if (!userExists)
    return c.json(responseHandler(false, "User does not exist"), StatusCodes.NOT_FOUND);

  // Ensure no duplicate notes with the same title exist for the user
  const noteExists = await Note.exists({ userId, title: note.title }).lean();
  if (noteExists)
    return c.json(responseHandler(false, "A note with this title already exists"), StatusCodes.BAD_REQUEST);

  // Create and save new note
  const newNote = await Note.create({ ...note, userId });

  return c.json(responseHandler(true, "Note created successfully", newNote), StatusCodes.CREATED);
};
