import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

const saveSettingsSchema = z.object({
  tab: z.string(),
  payload: z.record(z.string(), z.any()),
});

export const updateWebsiteSettingsAction = actionClient
  .schema(saveSettingsSchema)
  .action(async ({ parsedInput: { tab, payload } }) => {
    return {
      success: true,
      message: `تم حفظ وتحديث إعدادات ${tab} بنجاح`,
      data: payload,
    };
  });
