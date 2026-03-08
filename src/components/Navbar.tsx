import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Terminal, Trophy, Code2, Swords, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Problems", href: "/problems", icon: Code2 },
    { label: "Play", href: "/play", icon: Swords },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Terminal className="h-6 w-6 neon-text" />
          </div>
          <span className="font-mono font-bold text-lg neon-text tracking-tight">
            CodeArena
          </span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link key={href} to={href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 font-mono text-sm transition-all ${
                    location.pathname === href
                      ? "neon-text border border-neon/30 bg-neon/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-elevated border border-border">
                <User className="h-4 w-4 text-neon" />
                <span className="font-mono text-sm text-foreground">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="font-mono neon-glow">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
