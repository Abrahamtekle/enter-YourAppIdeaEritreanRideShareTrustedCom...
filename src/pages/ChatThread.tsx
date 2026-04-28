import { useParams } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

function formatTime(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatThread() {
  const { id } = useParams<{ id: string }>();
  const { getChatById, getMessagesForChat, getUserById, currentUser, sendMessage } = useApp();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const chat = id ? getChatById(id) : undefined;
  const messages = useMemo(() => id ? getMessagesForChat(id) : [], [id, getMessagesForChat]);
  const otherId = chat?.participantIds.find((pid) => pid !== currentUser.id);
  const other = otherId ? getUserById(otherId) : undefined;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !id) return;
    sendMessage({
      id: `msg-${Date.now()}`,
      chatId: id,
      senderId: currentUser.id,
      text: input.trim(),
      createdAt: new Date().toISOString(),
    });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chat) {
    return (
      <AppShell title="Chat" showBack>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Chat not found.
        </div>
      </AppShell>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <AppShell title={other?.name ?? "Chat"} showBack headerClassName="shrink-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 flex flex-col gap-3">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const sender = getUserById(msg.senderId);

            return (
              <div
                key={msg.id}
                className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
              >
                {!isMe && (
                  <p className="text-xs font-semibold text-muted-foreground mb-1 ml-1">
                    {sender?.name}
                  </p>
                )}
                <div
                  className={cn(
                    "px-4 py-2.5 max-w-[75%] text-sm",
                    isMe
                      ? "bubble-out bg-bubble-out text-bubble-out-text"
                      : "bubble-in bg-bubble-in text-bubble-in-text border border-border shadow-sm"
                  )}
                >
                  {msg.text}
                </div>
                <p
                  className={cn(
                    "text-[10px] text-muted-foreground mt-1",
                    isMe ? "mr-1" : "ml-1"
                  )}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 flex items-center gap-2 z-50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-95 transition-all"
          >
            <Send size={16} className="text-primary-foreground" />
          </button>
        </div>
      </AppShell>
    </div>
  );
}
