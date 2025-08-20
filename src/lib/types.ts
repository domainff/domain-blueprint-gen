export type Chip = "MATCHUP" | "VEGAS" | "OFFENSE";
export type Outlook = "CONTENDER" | "FRINGE" | "RELOAD";

export interface PlayerLite {
  id: string;
  name: string;
  pos: string;
  team: string;
  headshotUrl?: string;
  chips?: Chip[];
}

export interface LineupSlot { label: string; player: PlayerLite; }

export interface Factor {
  kind: "Upside" | "Floor" | "Risk" | "Depth";
  score: number;
  bullets?: string[];
}

export interface MarketCard { title: string; subtitle: string; headshotUrl?: string; }
export interface MarketSection { title: "Waiver Targets"|"Targets"|"Pivot Targets"; items: MarketCard[]; }

export interface AlgorithmConfig {
  meta: { teamName: string; record: string; weekLabel: string; outlook: Outlook; weeklyStrategy: string; };
  settings: { teams: number; scoring: string; tePrem: number; slots: Record<string, number>; };
  lineup: LineupSlot[];
  flexAnalysis: PlayerLite[];
  fourFactors: Factor[];
  market: MarketSection[];
  notes?: string;
}
