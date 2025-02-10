import { Hono } from "hono";

import getNotesController from "@/controllers/notes/get-notes.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import { getNotesQuerySchema } from "@/validations/schemas/notes.schema.js";
import validateRequestDto from "@/validations/validate-request-dto.js";

// Extend Hono to recognize the custom `user` property set in authMiddleware
const useRouter = new Hono<{ Variables: { user: { userId: string } } }>();

useRouter.use(authMiddleware);
useRouter.get("/", validateRequestDto(undefined, getNotesQuerySchema), getNotesController);

export default useRouter;
