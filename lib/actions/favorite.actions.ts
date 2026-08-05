"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { favorites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Toggles a persona as favorite for the authenticated user.
 * If already favorited, removes the favorite. Otherwise, inserts a new favorite record.
 * @param personaId Persona UUID
 */
export async function toggleFavoriteAction(personaId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Anda harus login terlebih dahulu untuk menyukai karakter.",
        isFavorited: false,
      };
    }

    const userId = session.user.id;

    // Check if the record already exists
    const [existing] = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.personaId, personaId)
        )
      )
      .limit(1);

    if (existing) {
      // Remove from favorites
      await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, userId),
            eq(favorites.personaId, personaId)
          )
        );

      revalidatePath("/favorite");
      revalidatePath("/explore");
      revalidatePath("/");

      return {
        success: true,
        isFavorited: false,
      };
    } else {
      // Add to favorites
      await db.insert(favorites).values({
        userId,
        personaId,
      });

      revalidatePath("/favorite");
      revalidatePath("/explore");
      revalidatePath("/");

      return {
        success: true,
        isFavorited: true,
      };
    }
  } catch (error: any) {
    console.error("Error toggling favorite:", error);
    return {
      success: false,
      error: error.message || "Gagal memperbarui favorit.",
      isFavorited: false,
    };
  }
}
