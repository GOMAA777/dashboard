import { actionClient } from "@/lib/safe-action";
import { generalSettingsSchema } from "../schemas/general-settings.schema";
import { currencySchema } from "../schemas/currency-settings.schema";
import { languageSchema } from "../schemas/language-settings.schema";
import { z } from "zod";

export const saveGeneralSettingsAction = actionClient
  .schema(generalSettingsSchema)
  .action(async ({ parsedInput }) => {
    return { success: true, data: parsedInput };
  });

export const addCurrencyAction = actionClient
  .schema(currencySchema)
  .action(async ({ parsedInput }) => {
    return {
      success: true,
      data: parsedInput,
      id: `cur-${Date.now()}`,
    };
  });

export const deleteCurrencyAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    return { success: true, id: parsedInput.id };
  });

export const addLanguageAction = actionClient
  .schema(languageSchema)
  .action(async ({ parsedInput }) => {
    return {
      success: true,
      data: parsedInput,
      id: `lang-${Date.now()}`,
    };
  });

export const deleteLanguageAction = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    return { success: true, id: parsedInput.id };
  });
