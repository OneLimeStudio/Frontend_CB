import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Swords, Loader2, Zap, Users, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type QueueState = "idle" | "joining" | "waiting" | "matched";

export default function PlayPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<QueueState>("idle");
  const [matchId, setMatchId] = useState<string | null>(null);
  const [waitTime, setWaitTime] = useState(0);
  const [error, setError] = useState("");

  // Count up wait time
  useEffect(() => {
    if (state !== "waiting") { setWaitTime(0); return; }
    const interval = setInterval(() => setWaitTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [state]);

  // Poll queue status while waiting
  useEffect(() => {
    if (state !== "waiting") return;
    const interval = setInterval(async () => {
      try {
        const status = await api.queueStatus();
        if (status.status === "matched" && status.match_id) {
          setMatchId(status.match_id);
          setState("matched");
          clearInterval(interval);
          setTimeout(() => navigate(`/match/${status.match_id}`), 1500);
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [state, navigate]);

  const joinQueue = async () => {
    setError("");
    setState("joining");
    try {
      const result = await api.joinQueue(1000); // TODO: fetch real ELO
      if (result.status === "matched" && result.match_id) {
        setMatchId(result.match_id);
        setState("matched");
        setTimeout(() => navigate(`/match/${result.match_id}`), 1500);
      } else {
        setState("waiting");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to join queue");
      setState("idle");
    }
  };

  const leaveQueue = async () => {
    try {
      await api.leaveQueue();
    } catch {/* ignore */}
    setState("idle");
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-neon/30 bg-neon/5 mb-4 animate-pulse-neon">
            <Swords className="h-8 w-8 neon-text" />
          </div>
          <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
            Competitive <span className="neon-text">1v1</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Matched by ELO rating. First to solve wins. Your rating is on the line.
          </p>
        </div>

        {/* Mode Cards */}
        {state === "idle" && (
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Zap, label: "ELO Match", desc: "Ranked match — affects your rating", active: true },
                { icon: Users, label: "Friendly", desc: "Practice match — no rating change", active: false },
                { icon: Clock, label: "Timed", desc: "Speed battle — 15 minute limit", active: false },
              ].map(({ icon: Icon, label, desc, active }) => (
                <div
                  key={label}
                  className={`rounded-xl border p-4 transition-all ${
                    active
                      ? "border-neon/40 bg-neon/5 cursor-pointer hover:bg-neon/10"
                      : "border-border opacity-40 cursor-not-allowed"
                  }`}
                >
                  <Icon className={`h-6 w-6 mb-2 ${active ? "neon-text" : "text-muted-foreground"}`} />
                  <div className="font-mono font-semibold text-sm text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{desc}</div>
                  {!active && <div className="text-xs text-muted-foreground mt-2 font-mono">[coming soon]</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Action Area */}
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          {state === "idle" && (
            <>
              <div className="mb-6">
                <div className="text-sm font-mono text-muted-foreground mb-1">Your Rating</div>
                <div className="text-4xl font-mono font-bold neon-text">1000</div>
                <div className="text-xs text-muted-foreground mt-1">Placement</div>
              </div>
              {error && (
                <div className="text-sm text-destructive font-mono bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2 mb-4">
                  {error}
                </div>
              )}
              <Button
                onClick={joinQueue}
                size="lg"
                className="font-mono text-base px-12 neon-glow animate-pulse-neon"
              >
                <Swords className="h-5 w-5 mr-2" />
                Find Match
              </Button>
            </>
          )}

          {state === "joining" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin neon-text" />
              <div className="font-mono text-sm text-muted-foreground">Joining queue...</div>
            </div>
          )}

          {state === "waiting" && (
            <div className="flex flex-col items-center gap-6">
              {/* Animated radar rings */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-neon/20 animate-ping" style={{ animationDuration: "2s" }} />
                <div className="absolute inset-3 rounded-full border-2 border-neon/30 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
                <Swords className="h-8 w-8 neon-text relative z-10" />
              </div>
              <div>
                <div className="font-mono font-bold text-lg text-foreground mb-1">Searching for opponent</div>
                <div className="font-mono text-sm neon-text">
                  {String(Math.floor(waitTime / 60)).padStart(2, "0")}:{String(waitTime % 60).padStart(2, "0")}
                </div>
                <div className="text-xs text-muted-foreground mt-2">Matching within ±200 ELO range</div>
              </div>
              <Button variant="outline" size="sm" onClick={leaveQueue} className="font-mono gap-2 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" /> Cancel
              </Button>
            </div>
          )}

          {state === "matched" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-neon bg-neon/10 flex items-center justify-center animate-pulse-neon">
                <Swords className="h-8 w-8 neon-text" />
              </div>
              <div className="font-mono font-bold text-xl neon-text">Opponent Found!</div>
              <div className="text-sm text-muted-foreground font-mono">Loading arena...</div>
              <Loader2 className="h-5 w-5 animate-spin neon-text" />
            </div>
          )}
        </div>

        {/* Info bar */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Avg Wait", value: "~30s" },
            { label: "In Queue", value: "—" },
            { label: "Active Matches", value: "—" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-border bg-surface p-3">
              <div className="font-mono text-lg font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground font-mono">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
