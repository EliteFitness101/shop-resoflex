import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  listConversations,
  getConversationMessages,
  sendCoachMessage,
  newConversation,
} from "@/lib/chatb2k.functions";
import { Send, Plus, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/chatb2k/coach")({
  component: CoachChat,
  head: () => ({ meta: [{ title: "AI Coach — ResoFit" }] }),
});

interface UIMsg { id: string; role: "user" | "assistant"; text: string; pending?: boolean }

const SUGGESTIONS = [
  "Generate today's Nigerian meal plan",
  "Design a 4-day home workout for fat loss",
  "Review my CEO priorities for the week",
  "Suggest healthier swaps for jollof rice",
];

function CoachChat() {
  const qc = useQueryClient();
  const listConvos = useServerFn(listConversations);
  const getMsgs = useServerFn(getConversationMessages);
  const send = useServerFn(sendCoachMessage);
  const newConvo = useServerFn(newConversation);

  const convos = useQuery({ queryKey: ["chatb2k", "convos"], queryFn: () => listConvos() });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [localMsgs, setLocalMsgs] = useState<UIMsg[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // When active convo changes, load its history.
  const history = useQuery({
    queryKey: ["chatb2k", "msgs", activeId],
    queryFn: () => getMsgs({ data: { conversationId: activeId! } }),
    enabled: !!activeId,
  });

  useEffect(() => {
    if (history.data) {
      setLocalMsgs(
        history.data.map((m) => {
          const parts = Array.isArray(m.parts) ? (m.parts as Array<{ type?: string; text?: string }>) : [];
          const text = parts.filter((p) => p?.type === "text").map((p) => p.text ?? "").join("");
          return { id: m.id, role: m.role as "user" | "assistant", text };
        }),
      );
    } else if (!activeId) {
      setLocalMsgs([]);
    }
  }, [history.data, activeId]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [localMsgs]);

  useEffect(() => { inputRef.current?.focus(); }, [activeId]);

  const sendMutation = useMutation({
    mutationFn: async (message: string) =>
      send({ data: { conversationId: activeId, message } }),
    onSuccess: (res) => {
      setActiveId(res.conversationId);
      setLocalMsgs((prev) => [
        ...prev.filter((m) => !m.pending),
        { id: `a-${Date.now()}`, role: "assistant", text: res.reply },
      ]);
      qc.invalidateQueries({ queryKey: ["chatb2k", "convos"] });
      inputRef.current?.focus();
    },
    onError: (e: Error) => {
      setLocalMsgs((prev) => prev.filter((m) => !m.pending));
      toast.error(e.message);
    },
  });

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sendMutation.isPending) return;
    setLocalMsgs((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text },
      { id: "pending", role: "assistant", text: "…", pending: true },
    ]);
    setInput("");
    sendMutation.mutate(text);
  };

  const startNew = async () => {
    try {
      const c = await newConvo();
      setActiveId(c.id);
      setLocalMsgs([]);
      qc.invalidateQueries({ queryKey: ["chatb2k", "convos"] });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr] h-[calc(100vh-13rem)]">
      {/* Sidebar */}
      <aside className="glass-panel rounded-lg p-3 hidden md:flex flex-col">
        <button
          onClick={startNew}
          className="flex items-center gap-2 w-full text-xs font-mono uppercase tracking-wider px-3 py-2 rounded bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20"
        >
          <Plus className="size-4" /> New chat
        </button>
        <div className="text-telemetry text-[10px] mt-4 mb-1">RECENT</div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {(convos.data ?? []).map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={cn(
                "w-full text-left text-xs px-2 py-1.5 rounded truncate",
                activeId === c.id ? "bg-gold/15 text-gold" : "hover:bg-white/5 text-muted-foreground",
              )}
              title={c.title}
            >
              <MessageSquare className="size-3 inline mr-1.5 opacity-60" />
              {c.title}
            </button>
          ))}
          {(!convos.data || convos.data.length === 0) && (
            <div className="text-[11px] text-muted-foreground px-2 py-3">No conversations yet.</div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="glass-panel rounded-lg flex flex-col overflow-hidden">
        <div className="border-b border-gold/10 px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-telemetry text-[10px]">// AI COACH</div>
            <div className="font-display text-lg font-semibold">ResoFit AI</div>
          </div>
          <button
            onClick={startNew}
            className="md:hidden text-xs font-mono uppercase px-2 py-1.5 rounded border border-gold/30 text-gold"
          >
            <Plus className="size-3.5 inline mr-1" /> New
          </button>
        </div>

        <div ref={scrollerRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-4">
          {localMsgs.length === 0 && (
            <div className="max-w-md mx-auto text-center py-6">
              <Sparkles className="size-8 text-gold mx-auto mb-3" />
              <h2 className="font-display text-xl font-semibold">How can I help you today?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Nutrition, workouts, habits, business — ask anything.
              </p>
              <div className="grid gap-2 mt-5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 0); }}
                    className="text-xs text-left px-3 py-2 rounded border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {localMsgs.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-gradient-gold text-primary-foreground"
                    : "bg-white/5 border border-gold/10",
                )}
              >
                {m.pending ? (
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 rounded-full bg-gold animate-bounce" />
                    <span className="size-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.15s]" />
                    <span className="size-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.3s]" />
                  </span>
                ) : m.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-headings:mt-3 prose-headings:mb-1">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{m.text}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="border-t border-gold/10 px-3 sm:px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
              }}
              placeholder="Ask ResoFit AI anything…"
              rows={1}
              className="flex-1 resize-none bg-background/60 border border-gold/20 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none max-h-32"
            />
            <button
              type="submit"
              disabled={sendMutation.isPending || !input.trim()}
              className="size-10 grid place-items-center rounded-lg bg-gradient-gold text-primary-foreground shadow-gold disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
