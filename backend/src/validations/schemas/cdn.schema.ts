
import { z } from 'zod';

export const deleteAssetSchema = z.object({ 
  url: z.string({ message: "Asset url is required" }).min(1,"Assets url is required for deletion").url("Asset url must be a valid URL"),
 })
export type DeleteAssetDto = z.infer<typeof deleteAssetSchema>; 