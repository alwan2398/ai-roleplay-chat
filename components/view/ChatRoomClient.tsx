"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  SendHorizontal,
  Volume2,
  Asterisk,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Persona } from "@/lib/db/queries/personas";
import { Message as DbMessage } from "@/lib/db/queries/messages";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { formatRoleplayText } from "@/lib/utils";

interface ChatRoomClientProps {
  persona: Persona;
  userId: string;
  initialChatHistory: DbMessage[];
}

/**
 * Utility function to extract raw text content safely from a UIMessage
 * (handles both traditional .content strings and AI SDK 5.0 .parts arrays).
 */
function getMessageContent(msg: UIMessage): string {
  if (typeof (msg as any).content === "string" && (msg as any).content) {
    return (msg as any).content;
  }
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  }
  return "";
}

export default function ChatRoomClient({
  persona,
  userId,
  initialChatHistory,
}: ChatRoomClientProps) {
  const [input, setInput] = useState("");

  // Map initial history loaded from NeonDB or default to character greeting
  const defaultInitialMessages: UIMessage[] =
    initialChatHistory.length > 0
      ? initialChatHistory.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          parts: [{ type: "text" as const, text: m.content }],
        }))
      : [
          {
            id: `greeting-${persona.id}`,
            role: "assistant" as const,
            parts: [{ type: "text" as const, text: persona.greeting }],
          },
        ];

  // Vercel AI SDK 5.0 integration with DefaultChatTransport
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: defaultInitialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        personaId: persona.id,
        userId,
      },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll smooth to bottom whenever messages update or stream
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Adjust elastic textarea height dynamically
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 160);
      textarea.style.height = `${newHeight}px`;
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleInsertAsterisks = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? input.length;
    const end = textarea.selectionEnd ?? input.length;

    const before = input.slice(0, start);
    const selected = input.slice(start, end);
    const after = input.slice(end);

    const newInput = `${before}*${selected}*${after}`;
    if (newInput.length > 1000) return;

    setInput(newInput);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + 1 + selected.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      adjustTextareaHeight();
    }, 0);
  };

  // Reset Chat Functionality
  const handleResetChat = () => {
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text" as const, text: persona.greeting }],
      },
    ]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    toast.add({
      title: "Percakapan Direset",
      description: `Riwayat percakapan dengan ${persona.name} telah direset.`,
      type: "info",
    });
  };

  const handleSendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    sendMessage({ text: trimmed });
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Check if last message is from user while waiting for first assistant token
  const lastMessageIsUser =
    messages.length > 0 && messages[messages.length - 1].role === "user";

  return (
    <div className="relative flex flex-col h-[calc(100vh-1rem)] md:h-screen w-full bg-linear-to-b from-[#160d21] via-[#0f0a17] to-[#09050e] text-white overflow-hidden">
      {/* 1. CHAT HEADER UI */}
      <header className="sticky top-0 z-30 w-full bg-[#120a1c]/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between px-4 md:px-6 py-3">
          {/* Top-Left: Back Arrow & Persona Avatar / Profile */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Kembali ke Explore"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-violet-500/40 shadow-sm shrink-0">
              <Image
                src={persona.imageUrl}
                alt={persona.name}
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight leading-none">
                  {persona.name}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300">
                  {persona.age}th
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
          </div>

          {/* Top-Right: Settings / Reset Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="Reset Percakapan"
            >
              <Settings className="w-5 h-5 text-zinc-300 hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. CHAT AREA & MESSAGES */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto w-full p-4 md:p-6 space-y-4">
          {messages.map((msg: UIMessage) => {
            const isPersona = msg.role === "assistant";
            const rawContent = getMessageContent(msg);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isPersona ? "items-start" : "items-end"
                } space-y-1`}
              >
                <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
                  {/* Show persona avatar beside assistant messages */}
                  {isPersona && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-violet-500/30 shrink-0 mt-0.5">
                      <Image
                        src={persona.imageUrl}
                        alt={persona.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`relative px-4 py-3 text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                      isPersona
                        ? "bg-[#211633]/90 text-zinc-100 rounded-2xl rounded-tl-xs border border-violet-500/10 shadow-md"
                        : "bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-2xl rounded-tr-xs shadow-md shadow-violet-600/20"
                    }`}
                  >
                    {formatRoleplayText(rawContent)}
                  </div>
                </div>

                {/* Audio button for persona response */}
                <div className="flex items-center gap-1.5 px-1 text-[10px] text-zinc-400">
                  {isPersona && rawContent && (
                    <button
                      type="button"
                      className="p-1 rounded-full hover:bg-white/10 text-violet-400 hover:text-violet-300 transition-colors"
                      title="Dengarkan Suara"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing / Streaming Loading Indicator */}
          {isLoading && lastMessageIsUser && (
            <div className="flex items-start gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-violet-500/30 shrink-0 mt-0.5">
                <Image
                  src={persona.imageUrl}
                  alt={persona.name}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div className="bg-[#211633]/90 px-4 py-3 rounded-2xl rounded-tl-xs border border-violet-500/10 text-zinc-400 flex items-center gap-1.5">
                <span className="text-xs text-zinc-400 mr-1">
                  {persona.name} sedang mengetik
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}

          {/* Empty div for auto-scrolling to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 3. ELASTIC TEXTAREA INPUT BAR */}
      <footer className="sticky bottom-0 z-30 w-full bg-[#120a1c]/95 backdrop-blur-xl border-t border-white/10 py-3 md:py-4">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
          <form
            onSubmit={onFormSubmit}
            className="w-full flex items-end gap-2 bg-zinc-900/90 border border-zinc-800 focus-within:border-violet-500/60 rounded-3xl p-2 pl-3.5 transition-all shadow-inner relative"
          >
            {/* Action Asterisk Shortcut Button */}
            <button
              type="button"
              onClick={handleInsertAsterisks}
              title="Tambah Aksi Roleplay (*tindakan*)"
              className="p-2 mb-1 rounded-full bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 transition-all border border-violet-500/20 shrink-0 cursor-pointer"
            >
              <Asterisk className="w-4 h-4" />
            </button>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              maxLength={1000}
              placeholder={`Ketik pesan untuk ${persona.name}...`}
              rows={1}
              className="flex-1 min-h-9.5 max-h-40 bg-transparent border-none text-sm md:text-base text-white placeholder:text-zinc-500 focus-visible:ring-0 resize-none py-2 px-0 outline-none shadow-none leading-relaxed overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
            />

            <div className="flex items-center gap-2 mb-1 shrink-0">
              {/* Send Button */}
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="icon"
                className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white shrink-0 transition-transform active:scale-95 cursor-pointer shadow-lg shadow-violet-600/30"
              >
                <SendHorizontal className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}
