"use client";

import { useState } from "react";
import { useChatSocket } from "../hooks/useChatSocket";
import LoginScreen from "../components/LoginScreen";
import Sidebar from "../components/Sidebar";
import ChatPanel from "../components/ChatPanel";

export default function ChatPage() {
  const {
    username,
    connected,
    connecting,
    error,
    onlineUsers,
    messagesByUser,
    connect,
    sendMessage,
    clearChat,
    ensureHistoryLoaded,
  } = useChatSocket();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  if (connecting) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-slate-400">
        Reconnecting…
      </main>
    );
  }

  if (!connected) {
    return <LoginScreen error={error} onConnect={connect} />;
  }

  return (
    <main className="flex h-screen">
      <Sidebar
        username={username}
        onlineUsers={onlineUsers}
        selectedUser={selectedUser}
        onSelectUser={(user) => {
          setSelectedUser(user);
          ensureHistoryLoaded(user);
        }}
      />

      <section className="flex flex-1 flex-col">
        {selectedUser ? (
          <ChatPanel
            username={username}
            selectedUser={selectedUser}
            messages={messagesByUser[selectedUser] ?? []}
            onSend={(text) => sendMessage(selectedUser, text)}
            onClearChat={() => clearChat(selectedUser)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
            Select someone from the sidebar to start chatting.
          </div>
        )}
      </section>
    </main>
  );
}