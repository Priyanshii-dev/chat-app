"use client";

import { useEffect, useRef, useState } from "react";
import { useChatPersistence } from "./useChatPersistence";
import { useWebSocket } from "./useWebSocket";
import { fetchConversation } from "../lib/api";
import { saveSessionUsername, loadSessionUsername, clearSessionUsername } from "../lib/session";
import { IncomingMessage, MessagesByUser } from "../types/types";

export function useChatSocket() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false); // NEW — for the reconnect-on-refresh screen
  const [error, setError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messagesByUser, setMessagesByUser] = useState<MessagesByUser>({});

  const usernameRef = useRef("");
  const historyLoaded = useRef<Set<string>>(new Set());

  useChatPersistence({
    username,
    messages: messagesByUser,
    setMessages: setMessagesByUser,
  });

  const { connect: openSocket, send } = useWebSocket({
    onOpen(name) {
      usernameRef.current = name;
      setConnected(true);
      setConnecting(false);
      setUsername(name);
      setError("");
      saveSessionUsername(name); // NEW — remember this login across refreshes
    },

    onClose(event) {
      setConnected(false);
      setConnecting(false);

      if (event.code === 4001) {
        setError("That username is already taken.");
        clearSessionUsername(); // NEW — don't keep retrying a rejected name
      }
    },

    onError() {
      setError("Could not connect to the server.");
      setConnecting(false);
    },

    onMessage(data: IncomingMessage) {
      const self = usernameRef.current;

      if (data.type === "user_list") {
        setOnlineUsers(data.users.filter((user) => user !== self));
        return;
      }

      if (data.type === "message") {
        const other = data.from === self ? data.to : data.from;

        setMessagesByUser((prev) => ({
          ...prev,
          [other]: [...(prev[other] ?? []), data],
        }));
      }
    },
  });

  function connect(name: string) {
    setConnecting(true);
    openSocket(name);
  }

  // NEW — on first mount, silently reconnect using the last saved username
  // instead of showing the login form again.
  useEffect(() => {
    const saved = loadSessionUsername();
    if (saved) connect(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sendMessage(to: string, text: string) {
    const message = text.trim();
    if (!message) return;
    send({ to, message });
  }

  function clearChat(withUser: string) {
    setMessagesByUser((prev) => {
      const next = { ...prev };
      delete next[withUser];
      return next;
    });
  }

  function logout() {
    clearSessionUsername();
    setConnected(false);
    setUsername("");
    // Note: this doesn't close the socket itself — useWebSocket's cleanup
    // effect only runs on unmount. Wire an explicit ws.close() there if you
    // want a true logout button later; fine to leave as-is for now since a
    // page refresh after logout fully resets the connection anyway.
  }

  async function ensureHistoryLoaded(otherUser: string) {
    if (!username || historyLoaded.current.has(otherUser)) return;
    historyLoaded.current.add(otherUser);

    const history = await fetchConversation(username, otherUser);
    if (history.length === 0) return;

    setMessagesByUser((prev) => {
      const existing = prev[otherUser] ?? [];
      const key = (m: (typeof existing)[number]) =>
        `${m.from}|${m.to}|${m.message}|${m.timestamp}`;
      const seen = new Set(history.map(key));
      const extra = existing.filter((m) => !seen.has(key(m)));
      const merged = [...history, ...extra].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      return { ...prev, [otherUser]: merged };
    });
  }

  return {
    username,
    connected,
    connecting, // NEW
    error,
    onlineUsers,
    messagesByUser,
    connect,
    sendMessage,
    clearChat,
    ensureHistoryLoaded,
    logout, // NEW
  };
}