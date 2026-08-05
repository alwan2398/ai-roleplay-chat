import { db } from "@/lib/db";
import { favorites, personas } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Persona } from "@/lib/db/queries/personas";

/**
 * Fetches all persona records favorited by a specific user.
 * Joins the favorites table with the personas table.
 * @param userId User's unique ID
 */
export async function getUserFavoritePersonas(userId: string): Promise<Persona[]> {
  try {
    const records = await db
      .select({
        id: personas.id,
        creatorId: personas.creatorId,
        imageUrl: personas.imageUrl,
        name: personas.name,
        age: personas.age,
        gender: personas.gender,
        description: personas.description,
        greeting: personas.greeting,
        createdAt: personas.createdAt,
      })
      .from(favorites)
      .innerJoin(personas, eq(favorites.personaId, personas.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return records;
  } catch (error) {
    console.error("Error fetching user favorite personas:", error);
    return [];
  }
}

/**
 * Fetches an array of persona IDs favorited by a specific user.
 * @param userId User's unique ID
 */
export async function getUserFavoriteIds(userId: string): Promise<string[]> {
  try {
    const records = await db
      .select({ personaId: favorites.personaId })
      .from(favorites)
      .where(eq(favorites.userId, userId));

    return records.map((r) => r.personaId);
  } catch (error) {
    console.error("Error fetching user favorite IDs:", error);
    return [];
  }
}
