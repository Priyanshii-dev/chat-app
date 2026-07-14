import { SidebarProps } from "../types/types";

export default function Sidebar({
  username,
  onlineUsers,
  selectedUser,
  onSelectUser,
}: SidebarProps) {
  return (
    <aside className="flex w-72 flex-col border-r border-slate-800 bg-slate-900/40">
      <div className="border-b border-slate-800 px-5 py-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Signed in as
        </p>
        <p className="truncate text-sm font-medium text-white">{username}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <p className="px-3 pb-2 text-xs uppercase tracking-wide text-slate-500">
          Online ({onlineUsers.length})
        </p>

        {onlineUsers.length === 0 && (
          <p className="px-3 text-sm text-slate-500">
            No one else is online right now.
          </p>
        )}

        {onlineUsers.map((user) => (
          <button
            key={user}
            onClick={() => onSelectUser(user)}
            className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
              selectedUser === user
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
            <span className="truncate">{user}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}