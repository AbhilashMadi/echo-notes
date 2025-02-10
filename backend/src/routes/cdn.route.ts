import { Hono } from "hono";

import deleteImageController from "@/controllers/cnd/delete-image.controller.js";
import uploadImageController from "@/controllers/cnd/upload-image.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import validateRequest from "@/validations/validate-request-dto.js";
import { deleteAssetSchema } from "@/validations/schemas/cdn.schema.js";

const useRoute = new Hono();

useRoute.use(authMiddleware);
useRoute.post("/image", uploadImageController);
useRoute.delete("/image",validateRequest(deleteAssetSchema), deleteImageController);

export default useRoute;