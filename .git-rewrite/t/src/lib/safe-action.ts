import { createSafeActionClient } from "next-safe-action";

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ActionError) {
      return e.message;
    }
    console.error("Internal Server Action Error:", e);
    return "An unexpected server error occurred.";
  },
});
