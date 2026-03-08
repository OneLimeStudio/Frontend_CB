import { useEffect, useState } from "react";
import { api, LeaderboardEntry } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Medal, Crown, Loader2 } from "lucide-react";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.leaderboard()
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" style={{ color: "hsl(48 96% 53%)" }} />;
    if (rank === 2) return <Medal className="h-4 w-4" style={{ color: "hsl(215 20% 65%)" }} />;
    if (rank === 3) return <Medal className="h-4 w-4" style={{ color: "hsl(30 80% 50%)" }} />;
    return <span className="font-mono text-sm text-muted-foreground w-4 text-center">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "border-border" + " " + "rank-gold";
    if (rank === 2) return "border-border rank-silver";
    if (rank === 3) return "border-border rank-bronze";
    return "bg-surface border-border";
  };

  const myRank = entries.findIndex((e) => e.id === user?.id) + 1;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-accent/30 bg-accent/5 mb-4" style={{ borderColor: "hsl(48 96% 53% / 0.3)", background: "hsl(48 96% 53% / 0.05)" }}>
            <Trophy className="h-7 w-7" style={{ color: "hsl(48 96% 53%)" }} />
          </div>
          <h1 className="font-mono text-3xl font-bold text-foreground">
            Leader<span className="neon-text">board</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Top coders ranked by ELO rating</p>
        </div>

        {/* My rank callout */}
        {user && myRank > 0 && (
          <div className="mb-6 rounded-xl border border-neon/30 bg-neon/5 p-4 flex items-center gap-4">
            <div className="font-mono text-2xl font-bold neon-text">#{myRank}</div>
            <div>
              <div className="font-mono text-sm font-semibold text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground">Your current ranking</div>
            </div>
            <div className="ml-auto font-mono text-xl font-bold neon-text">
              {entries.find((e) => e.id === user.id)?.elo ?? 1000}
            </div>
          </div>
        )}

        {/* Top 3 podium */}
        {!loading && entries.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 0, 2].map((index) => {
              const entry = entries[index];
              const rank = index + 1;
              const heights = ["h-24", "h-32", "h-20"];
              const heightClasses = [heights[1], heights[0], heights[2]];
              const displayOrder = [1, 0, 2];
              return (
                <div key={entry.id} className={`flex flex-col items-center justify-end rounded-xl border p-3 ${getRankBg(rank)} ${heightClasses[displayOrder.indexOf(index)]}`}>
                  {getRankIcon(rank)}
                  <div className="font-mono text-xs font-semibold text-foreground mt-1 truncate w-full text-center">
                    {entry.name}
                  </div>
                  <div className="font-mono text-sm font-bold neon-text">{entry.elo}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center px-4 py-3 border-b border-border bg-surface-elevated">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest w-12">Rank</span>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex-1">Player</span>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">ELO</span>
          </div>

          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center px-4 py-4 border-b border-border">
                <div className="w-12 h-4 bg-surface-elevated rounded animate-pulse" />
                <div className="flex-1 mx-4 h-4 bg-surface-elevated rounded animate-pulse" />
                <div className="w-16 h-4 bg-surface-elevated rounded animate-pulse" />
              </div>
            ))
          ) : (
            entries.map((entry, i) => {
              const rank = i + 1;
              const isMe = entry.id === user?.id;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center px-4 py-3.5 border-b border-border transition-colors ${
                    isMe ? "bg-neon/5 border-l-2 border-l-neon" : "hover:bg-surface-elevated"
                  }`}
                >
                  <div className="w-12 flex items-center justify-center">
                    {getRankIcon(rank)}
                  </div>
                  <div className="flex-1 font-mono text-sm text-foreground flex items-center gap-2">
                    {entry.name}
                    {isMe && <span className="text-xs text-neon">(you)</span>}
                  </div>
                  <div className={`font-mono font-bold text-sm tabular-nums ${rank <= 3 ? "neon-text" : "text-foreground"}`}>
                    {entry.elo}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
