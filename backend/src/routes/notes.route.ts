import { Hono } from "hono";

import createNotesController from "@/controllers/notes/create-notes.controller.js";
import deleteNotesController from "@/controllers/notes/delete-notes.controller.js";
import getNotesController from "@/controllers/notes/get-notes.controller.js";
import getSpecificNoteController from "@/controllers/notes/get-specific-note.controller.js";
import updateNotesController from "@/controllers/notes/update-notes.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import {
  createNoteSchema,
  getNotesQuerySchema,
  NotesParamsSchema,
  updateNoteSchema,
} from "@/validations/schemas/notes.schema.js";
import validateRequestDto from "@/validations/validate-request-dto.js";

// Extend Hono to recognize the custom `user` property set in authMiddleware
const useRouter = new Hono<{ Variables: { user: { userId: string } } }>();

useRouter.use(authMiddleware);
useRouter.get("/", validateRequestDto(undefined, getNotesQuerySchema), getNotesController);
useRouter.get("/:id", validateRequestDto(undefined, undefined, NotesParamsSchema), getSpecificNoteController);
useRouter.post("/", validateRequestDto(createNoteSchema), createNotesController);
useRouter.patch("/:id", validateRequestDto(updateNoteSchema, undefined, NotesParamsSchema), updateNotesController);
useRouter.delete("/:id", validateRequestDto(undefined, undefined, NotesParamsSchema), deleteNotesController);

export default useRouter;
