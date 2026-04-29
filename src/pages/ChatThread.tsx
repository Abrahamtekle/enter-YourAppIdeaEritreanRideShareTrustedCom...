import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { mapProfile } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface Msg { id: string; senderId: string; text: string; createdAt: string }

function formatTime(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatThread() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useApp();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [other, setOther] = useState<User | null>(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !currentUser) return;

    // Fetch other participant
    const fetchOther = async () => {
      const { data } = await supabase
        .from("chat_participants")
        .select("user_id, profiles(*)")
        .eq("chat_id", id)
        .neq("user_id", currentUser.id)
        .limit(1);
      if (data?.[0]?.profiles) {
        setOther(mapProfile(data[0].profiles as Record<string, unknown>));
      }
    };

    // Fetch messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", id)
        .order("created_at", { ascending: true });
      if (data) {
        setMessages(data.map((m) => ({
          id: m.id, senderId: m.sender_id, text: m.text, createdAt: m.created_at,
        })));
      }
    };

    fetchOther();
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "messages",
        filter: `chat_id=eq.${id}`,
      }, (payload) => {
        const m = payload.new as Record<string, string>;
        setMessages((prev) => [...prev, {
          id: m.id, senderId: m.sender_id, text: m.text, createdAt: m.created_at,
        }]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !id || !currentUser) return;
    const text = input.trim();
    setInput("");
    await supabase.from("messages").insert({
      chat_id: id, sender_id: currentUser.id, text,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppShell title={other?.name ?? "Chat"} showBack headerClassName="shrink-0">
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 flex flex-col gap-3">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                <div className={cn(
                  "px-4 py-2.5 max-w-[75%] text-sm",
                  isMe
                    ? "bubble-out bg-bubble-out text-bubble-out-text"
                    : "bubble-in bg-bubble-in text-bubble-in-text border border-border shadow-sm"
                )}>
                  {msg.text}
                </div>
                <p className={cn("text-[10px] text-muted-foreground mt-1", isMe ? "mr-1" : "ml-1")}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

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
