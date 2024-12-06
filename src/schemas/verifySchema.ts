import { z } from "zod";

export const verifySchema = z.object({
  // username: z.string().min(3, "Username must be at least 3 characters long"),
  code: z
    .string()
    .length(6, { message: "Code must be at least 3 characters long" }),
});
