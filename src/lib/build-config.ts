import type { AlgorithmConfig, LineupSlot, PlayerLite, Factor, MarketSection } from "./types";
import { getLeague, getUsers, getRosters, getMatchups, getPlayers, headshotUrl } from "./sleeper";

export async function buildAlgorithmConfig(leagueId: string, rosterId: number, week: number): Promise<AlgorithmConfig> {
  const [league, users, rosters, matchups, players] = await Promise.all([
    getLeague(leagueId),
    getUsers(leagueId),
    getRosters(leagueId),
    getMatchups(leagueId, week),
    getPlayers()
  ]);

  const roster = rosters.find((r: any) => r.roster_id === rosterId);
  const user = users.find((u: any) => u.user_id === roster?.owner_id);
  const teamName = user?.metadata?.team_name || user?.display_name || "TEAM NAME";

  // -------- STUB LOGIC (replace with your formulas later) --------
  const labels = ["QB", "RB1", "RB2", "WR1", "WR2", "TE", "FLEX", "FLEX"];
  const lineup: LineupSlot[] = (roster?.players ?? []).slice(0, 8).map((pid: string, i: number) => {
    const p = players[pid] || {};
    const name = p.full_name || [p.first_name, p.last_name].filter(Boolean).join(" ") || "Player";
    const pos = p.position || p.fantasy_positions?.[0] || "?";
    const team = p.team || "?";
    return {
      label: labels[i] || "FLEX",
      player: { id: pid, name, pos, team, headshotUrl: headshotUrl(pid), chips: [] }
    };
  });

  const flexAnalysis: PlayerLite[] = lineup.slice(-3).map(s => s.player);
  const fourFactors: Factor[] = [
    { kind: "Upside", score: 9, bullets: ["Explosive ceilings"] },
    { kind: "Floor",  score: 6, bullets: ["Starter stability"] },
    { kind: "Risk",   score: 2, bullets: ["Low injury exposure"] },
    { kind: "Depth",  score:10, bullets: ["Multiple startable WRs"] }
  ];
  const market: MarketSection[] = [
    { title: "Waiver Targets", items: [] },
    { title: "Targets",        items: [] },
    { title: "Pivot Targets",  items: [] }
  ];
  // ---------------------------------------------------------------

  const cfg: AlgorithmConfig = {
    meta: { teamName, record: "0 - 0", weekLabel: `WEEK ${week}`, outlook: "CONTENDER", weeklyStrategy: "PLAY IT SAFE" },
    settings: {
      teams: Number(league.total_rosters ?? 12),
      scoring: league.scoring_settings?.rec ? "PPR" : "STD",
      tePrem: Number(league.scoring_settings?.bonus_te_rec ?? 0),
      slots: (league.roster_positions || []).reduce((acc: any, p: string) => (acc[p] = (acc[p] || 0) + 1, acc), {})
    },
    lineup,
    flexAnalysis,
    fourFactors,
    market,
    notes: ""
  };

  return cfg;
}
