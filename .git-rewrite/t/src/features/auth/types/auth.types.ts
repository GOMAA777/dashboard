import { LoginInput } from "../schemas/login.schema";

export type { LoginInput };

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
