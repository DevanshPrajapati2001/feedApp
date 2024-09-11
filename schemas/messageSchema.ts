import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content must be having at least 10 characters" })
    .max(300, {
      message: "content must be having no more than 300 characters",
    }),
});
