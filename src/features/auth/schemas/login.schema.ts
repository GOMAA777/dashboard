import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().optional().default(""),
  password: z.string().optional().default(""),
});

export type LoginInput = z.infer<typeof loginSchema>;
