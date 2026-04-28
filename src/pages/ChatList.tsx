import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ChatList() {
  const navigate = useNavigate();
  const { chats, getUserById, currentUser } = useApp();

  return (
    <AppShell title="Messages">
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm text-muted-foreground">
          {chats.length} conversation{chats.length !== 1 ? "s" : ""}
        </p>
      </div>

      {chats.length === 0 ? (
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
          {chats.map((chat) => {
            const otherId = chat.participantIds.find((id) => id !== currentUser.id);
            const other = otherId ? getUserById(otherId) : undefined;
            const lastMsg = chat.lastMessage;

            return (
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
                    src={other?.avatarUrl ?? ""}
                    alt={other?.name ?? "User"}
                    className="w-12 h-12 rounded-full border border-border object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {other?.name ?? "Community Member"}
                    </p>
                    {lastMsg && (
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {timeAgo(lastMsg.createdAt)}
                      </span>
                    )}
                  </div>
                  {lastMsg && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {lastMsg.senderId === currentUser.id ? "You: " : ""}
                      {lastMsg.text}
                    </p>
                  )}
                </div>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
