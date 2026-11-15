"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import {
  updateSubscriptionStatusSchema,
  createSubscriptionSchema,
} from "../schemas/subscription.schemas";

export const updateSubscriptionStatusAction = actionClient
  .schema(updateSubscriptionStatusSchema)
  .action(async ({ parsedInput }) => {
    const { subscriptionId, action, reason } = parsedInput;

    // Simulate database update
    // In production, this writes to PostgreSQL / API Client
    revalidatePath("/subscriptions");

    return {
      success: true,
      subscriptionId,
      action,
      reason,
      timestamp: new Date().toISOString(),
    };
  });

export const createSubscriptionAction = actionClient
  .schema(createSubscriptionSchema)
  .action(async ({ parsedInput }) => {
    // In production, creates subscription record in database
    revalidatePath("/subscriptions");

    return {
      success: true,
      data: parsedInput,
      generatedId: `SUB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
  });
