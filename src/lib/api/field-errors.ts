/** Extract Laravel 422 field errors into a flat Arabic-ready map. */
export function extractFieldErrors(body: unknown): Record<string, string> {
  if (!body || typeof body !== "object") return {};
  const errors = (body as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object") return {};

  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    if (Array.isArray(value) && typeof value[0] === "string") {
      out[key] = value[0];
    } else if (typeof value === "string") {
      out[key] = value;
    }
  }
  return out;
}

/** Map API field names to local form keys when they differ. */
export function mapStaffFormFieldErrors(
  apiErrors: Record<string, string>
): Partial<
  Record<
    "name" | "email" | "phone" | "roleId" | "departmentId" | "password",
    string
  >
> {
  const mapped: Partial<
    Record<
      "name" | "email" | "phone" | "roleId" | "departmentId" | "password",
      string
    >
  > = {};
  if (apiErrors.name) mapped.name = apiErrors.name;
  if (apiErrors.email) mapped.email = apiErrors.email;
  if (apiErrors.phone) mapped.phone = apiErrors.phone;
  if (apiErrors.password) mapped.password = apiErrors.password;
  if (apiErrors.role_id) mapped.roleId = apiErrors.role_id;
  if (apiErrors.department_id) mapped.departmentId = apiErrors.department_id;
  if (apiErrors.emp_code) mapped.name = mapped.name || apiErrors.emp_code;
  return mapped;
}
