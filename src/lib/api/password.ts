/** Strong temporary password for staff create / admin reset. */
export function generateTempPassword(length = 12): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;

  const pick = (alphabet: string) =>
    alphabet.charAt(Math.floor(Math.random() * alphabet.length));

  const chars = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  for (let i = chars.length; i < length; i++) {
    chars.push(pick(all));
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

export type PasswordFieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

/** Client rules for forced password change (Arabic messages). */
export function validateForcedPasswordChange(input: {
  newPassword: string;
  confirmPassword: string;
  currentPassword?: string | null;
}): PasswordFieldErrors {
  const errors: PasswordFieldErrors = {};
  const { newPassword, confirmPassword, currentPassword } = input;

  if (!newPassword || newPassword.length < 8) {
    errors.newPassword = "كلمة المرور يجب ألا تقل عن 8 خانات";
  } else if (!/[A-Za-z\u0600-\u06FF]/.test(newPassword)) {
    errors.newPassword = "كلمة المرور يجب أن تحتوي على أحرف";
  } else if (!/[0-9]/.test(newPassword)) {
    errors.newPassword = "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(newPassword)) {
    errors.newPassword = "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%...)";
  } else if (currentPassword && newPassword === currentPassword) {
    errors.newPassword = "كلمة المرور الجديدة يجب ألا تساوي الكلمة المؤقتة";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "يرجى تأكيد كلمة المرور";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "تأكيد كلمة المرور غير مطابق";
  }

  return errors;
}
