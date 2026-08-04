import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserChatSummaries } from "@/lib/db/queries/messages";
import ChatListClient from "@/components/view/ChatListClient";

export const metadata = {
  title: "Chat History - Love AI",
  description: "Daftar percakapan Anda dengan karakter AI.",
};

export default async function ChatAllPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session || !session.user) {
    redirect("/?showLogin=true");
  }

  const userChats = await getUserChatSummaries(session.user.id);

  return <ChatListClient initialChats={userChats} />;
}
