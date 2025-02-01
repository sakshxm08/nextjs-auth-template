import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().length(6, "Your one-time password must be 6 digits."),
});
