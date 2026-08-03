import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getPersonaById } from "@/lib/db/queries/personas";
import { getChatHistory } from "@/lib/db/queries/messages";
import { auth } from "@/lib/auth";
import ChatRoomClient from "@/components/view/ChatRoomClient";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatRoomPage({ params }: ChatPageProps) {
  const { id } = await params;
  const persona = await getPersonaById(id);

  if (!persona) {
    notFound();
  }

  // Retrieve logged in user session
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  const userId = session?.user?.id || "guest-user";

  // Fetch chat history from NeonDB
  const chatHistory = await getChatHistory(userId, persona.id);

  return (
    <ChatRoomClient
      persona={persona}
      userId={userId}
      initialChatHistory={chatHistory}
    />
  );
}
