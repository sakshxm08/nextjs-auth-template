import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain alphanumeric characters and underscores"
  );

export const emailValidation = z.string().email("Invalid email address");

export const signupSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: z.string().min(6, "Password must be at least 6 characters"),
});
