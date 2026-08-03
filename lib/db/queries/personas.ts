import { db } from "@/lib/db";
import { personas } from "@/lib/db/schema";
import { desc, eq, type InferSelectModel } from "drizzle-orm";

export type Persona = InferSelectModel<typeof personas>;

/**
 * Fetches recent personas ordered by creation date descending.
 * @param limit Maximum number of records to return (default: 20)
 */
export async function getRecentPersonas(limit: number = 20): Promise<Persona[]> {
  try {
    const records = await db
      .select()
      .from(personas)
      .orderBy(desc(personas.createdAt))
      .limit(limit);

    return records;
  } catch (error) {
    console.error("Error fetching recent personas:", error);
    return [];
  }
}

/**
 * Fetches a single persona record by its unique ID.
 * @param id Persona UUID
 */
export async function getPersonaById(id: string): Promise<Persona | null> {
  try {
    const [record] = await db
      .select()
      .from(personas)
      .where(eq(personas.id, id))
      .limit(1);

    return record || null;
  } catch (error) {
    console.error("Error fetching persona by ID:", error);
    return null;
  }
}
