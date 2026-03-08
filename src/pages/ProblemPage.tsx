import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Problem } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, Play, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-neon border-neon/30 bg-neon/5",
  medium: "text-warning border-warning/30 bg-warning/5",
  hard: "text-destructive border-destructive/30 bg-destructive/5",
};

const LANGUAGES = ["python", "javascript", "typescript", "cpp", "java", "go", "rust"];

const STARTERS: Record<string, string> = {
  python: "def solution():\n    # Write your solution here\n    pass\n",
  javascript: "function solution() {\n  // Write your solution here\n}\n",
  typescript: "function solution(): void {\n  // Write your solution here\n}\n",
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // Write your solution here\n  return 0;\n}\n",
  java: "public class Solution {\n  public static void main(String[] args) {\n    // Write your solution here\n  }\n}\n",
  go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n  // Write your solution here\n}\n",
  rust: "fn main() {\n  // Write your solution here\n}\n",
};

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState(STARTERS["python"]);
  const [language, setLanguage] = useState("python");
  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState<"pending" | "accepted" | "wrong_answer" | "error" | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    api.problems()
      .then((problems) => {
        const p = problems.find((x) => x.id === id);
        if (p) setProblem(p);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setCode(STARTERS[language] || "");
  }, [language]);

  // Poll for verdict
  useEffect(() => {
    if (!matchId || !user || !polling) return;
    const interval = setInterval(async () => {
      try {
        const result = await api.getMatchResult(matchId, user.id);
        if (result.all_judged || result.my_verdict !== "pending") {
          setVerdict(result.my_verdict as "accepted" | "wrong_answer" | "error");
          setPolling(false);
          clearInterval(interval);
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [matchId, user, polling]);

  const handleSubmit = async () => {
    if (!id) return;
    setSubmitting(true);
    setVerdict("pending");
    try {
      const result = await api.practiceSubmit(id, code, language);
      setMatchId(result.match_id);
      setPolling(true);
    } catch (e) {
      setVerdict("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin neon-text" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden animate-fade-in">
      {/* Problem Panel */}
      <div className="w-full lg:w-2/5 flex flex-col border-r border-border overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface-elevated">
          <button onClick={() => navigate("/problems")} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-mono text-sm text-foreground font-semibold flex-1 truncate">{problem.title}</span>
          <Badge variant="outline" className={`font-mono text-xs capitalize ${DIFFICULTY_COLORS[problem.difficulty] || ""}`}>
            {problem.difficulty}
          </Badge>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="font-mono text-xl font-bold text-foreground mb-4">{problem.title}</h2>
          <div className="font-mono text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>
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
                <SelectItem key={lang} value={lang} className="text-xs">
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleSubmit}
            disabled={submitting || polling}
            size="sm"
            className="font-mono gap-2 neon-glow"
          >
            {submitting || polling ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Judging...</>
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
            style={{ tabSize: 2 }}
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

        {/* Verdict Bar */}
        {verdict && (
          <div className={`px-4 py-3 border-t flex items-center gap-3 font-mono text-sm animate-fade-in ${
            verdict === "accepted"
              ? "border-neon/30 bg-neon/5"
              : verdict === "pending"
              ? "border-yellow-400/30 bg-yellow-400/5"
              : "border-destructive/30 bg-destructive/5"
          }`}>
            {verdict === "accepted" && <CheckCircle className="h-4 w-4 neon-text" />}
            {verdict === "wrong_answer" && <XCircle className="h-4 w-4 text-destructive" />}
            {verdict === "error" && <XCircle className="h-4 w-4 text-destructive" />}
            {verdict === "pending" && <Clock className="h-4 w-4 text-yellow-400 animate-spin" />}
            <span className={
              verdict === "accepted" ? "neon-text" :
              verdict === "pending" ? "text-yellow-400" :
              "text-destructive"
            }>
              {verdict === "accepted" ? "Accepted ✓" :
               verdict === "pending" ? "Judging..." :
               verdict === "wrong_answer" ? "Wrong Answer ✗" : "Error ✗"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
