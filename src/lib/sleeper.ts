const BASE = "https://api.sleeper.app/v1";

export async function getLeague(leagueId: string) {
  return fetch(`${BASE}/league/${leagueId}`).then(r => r.json());
}
export async function getUsers(leagueId: string) {
  return fetch(`${BASE}/league/${leagueId}/users`).then(r => r.json());
}
export async function getRosters(leagueId: string) {
  return fetch(`${BASE}/league/${leagueId}/rosters`).then(r => r.json());
}
export async function getMatchups(leagueId: string, week: number) {
  return fetch(`${BASE}/league/${leagueId}/matchups/${week}`).then(r => r.json());
}
export async function getPlayers(): Promise<Record<string, any>> {
  // Big object of all NFL players; good to cache later.
  return fetch(`https://api.sleeper.app/v1/players/nfl`).then(r => r.json());
}

// Image helpers (from Sleeper CDN)
export const headshotUrl = (playerId: string) =>
  `https://sleepercdn.com/content/nfl/players/headshot/${playerId}.jpg`;

export const teamLogoUrl = (abbr: string) =>
  `https://sleepercdn.com/content/nfl/teams/${abbr}.png`;
