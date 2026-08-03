import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { and, asc, eq, type InferSelectModel } from "drizzle-orm";

export type Message = InferSelectModel<typeof messages>;

/**
 * Fetches past chat messages for a specific user and persona, ordered by createdAt ascending.
 */
export async function getChatHistory(
  userId: string,
  personaId: string
): Promise<Message[]> {
  try {
    const history = await db
      .select()
      .from(messages)
      .where(
        and(eq(messages.userId, userId), eq(messages.personaId, personaId))
      )
      .orderBy(asc(messages.createdAt));

    return history;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}

/**
 * Inserts a single message record into the database.
 */
export async function insertMessage(data: {
  personaId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
}): Promise<Message | null> {
  try {
    const [inserted] = await db
      .insert(messages)
      .values({
        personaId: data.personaId,
        userId: data.userId,
        role: data.role,
        content: data.content,
      })
      .returning();

    return inserted || null;
  } catch (error) {
    console.error(`Error saving ${data.role} message:`, error);
    return null;
  }
}
