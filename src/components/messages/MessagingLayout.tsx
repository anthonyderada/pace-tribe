import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ChatRoom } from "./ChatRoom";

interface ChatPreview {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string | null;
  lastMessage?: string;
  lastMessageTime?: string;
}

export const MessagingLayout = () => {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      // Get unique users from messages
      const { data: messageUsers, error } = await supabase
        .from('messages')
        .select(`
          sender_id,
          recipient_id,
          content,
          created_at,
          profiles!messages_sender_id_fkey (
            username,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chats:', error);
        return;
      }

      // Process messages to get unique chats
      const uniqueChats = new Map<string, ChatPreview>();
      
      messageUsers?.forEach((msg) => {
        const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        
        if (!uniqueChats.has(otherUserId)) {
          uniqueChats.set(otherUserId, {
            recipientId: otherUserId,
            recipientName: msg.profiles?.username || 'Unknown User',
            recipientAvatar: msg.profiles?.avatar_url,
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
          });
        }
      });

      setChats(Array.from(uniqueChats.values()));
    };

    fetchChats();
  }, [user]);

  return (
    <div className="flex h-[400px] rounded-md border bg-zinc-900/90">
      {/* Sidebar */}
      <div className="w-80 border-r border-zinc-800">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.recipientId}
                onClick={() => setSelectedChat(chat)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors ${
                  selectedChat?.recipientId === chat.recipientId ? 'bg-zinc-800' : ''
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={chat.recipientAvatar || undefined} />
                  <AvatarFallback>{chat.recipientName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-100">{chat.recipientName}</p>
                  {chat.lastMessage && (
                    <p className="text-xs text-zinc-400 truncate">{chat.lastMessage}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatRoom
            recipientId={selectedChat.recipientId}
            recipientName={selectedChat.recipientName}
            recipientAvatar={selectedChat.recipientAvatar}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};