import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Match as MatchType } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Play, CheckCircle, XCircle, Clock, Swords, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const LANGUAGES = ["python", "javascript", "typescript", "cpp", "java", "go", "rust"];
const STARTERS: Record<string, string> = {
  python: "def solution():\n    pass\n",
  javascript: "function solution() {\n  \n}\n",
  typescript: "function solution(): void {\n  \n}\n",
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  return 0;\n}\n",
  java: "public class Solution {\n  public static void main(String[] args) {\n  }\n}\n",
  go: "package main\nfunc main() {\n}\n",
  rust: "fn main() {\n}\n",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-neon border-neon/30 bg-neon/5",
  medium: "text-warning border-warning/30 bg-warning/5",
  hard: "text-destructive border-destructive/30 bg-destructive/5",
};

export default function MatchPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [match, setMatch] = useState<MatchType | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState(STARTERS["python"]);
  const [language, setLanguage] = useState("python");
  const [submitting, setSubmitting] = useState(false);
  const [myVerdict, setMyVerdict] = useState<string>("pending");
  const [allJudged, setAllJudged] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const pollingRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    api.getMatch(id)
      .then(setMatch)
      .catch(() => navigate("/play"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCode(STARTERS[language] || "");
  }, [language]);

  const pollResult = async () => {
    if (!id || !user || pollingRef.current) return;
    pollingRef.current = true;
    const interval = setInterval(async () => {
      try {
        const result = await api.getMatchResult(id, user.id);
        setMyVerdict(result.my_verdict);
        setAllJudged(result.all_judged);
        if (result.all_judged || result.my_verdict !== "pending") {
          clearInterval(interval);
          pollingRef.current = false;
        }
      } catch { clearInterval(interval); pollingRef.current = false; }
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!id) return;
    setSubmitting(true);
    setSubmitted(true);
    try {
      await api.submitCode(id, code, language);
      pollResult();
    } catch (e) {
      setMyVerdict("error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (loading || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin neon-text" />
      </div>
    );
  }

  const opponent = match.players.find((p) => p.user_id !== user?.id);
  const me = match.players.find((p) => p.user_id === user?.id);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden animate-fade-in">
      {/* Match Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-3">
          <Swords className="h-4 w-4 neon-text" />
          <span className="font-mono text-xs text-muted-foreground">Match</span>
          <span className="font-mono text-xs text-foreground">{match.match_id.slice(0, 8)}...</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Players */}
          <div className="hidden sm:flex items-center gap-4 font-mono text-xs">
            <span className="neon-text font-semibold">{user?.name || "You"}</span>
            <span className="text-muted-foreground">vs</span>
            <span className="text-foreground">{opponent?.name || "Opponent"}</span>
          </div>

          {/* Timer */}
          <div className={`font-mono text-sm font-bold tabular-nums ${elapsed > 600 ? "text-destructive" : "neon-text"}`}>
            {formatTime(elapsed)}
          </div>

          {/* Status */}
          <Badge
            variant="outline"
            className={
              match.status === "active"
                ? "font-mono text-xs text-neon border-neon/30"
                : "font-mono text-xs text-muted-foreground"
            }
          >
            {match.status}
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Problem Panel */}
        <div className="w-full lg:w-2/5 flex flex-col border-r border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated">
            <span className="font-mono text-sm font-semibold text-foreground truncate">
              {match.problem?.title || "Problem"}
            </span>
            {match.problem && (
              <Badge variant="outline" className={`font-mono text-xs capitalize ml-2 shrink-0 ${DIFFICULTY_COLORS[match.problem.difficulty] || ""}`}>
                {match.problem.difficulty}
              </Badge>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="font-mono text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {match.problem?.description || "Loading problem..."}
            </div>
          </div>

          {/* Opponent status */}
          {opponent && (
            <div className="px-4 py-3 border-t border-border bg-surface-elevated">
              <div className="font-mono text-xs text-muted-foreground mb-2">Opponent</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                <span className="font-mono text-sm text-foreground">{opponent.name}</span>
                <div className="ml-auto">
                  {opponent.verdict === "accepted" && <CheckCircle className="h-4 w-4 neon-text" />}
                  {opponent.verdict === "wrong_answer" && <XCircle className="h-4 w-4 text-destructive" />}
                  {opponent.verdict === "pending" && submitted && <Clock className="h-4 w-4 text-warning" />}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated gap-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-36 font-mono text-xs bg-surface border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-mono bg-surface border-border">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-xs">{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleSubmit}
              disabled={submitting || match.status === "finished"}
              size="sm"
              className="font-mono gap-2 neon-glow"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <><Play className="h-4 w-4" /> Submit</>
              )}
            </Button>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full font-mono text-sm bg-background text-foreground p-4 resize-none outline-none leading-relaxed"
              spellCheck={false}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  const newCode = code.substring(0, start) + "  " + code.substring(end);
                  setCode(newCode);
                  setTimeout(() => {
                    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                  }, 0);
                }
              }}
            />
          </div>

          {/* Verdict */}
          {submitted && (
            <div className={`px-4 py-3 border-t flex items-center gap-3 font-mono text-sm animate-fade-in ${
              myVerdict === "accepted"
                ? "border-neon/30 bg-neon/5"
                : myVerdict === "pending"
                ? "border-warning/30 bg-warning/5"
                : "border-destructive/30 bg-destructive/5"
            }`}>
              {myVerdict === "accepted" && <><Trophy className="h-4 w-4 neon-text" /><span className="neon-text font-bold">Accepted! You win! 🎉</span></>}
              {myVerdict === "wrong_answer" && <><XCircle className="h-4 w-4 text-destructive" /><span className="text-destructive">Wrong Answer</span></>}
              {myVerdict === "error" && <><XCircle className="h-4 w-4 text-destructive" /><span className="text-destructive">Runtime Error</span></>}
              {myVerdict === "pending" && <><Clock className="h-4 w-4 text-warning animate-spin" /><span className="text-warning">Judging your submission...</span></>}
              {allJudged && myVerdict !== "accepted" && (
                <Button size="sm" variant="outline" onClick={() => navigate("/play")} className="ml-auto font-mono text-xs">
                  Play Again
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
