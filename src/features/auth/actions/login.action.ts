import { type LoginInput } from "../schemas/login.schema";
import { loginAdmin } from "@/lib/api/auth";

export async function loginAction(input: LoginInput) {
  const identifier = input.identifier?.trim() || "";
  const password = input.password || "";

  if (!identifier || !password) {
    return {
      data: null,
      serverError: "يرجى إدخال بيانات الدخول وكلمة المرور",
    };
  }

  try {
    const loggedIn = await loginAdmin(identifier, password);
    return {
      data: {
        success: true,
        user: {
          id: String(loggedIn.user?.id ?? "admin"),
          name: String(
            loggedIn.user?.name ||
              (loggedIn.user as { full_name?: string } | null | undefined)
                ?.full_name ||
              "Admin"
          ),
          email:
            String(loggedIn.user?.email ?? "") ||
            (identifier.includes("@")
              ? identifier
              : `${identifier}@aljudy.sa`),
          role: String(loggedIn.user?.role ?? "admin"),
        },
      },
      serverError: null,
    };
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "تعذر تسجيل الدخول. تحقق من البيانات والمحاولة مرة أخرى.";
    return {
      data: null,
      serverError: message,
    };
  }
}
