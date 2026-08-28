"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Board = { id: string; name: string; description?: string; privacy?: string; pin_count?: number };
type Status = { connected: boolean; username?: string | null; accountType?: string | null; scope?: string; error?: string };

export default function PinterestPage() {
  const [status, setStatus] = useState<Status>({ connected: false });
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardName, setBoardName] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const response = await fetch("/api/pinterest/status", { cache: "no-store" });
    const data = await response.json();
    setStatus(data);
    if (data.connected) {
      const boardsResponse = await fetch("/api/pinterest/boards", { cache: "no-store" });
      const boardsData = await boardsResponse.json();
      setBoards(boardsData.items || []);
    }
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function createBoard() {
    if (!boardName.trim()) return;
    setMessage("Creating board...");
    const response = await fetch("/api/pinterest/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: boardName.trim() }),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || "Could not create board");
    setBoardName("");
    setMessage("Board created.");
    await load();
  }

  async function disconnect() {
    await fetch("/api/pinterest/disconnect", { method: "POST" });
    setBoards([]);
    setStatus({ connected: false });
    setMessage("Pinterest disconnected from this browser.");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400">Nectar Engine / Pinterest</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Pinterest Control Room</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Connect Pinterest, inspect boards, and give Nectar a real publishing lane. Trial Pins stay visible only to their creator until Standard access is approved.</p>
        </div>
        <Link href="/generator" className="text-sm text-amber-400 hover:underline">Back to Nectar Generator →</Link>
      </div>

      <section className="rounded-2xl border border-border bg-card/60 p-6 shadow-xl">
        {loading ? <p className="text-muted-foreground">Checking Pinterest connection...</p> : status.connected ? (
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm text-emerald-400">● Connected</div>
              <div className="mt-1 text-2xl font-semibold">@{status.username || "Pinterest account"}</div>
              <div className="mt-2 text-xs text-muted-foreground">Scopes: {status.scope}</div>
            </div>
            <button onClick={disconnect} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">Disconnect</button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm text-amber-400">● Not connected</div>
              <div className="mt-1 text-2xl font-semibold">Connect your Pinterest account</div>
              {status.error && <p className="mt-2 text-sm text-red-400">{status.error}</p>}
            </div>
            <a href="/api/pinterest/auth" className="rounded-lg bg-amber-400 px-5 py-3 text-center text-sm font-semibold text-black hover:bg-amber-300">Connect Pinterest</a>
          </div>
        )}
      </section>

      {status.connected && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Boards</h2>
                <p className="mt-1 text-sm text-muted-foreground">The publishing destinations Nectar can see.</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{boards.length} loaded</span>
            </div>
            <div className="mt-6 space-y-3">
              {boards.length ? boards.map((board) => (
                <div key={board.id} className="rounded-xl border border-border/70 p-4">
                  <div className="font-medium">{board.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{board.privacy || "PUBLIC"} · {board.pin_count ?? 0} Pins · ID {board.id}</div>
                </div>
              )) : <p className="text-sm text-muted-foreground">No boards returned yet.</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card/60 p-6">
            <h2 className="text-xl font-semibold">Create a board</h2>
            <p className="mt-1 text-sm text-muted-foreground">Useful for building campaign-specific publishing lanes.</p>
            <input value={boardName} onChange={(event) => setBoardName(event.target.value)} placeholder="Nectar Campaigns" className="mt-5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-amber-400" />
            <button onClick={createBoard} className="mt-3 w-full rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300">Create board</button>
            {message && <p className="mt-3 text-xs text-muted-foreground">{message}</p>}
          </section>
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-border/70 bg-background/50 p-6">
        <h2 className="text-lg font-semibold">What is wired</h2>
        <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <div>✓ OAuth 2 authorization-code flow</div>
          <div>✓ CSRF state protection</div>
          <div>✓ Encrypted HttpOnly token session</div>
          <div>✓ Automatic access-token refresh</div>
          <div>✓ Board read/create API</div>
          <div>✓ Pin read/create API</div>
        </div>
      </section>
    </div>
  );
}
