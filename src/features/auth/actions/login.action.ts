import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { loginAdmin } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";

export interface LoginActionResult {
  data: {
    success: boolean;
    mustChangePassword?: boolean;
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
      mustChangePassword?: boolean;
    };
  } | null;
  serverError: string | null;
  fieldErrors?: Partial<Record<keyof LoginInput, string>>;
  errorCode: "validation" | "invalid_credentials" | "forbidden" | "server" | null;
}

function resolveLoginError(err: unknown): {
  message: string;
  fieldErrors?: Partial<Record<keyof LoginInput, string>>;
  code: "invalid_credentials" | "forbidden" | "validation" | "server";
} {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      return {
        message: err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        code: "invalid_credentials",
      };
    }
    if (err.status === 403) {
      return {
        message: err.message || "ليس لديك صلاحية الوصول إلى هذه اللوحة",
        code: "forbidden",
      };
    }
    if (err.status === 422) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      const raw = err.raw as { errors?: Record<string, string[]> } | undefined;
      if (raw?.errors) {
        if (raw.errors.login?.[0] || raw.errors.email?.[0]) {
          fieldErrors.identifier = raw.errors.login?.[0] || raw.errors.email?.[0];
        }
        if (raw.errors.password?.[0]) {
          fieldErrors.password = raw.errors.password[0];
        }
      }
      return {
        message: err.message || "يرجى مراجعة بيانات الدخول المدخلة وتصحيحها",
        fieldErrors,
        code: "validation",
      };
    }
    return {
      message: err.message || "تعذر تسجيل الدخول. تحقق من الاتصال والمحاولة مرة أخرى.",
      code: "server",
    };
  }

  if (err && typeof err === "object" && "message" in err) {
    const message = String((err as { message: unknown }).message || "").trim();
    if (message) {
      return { message, code: "server" };
    }
  }

  return {
    message: "تعذر تسجيل الدخول. تحقق من صحة البيانات والمحاولة مرة أخرى.",
    code: "server",
  };
}

export async function loginAction(input: LoginInput): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof LoginInput;
      if (field) {
        fieldErrors[field] = issue.message;
      }
    });
    return {
      data: null,
      serverError: "يرجى إدخال بريد إلكتروني صحيح وكلمة المرور",
      fieldErrors,
      errorCode: "validation",
    };
  }

  const { identifier, password } = parsed.data;

  try {
    const loggedIn = await loginAdmin(identifier, password);
    const user = loggedIn.user;

    const mustChangePassword = !!user?.mustChangePassword;

    return {
      data: {
        success: true,
        mustChangePassword,
        user: {
          id: String(user?.id ?? "admin"),
          name: String(
            user?.name ||
              (user as { full_name?: string } | null | undefined)?.full_name ||
              "Admin"
          ),
          email: String(user?.email ?? identifier),
          role: String(user?.role ?? "admin"),
          mustChangePassword,
        },
      },
      serverError: null,
      fieldErrors: undefined,
      errorCode: null,
    };
  } catch (err: unknown) {
    const resolved = resolveLoginError(err);
    return {
      data: null,
      serverError: resolved.message,
      fieldErrors: resolved.fieldErrors,
      errorCode: resolved.code,
    };
  }
}
