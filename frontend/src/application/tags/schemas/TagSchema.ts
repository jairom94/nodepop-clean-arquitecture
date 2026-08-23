import { z } from "zod";

export const TagSchema = z.object({
  id: z.number().nullable(),
  name: z.string(),
});

export type TagDto = z.infer<typeof TagSchema>;
