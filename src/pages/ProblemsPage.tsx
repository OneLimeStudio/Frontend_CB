import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, Problem } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Code2, ChevronRight, Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-neon border-neon/30 bg-neon/5",
  medium: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  hard: "text-destructive border-destructive/30 bg-destructive/5",
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.problems()
      .then(setProblems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.difficulty.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 neon-text" />
          <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Problem Set</span>
        </div>
        <h1 className="font-mono text-3xl font-bold text-foreground">
          Problems <span className="neon-text">({problems.length})</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(["easy", "medium", "hard"] as const).map((d) => (
          <div key={d} className={`rounded-lg border p-4 ${DIFFICULTY_COLORS[d]}`}>
            <div className="text-2xl font-mono font-bold">{counts[d]}</div>
            <div className="text-sm capitalize font-mono">{d}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems..."
          className="pl-9 font-mono bg-surface border-border focus:border-neon"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-elevated">
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">#</th>
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Title</th>
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Difficulty</th>
              <th className="text-right px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={4} className="px-4 py-4">
                    <div className="h-4 bg-surface-elevated rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground font-mono">
                  No problems found
                </td>
              </tr>
            ) : (
              filtered.map((problem, i) => (
                <tr
                  key={problem.id}
                  className="border-b border-border hover:bg-surface-elevated transition-colors cursor-pointer group"
                  onClick={() => navigate(`/problems/${problem.id}`)}
                >
                  <td className="px-4 py-4 font-mono text-sm text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-muted-foreground group-hover:text-neon transition-colors" />
                      <span className="font-mono text-sm text-foreground group-hover:neon-text transition-colors">
                        {problem.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={`font-mono text-xs capitalize ${DIFFICULTY_COLORS[problem.difficulty] || ""}`}
                    >
                      {problem.difficulty}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-neon ml-auto transition-colors" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
