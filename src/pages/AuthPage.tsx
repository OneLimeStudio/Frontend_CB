import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Terminal, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroBg from "@/assets/hero-bg.jpg";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden">
        <img src={heroBg} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        <div className="relative z-10 p-12 flex flex-col h-full justify-center gap-8">
          <div className="flex items-center gap-3">
            <Terminal className="h-8 w-8 neon-text" />
            <span className="font-mono font-bold text-2xl neon-text">CodeArena</span>
          </div>
          <div>
            <h1 className="font-mono text-4xl font-bold leading-tight mb-4">
              <span className="neon-text">Compete.</span><br />
              <span className="text-foreground">Code.</span><br />
              <span className="text-muted-foreground">Conquer.</span>
            </h1>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Real-time 1v1 coding battles with ELO matchmaking. Sharpen your skills, climb the ranks.
            </p>
          </div>
          <div className="flex gap-8">
            {[
              { label: "Active Players", value: "2.4K" },
              { label: "Problems", value: "500+" },
              { label: "Daily Matches", value: "8K+" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="font-mono text-2xl font-bold neon-text">{value}</div>
                <div className="text-muted-foreground text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <div className="flex lg:hidden items-center gap-2 mb-8">
              <Terminal className="h-6 w-6 neon-text" />
              <span className="font-mono font-bold text-lg neon-text">CodeArena</span>
            </div>
            <h2 className="font-mono text-2xl font-bold text-foreground">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "login" ? "Sign in to continue competing" : "Join the arena"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex mb-6 bg-surface rounded-lg p-1 border border-border">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 text-sm font-mono rounded-md transition-all ${
                  mode === m
                    ? "bg-neon text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Username
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="coder_x"
                  required
                  className="font-mono bg-surface border-border focus:border-neon focus:ring-neon/20"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="font-mono bg-surface border-border focus:border-neon focus:ring-neon/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="font-mono bg-surface border-border focus:border-neon focus:ring-neon/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive font-mono bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                ✗ {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-mono neon-glow animate-pulse-neon"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                mode === "login" ? "→ Sign In" : "→ Join Arena"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
