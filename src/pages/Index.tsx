import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Terminal, Swords, BookOpen, Trophy, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center min-h-[80vh] overflow-hidden">
        <img
          src={heroBg}
          alt="hero background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />

        <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon/30 bg-neon/5 text-neon text-sm font-mono mb-8">
            <Zap className="h-4 w-4" />
            Real-time 1v1 coding battles
          </div>

          <h1 className="font-mono text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-foreground">Code</span>
            <span className="neon-text">Arena</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Compete head-to-head in live coding battles. ELO-matched opponents. Real problems. Your rating on the line.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button
                  size="lg"
                  onClick={() => navigate("/play")}
                  className="font-mono text-base px-10 neon-glow animate-pulse-neon"
                >
                  <Swords className="h-5 w-5 mr-2" />
                  Find Match
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/problems")}
                  className="font-mono text-base px-10 border-border"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Practice
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="font-mono text-base px-10 neon-glow animate-pulse-neon"
                >
                  Start Competing <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/leaderboard")}
                  className="font-mono text-base px-10 border-border"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Leaderboard
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Swords,
              title: "1v1 Battles",
              desc: "Face real opponents matched by ELO. First to submit a correct solution wins.",
              color: "text-neon",
              border: "border-neon/20",
            },
            {
              icon: Trophy,
              title: "ELO Ranking",
              desc: "Your rating rises and falls with each match. Climb to the top of the leaderboard.",
              color: "text-yellow-400",
              border: "border-yellow-400/20",
            },
            {
              icon: BookOpen,
              title: "Problem Library",
              desc: "Hundreds of problems across Easy, Medium, and Hard difficulties. Practice anytime.",
              color: "text-blue-400",
              border: "border-blue-400/20",
            },
          ].map(({ icon: Icon, title, desc, color, border }) => (
            <div key={title} className={`rounded-xl border ${border} bg-surface p-6 hover:bg-surface-elevated transition-colors`}>
              <Icon className={`h-8 w-8 ${color} mb-4`} />
              <h3 className="font-mono font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 neon-text" />
            <span className="font-mono text-sm neon-text">CodeArena</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">© 2025</span>
        </div>
      </footer>
    </div>
  );
}
