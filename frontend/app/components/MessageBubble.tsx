import { MsgProps } from "../types/types";

export default function MessageBubble({ message, mine }: MsgProps) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs rounded-2xl px-4 py-2 text-sm sm:max-w-md ${
          mine
            ? "rounded-br-sm bg-indigo-600 text-white"
            : "rounded-bl-sm bg-slate-800 text-slate-100"
        }`}
      >
        {message.message}
        <div
          className={`mt-1 text-[10px] ${
            mine ? "text-indigo-200" : "text-slate-400"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}