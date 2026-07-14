"use client";

import { useState } from "react";
import { LoginProps } from "../types/types";



export default function LoginScreen({ error, onConnect }: LoginProps) {
  const [username, setUsername] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    onConnect(trimmed);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur"
      >
        <h1 className="mb-1 text-2xl font-semibold text-white">1:1 Chat</h1>
        <p className="mb-6 text-sm text-slate-400">
          Enter a username to connect.
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. tyu"
          className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          autoFocus
        />

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Connect
        </button>
      </form>
    </main>
  );
}