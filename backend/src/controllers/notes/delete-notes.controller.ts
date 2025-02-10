import type { Context } from 'hono';

import Note from "@/models/notes.model.js";
import User from "@/models/user.model.js";

import { responseHandler } from "@/utils/response.js";
import { StatusCodes } from "http-status-codes";

export default async (c: Context) => {
  const noteId = c.req.param("id");
  const { userId } = c.get("user");

  const existingUser = await User.exists({ _id: userId }).lean();
  if (!existingUser) return c.json(responseHandler(false, "User not found."), StatusCodes.NOT_FOUND);

  const { deletedCount } = await Note.deleteOne({ _id: noteId, userId });
  return c.json(responseHandler(
    deletedCount > 0, 
    deletedCount ? "Note deleted successfully." : "Note not found."), 
    deletedCount ? StatusCodes.OK : StatusCodes.BAD_REQUEST);
}