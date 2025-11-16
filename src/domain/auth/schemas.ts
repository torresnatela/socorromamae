import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(64),
  fullName: z.string().min(2),
  lgpdAccepted: z.literal(true, {
    errorMap: () => ({
      message: "LGPD consent must be accepted."
    })
  }),
  keepSignedIn: z.boolean().optional().default(false)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  keepSignedIn: z.boolean().optional().default(false)
});

export const refreshSessionSchema = z.object({
  keepSignedIn: z.boolean().optional().default(false)
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email()
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshSessionInput = z.infer<typeof refreshSessionSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
