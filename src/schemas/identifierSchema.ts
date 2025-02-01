import { z } from "zod";

export const identifierSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or username"),
});
