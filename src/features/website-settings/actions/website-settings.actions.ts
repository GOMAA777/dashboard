"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

const saveSettingsSchema = z.object({
  tab: z.string(),
  payload: z.record(z.string(), z.any()),
});

export const updateWebsiteSettingsAction = actionClient
  .schema(saveSettingsSchema)
  .action(async ({ parsedInput: { tab, payload } }) => {
    // In production, persists to backend or database
    revalidatePath("/website-settings");
    return {
      success: true,
      message: `تم حفظ وتحديث إعدادات ${tab} بنجاح`,
      data: payload,
    };
  });
