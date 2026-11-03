import { type LoginInput } from "../schemas/login.schema";
import { loginAdmin } from "@/lib/api/auth";
import { AUTH_BYPASS } from "@/lib/api/config";
import { setAuthSession } from "@/lib/auth-client";
import { ApiError } from "@/lib/api/http";

/** Local demo token — http layer skips clearAuthSession on 401 for tokens containing "test". */
const BYPASS_TOKEN = "bypass-test-token";

function resolveLoginError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401 || err.status === 403) {
      return err.message || "بيانات تسجيل الدخول أو كلمة المرور غير صحيحة";
    }
    if (err.status === 422) {
      return err.message || "يرجى مراجعة بيانات الدخول المدخلة";
    }
    return err.message || "تعذر تسجيل الدخول. حاول مرة أخرى.";
  }
  if (err && typeof err === "object" && "message" in err) {
    const message = String((err as { message: unknown }).message || "").trim();
    if (message) return message;
  }
  return "تعذر تسجيل الدخول. تحقق من البيانات والمحاولة مرة أخرى.";
}

export async function loginAction(input: LoginInput) {
  const identifier = input.identifier?.trim() || "";
  const password = input.password || "";

  if (!identifier || !password) {
    return {
      data: null,
      serverError: "يرجى إدخال بيانات الدخول وكلمة المرور",
      errorCode: "required" as const,
    };
  }

  // Always try the real API first so login-as-firm / دخول المكتب gets a Sanctum token.
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
      errorCode: null,
    };
  } catch (err: unknown) {
    if (AUTH_BYPASS) {
      const user = {
        id: "bypass-admin",
        name: identifier.includes("@") ? identifier.split("@")[0] : identifier,
        email: identifier.includes("@") ? identifier : `${identifier}@aljudy.sa`,
        role: "admin",
      };
      setAuthSession(BYPASS_TOKEN, user);
      return {
        data: {
          success: true,
          user,
          bypass: true,
        },
        serverError: null,
        errorCode: null,
      };
    }

    const isAuthFailure =
      err instanceof ApiError && (err.status === 401 || err.status === 403);

    return {
      data: null,
      serverError: resolveLoginError(err),
      errorCode: isAuthFailure ? ("invalid_credentials" as const) : ("server" as const),
    };
  }
}
