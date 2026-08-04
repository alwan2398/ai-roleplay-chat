import { db } from "@/lib/db";
import { messages, personas } from "@/lib/db/schema";
import { and, asc, desc, eq, type InferSelectModel } from "drizzle-orm";

export type Message = InferSelectModel<typeof messages>;

export interface UserChatSummary {
  personaId: string;
  personaName: string;
  personaImageUrl: string;
  lastMessageContent: string;
  lastMessageCreatedAt: Date;
}

/**
 * Fetches all active chat conversations for a specific user grouped by persona,
 * retrieving the latest message and timestamp for each character.
 */
export async function getUserChatSummaries(
  userId: string
): Promise<UserChatSummary[]> {
  try {
    const userMessages = await db
      .select({
        personaId: messages.personaId,
        content: messages.content,
        createdAt: messages.createdAt,
        personaName: personas.name,
        personaImageUrl: personas.imageUrl,
      })
      .from(messages)
      .innerJoin(personas, eq(messages.personaId, personas.id))
      .where(eq(messages.userId, userId))
      .orderBy(desc(messages.createdAt));

    const summaryMap = new Map<string, UserChatSummary>();
    for (const msg of userMessages) {
      if (!summaryMap.has(msg.personaId)) {
        summaryMap.set(msg.personaId, {
          personaId: msg.personaId,
          personaName: msg.personaName,
          personaImageUrl: msg.personaImageUrl,
          lastMessageContent: msg.content,
          lastMessageCreatedAt: msg.createdAt,
        });
      }
    }

    return Array.from(summaryMap.values());
  } catch (error) {
    console.error("Error fetching user chat summaries:", error);
    return [];
  }
}

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
