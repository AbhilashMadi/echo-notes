import type { Context } from "hono";

import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

import Note from "@/models/notes.model.js";
import { responseHandler } from "@/utils/response.js";

export default async (c: Context) => {
  const noteId = c.req.param("id");
  const { userId } = c.get("user");

  // Validate ObjectId format
  if (!Types.ObjectId.isValid(noteId) || !Types.ObjectId.isValid(userId)) {
    return c.json(responseHandler(false, "Invalid note ID or user ID"), StatusCodes.BAD_REQUEST);
  }

  // Convert to ObjectId
  const noteObjectId = new Types.ObjectId(noteId);
  const userObjectId = new Types.ObjectId(userId);

  // Fetch the note ensuring it belongs to the authenticated user
  const note = await Note.findOne({
    _id: noteObjectId,
    userId: userObjectId,
  });

  if (!note)
    return c.json(responseHandler(false, "Note not found or unauthorized access"), StatusCodes.NOT_FOUND);

  return c.json(responseHandler(true, `Fetched the note with Id:${note}`, {
    noteId,
    userId,
    note: note.toObject(),
  }), StatusCodes.OK);
};
