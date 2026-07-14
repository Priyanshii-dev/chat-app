"use client";

import { useState } from "react";
import { useChatPersistence } from "./useChatPersistence";
import { useWebSocket } from "./useWebSocket";
import { IncomingMessage,MessagesByUser } from "../types/types";


export function useChatSocket() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messagesByUser, setMessagesByUser] =
    useState<MessagesByUser>({});

  useChatPersistence({
    username,
    messages: messagesByUser,
    setMessages: setMessagesByUser,
  });

  const { connect: openSocket, send } = useWebSocket({
    onOpen(name) {
      setConnected(true);
      setUsername(name);
      setError("");
    },

    onClose(event) {
      setConnected(false);

      if (event.code === 4001) {
        setError("That username is already taken.");
      }
    },

    onError() {
      setError("Could not connect to the server.");
    },

    onMessage(data: IncomingMessage) {
      if (data.type === "user_list") {
        setOnlineUsers(
          data.users.filter((user) => user !== username)
        );
        return;
      }

      if (data.type === "message") {
        const other =
          data.from === username ? data.to : data.from;

        setMessagesByUser((prev) => ({
          ...prev,
          [other]: [...(prev[other] ?? []), data],
        }));
      }
    },
  });

  function connect(name: string) {
    openSocket(name);
  }

  function sendMessage(to: string, text: string) {
    const message = text.trim();

    if (!message) return;

    send({
      to,
      message,
    });
  }

  function clearChat(withUser: string) {
    setMessagesByUser((prev) => {
      const next = { ...prev };
      delete next[withUser];
      return next;
    });
  }

  return {
    username,
    connected,
    error,
    onlineUsers,
    messagesByUser,
    connect,
    sendMessage,
    clearChat,
  };
}