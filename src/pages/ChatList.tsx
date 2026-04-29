import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { mapProfile } from "@/lib/db";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

interface ChatItem {
  id: string;
  other: User;
  lastMessage?: { text: string; createdAt: string; senderId: string };
}

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ChatList() {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useApp();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !currentUser) { setLoading(false); return; }

    const fetchChats = async () => {
      // Get chat IDs where I'm a participant
      const { data: participantRows } = await supabase
        .from("chat_participants")
        .select("chat_id")
        .eq("user_id", currentUser.id);

      const chatIds = participantRows?.map((p) => p.chat_id) || [];
      if (chatIds.length === 0) { setLoading(false); return; }

      // For each chat, get the other participant and last message
      const chatItems: ChatItem[] = [];
      for (const chatId of chatIds) {
        const { data: participants } = await supabase
          .from("chat_participants")
          .select("user_id, profiles(*)")
          .eq("chat_id", chatId)
          .neq("user_id", currentUser.id)
          .limit(1);

        const otherProfile = participants?.[0]?.profiles;
        if (!otherProfile) continue;

        const { data: lastMsg } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        chatItems.push({
          id: chatId,
          other: mapProfile(otherProfile as Record<string, unknown>),
          lastMessage: lastMsg
            ? { text: lastMsg.text, createdAt: lastMsg.created_at, senderId: lastMsg.sender_id }
            : undefined,
        });
      }
      setChats(chatItems);
      setLoading(false);
    };

    fetchChats();
  }, [currentUser, isLoggedIn]);

  return (
    <AppShell title="Messages">
      <div className="px-4 pt-4 pb-2">
        {!loading && (
          <p className="text-sm text-muted-foreground">
            {chats.length} conversation{chats.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {loading ? (
        <div className="px-4 flex flex-col gap-3">
          {[1, 2].map((i) => <div key={i} className="h-16 rounded-lg bg-muted shimmer" />)}
        </div>
      ) : chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <MessageCircle size={28} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Book a ride to start chatting with drivers.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors w-full text-left",
                "active:bg-muted"
              )}
            >
              <div className="relative shrink-0">
                <img
                  src={chat.other.avatarUrl}
                  alt={chat.other.name}
                  className="w-12 h-12 rounded-full border border-border object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-foreground truncate">{chat.other.name}</p>
                  {chat.lastMessage && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {timeAgo(chat.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {chat.lastMessage.senderId === currentUser?.id ? "You: " : ""}
                    {chat.lastMessage.text}
                  </p>
                )}
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      )}
    </AppShell>
  );
}
