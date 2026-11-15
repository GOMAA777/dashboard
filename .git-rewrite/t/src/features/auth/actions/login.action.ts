import { loginSchema, type LoginInput } from "../schemas/login.schema";

export async function loginAction(input: LoginInput) {
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    return {
      serverError: result.error.issues[0]?.message || "Validation failed",
      data: null,
    };
  }

  const { identifier, password } = result.data;

  // Validate credentials
  if (!identifier || !password) {
    return {
      serverError: "Invalid credentials provided.",
      data: null,
    };
  }

  return {
    data: {
      success: true,
      user: {
        id: "usr_1",
        name: "Eljudy Prog",
        email: identifier.includes("@") ? identifier : `${identifier}@eljudy.com`,
        role: "admin",
      },
    },
    serverError: null,
  };
}
