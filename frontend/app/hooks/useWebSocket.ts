import { useEffect, useRef } from "react";
import { createWebSocket } from "../lib/websocket";
import { IncomingMessage } from "../types/types";


interface Props {
  onOpen: (username: string) => void;
  onClose: (event: CloseEvent) => void;
  onError: () => void;
  onMessage: (message: IncomingMessage) => void;
}

export function useWebSocket({
  onOpen,
  onClose,
  onError,
  onMessage,
}: Props) {
  const wsRef = useRef<WebSocket | null>(null);

  function connect(username: string) {
    const ws = createWebSocket(username);

    ws.onopen = () => onOpen(username);

    ws.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    ws.onclose = onClose;

    ws.onerror = onError;

    wsRef.current = ws;
  }

  function send(data: unknown) {
    if (!wsRef.current) return;

    wsRef.current.send(JSON.stringify(data));
  }

  useEffect(() => {
    return () => wsRef.current?.close();
  }, []);

  return {
    connect,
    send,
  };
}