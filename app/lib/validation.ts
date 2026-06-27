import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username may only contain letters, numbers, and underscores"
      ),

    password: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .max(128)
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[!@#$%^&*()_\-+=<>?]/, "Password must contain a special character"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});