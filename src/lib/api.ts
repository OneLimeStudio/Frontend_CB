const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
}

export interface MatchPlayer {
  user_id: string;
  name: string;
  verdict: string;
  elo_delta: number | null;
}

export interface Match {
  match_id: string;
  status: string;
  players: MatchPlayer[];
  problem: Problem | null;
}

export interface MatchResult {
  match_id: string;
  status: string;
  my_verdict: string;
  all_judged: boolean;
  players: MatchPlayer[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  elo: number;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<User>("/users/", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string; user: User }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<User>("/me"),

  problems: () => request<Problem[]>("/problems"),

  joinQueue: (elo: number) =>
    request<{ status: string; match_id?: string; message?: string }>(
      `/queue/join?elo=${elo}`,
      { method: "POST" }
    ),

  queueStatus: () =>
    request<{ status: string; match_id?: string }>("/queue/status"),

  leaveQueue: () => request<{ status: string }>("/queue/leave", { method: "DELETE" }),

  getMatch: (id: string) => request<Match>(`/match/${id}`),

  getMatchResult: (matchId: string, userId: string) =>
    request<MatchResult>(`/match/${matchId}/result/${userId}`),

  submitCode: (matchId: string, code: string, language: string) =>
    request<{ message: string; match_id: string; problem_id: string }>(
      `/match/${matchId}/submit`,
      { method: "POST", body: JSON.stringify({ code, language }) }
    ),

  practiceSubmit: (problemId: string, code: string, language: string) =>
    request<{ message: string; match_id: string; problem_id: string }>(
      `/practice/${problemId}/submit`,
      { method: "POST", body: JSON.stringify({ code, language }) }
    ),

  leaderboard: () => request<LeaderboardEntry[]>("/leaderboard"),
};
