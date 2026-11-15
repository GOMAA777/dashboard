"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

export const triggerSystemUpdateAction = actionClient
  .schema(z.object({ targetVersion: z.string() }))
  .action(async ({ parsedInput }) => {
    revalidatePath("/utility/update");
    return {
      success: true,
      targetVersion: parsedInput.targetVersion,
      initiatedAt: new Date().toISOString(),
    };
  });
