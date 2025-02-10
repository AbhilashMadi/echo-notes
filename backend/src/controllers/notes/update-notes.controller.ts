import type { Context } from "hono";

import { StatusCodes } from "http-status-codes";

import type { UpdateNoteDto } from "@/validations/schemas/notes.schema.js";

import Note from "@/models/notes.model.js";
import User from "@/models/user.model.js";
import { responseHandler } from "@/utils/response.js";

export default async (c: Context) => {
  // Parse request payload
  const updateDto = await c.req.json<UpdateNoteDto>();
  const { userId } = await c.get("user");
  const noteId = c.req.param("id");

  // Ensure the user exists
  const userExists = await User.exists({ _id: userId }).lean();
  if (!userExists) {
    return c.json(responseHandler(false, "User not found"), StatusCodes.NOT_FOUND);
  }

  // Ensure the note exists and belongs to the user
  const noteExists = await Note.findOne({ _id: noteId, userId }).lean();
  if (!noteExists) {
    return c.json(responseHandler(false, "Note not found or unauthorized"), StatusCodes.NOT_FOUND);
  }

  // Prevent duplicate titles per user (if updating title)
  if (updateDto.title) {
    const titleExists = await Note.exists({ userId, title: updateDto.title }).lean();
    if (titleExists) {
      return c.json(responseHandler(false, "A note with this title already exists"), StatusCodes.BAD_REQUEST);
    }
  }

  // Perform the update and return updated note
  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    { $set: updateDto },
    // Returns updated note & runs validation
    { new: true, runValidators: true } 
  );

  return c.json(responseHandler(true, "Note updated successfully", updatedNote), StatusCodes.OK);
};
