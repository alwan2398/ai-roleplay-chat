"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteUserChat(personaId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .delete(messages)
      .where(
        and(
          eq(messages.userId, session.user.id),
          eq(messages.personaId, personaId)
        )
      );

    revalidatePath("/chat");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting chat:", error);
    return {
      success: false,
      error: error.message || "Failed to delete chat records.",
    };
  }
}
