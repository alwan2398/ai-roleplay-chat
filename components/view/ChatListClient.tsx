"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Trash2, MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { UserChatSummary } from "@/lib/db/queries/messages";
import { deleteUserChat } from "@/lib/actions/chat.actions";
import { Input } from "@/components/ui/input";

interface ChatListClientProps {
  initialChats: UserChatSummary[];
}

function formatChatTimestamp(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatListClient({ initialChats }: ChatListClientProps) {
  const [chats, setChats] = useState<UserChatSummary[]>(initialChats);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredChats = chats.filter((chat) =>
    chat.personaName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (e: React.MouseEvent, personaId: string) => {
    e.stopPropagation();
    e.preventDefault();

    if (deletingId) return;
    setDeletingId(personaId);

    // Optimistically update local state so item disappears instantly
    setChats((prev) => prev.filter((item) => item.personaId !== personaId));

    const result = await deleteUserChat(personaId);
    if (!result.success) {
      // Restore previous chats if server action failed
      setChats(initialChats);
    }
    setDeletingId(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-6">
      {/* Top Navigation Back Link */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white/80 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">Kembali</span>
        </Link>
      </div>

      {/* Page Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
        Chat
      </h2>

      {/* Search Input Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 pointer-events-none z-10" />
        <Input
          type="text"
          placeholder="Search for a profile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10.5 pr-4 h-11 bg-zinc-900/90 border-zinc-800 text-white placeholder:text-zinc-500 rounded-xl focus-visible:ring-violet-500 focus-visible:border-violet-500 text-sm w-full transition-all"
        />
      </div>

      {/* Chat List Items */}
      {filteredChats.length > 0 ? (
        <div className="space-y-2">
          {filteredChats.map((chat) => {
            const cleanSnippet = chat.lastMessageContent.replace(/\*/g, "");
            const isDeleting = deletingId === chat.personaId;

            return (
              <Link
                key={chat.personaId}
                href={`/chat/${chat.personaId}`}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-violet-500/30 transition-all duration-200 cursor-pointer shadow-sm"
              >
                {/* Left: Avatar & Text details */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-violet-500/30 shrink-0">
                    <Image
                      src={chat.personaImageUrl}
                      alt={chat.personaName}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                      {chat.personaName}
                    </h3>
                    <p className="text-xs text-zinc-400 truncate mt-0.5 font-normal">
                      {cleanSnippet}
                    </p>
                  </div>
                </div>

                {/* Right: Timestamp & Delete Button */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[11px] font-medium text-zinc-400">
                    {formatChatTimestamp(chat.lastMessageCreatedAt)}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, chat.personaId)}
                    disabled={isDeleting}
                    title="Hapus Obrolan"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 my-6">
          <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-3 text-violet-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            {searchQuery
              ? "Tidak ada karakter yang cocok"
              : "Belum Ada Riwayat Chat"}
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-4">
            {searchQuery
              ? `Tidak ditemukan karakter dengan nama "${searchQuery}".`
              : "Anda belum pernah memulai percakapan dengan karakter mana pun. Mulailah mengobrol dari halaman Explore!"}
          </p>
          {!searchQuery && (
            <Link
              href="/"
              className="px-4 py-2 text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all shadow-md shadow-violet-600/20"
            >
              Jelajahi Karakter
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
