import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

export const triggerSystemUpdateAction = actionClient
  .schema(z.object({ targetVersion: z.string() }))
  .action(async ({ parsedInput }) => {
    return {
      success: true,
      targetVersion: parsedInput.targetVersion,
      initiatedAt: new Date().toISOString(),
    };
  });
