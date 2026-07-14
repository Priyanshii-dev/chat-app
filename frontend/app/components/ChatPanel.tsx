"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { ChatProps } from "../types/types";


export default function ChatPanel({
  username,
  selectedUser,
  messages,
  onSend,
  onClearChat,
}: ChatProps) {
  const [draft, setDraft] = useState("");
  const [confirmingClear, setConfirmingClear] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Reset the confirm state whenever the conversation changes
  useEffect(() => {
    setConfirmingClear(false);
  }, [selectedUser]);

  const handleSend = () => {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  };

  const handleClearClick = () => {
    if (confirmingClear) {
      onClearChat();
      setConfirmingClear(false);
    } else {
      setConfirmingClear(true);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <p className="font-medium text-white">{selectedUser}</p>
        <button
          onClick={handleClearClick}
          onBlur={() => setConfirmingClear(false)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            confirmingClear
              ? "bg-red-600 text-white hover:bg-red-500"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {confirmingClear ? "Click again to confirm" : "Clear chat"}
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-6 py-4"
      >
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">
            No messages yet. Say hi 👋
          </p>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} mine={m.from === username} />
        ))}
      </div>

      <div className="border-t border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={`Message ${selectedUser}`}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSend}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}