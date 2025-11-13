export interface Belt {
  id: number;
  color: string;
  achievedByUsers: AchievedBelt[];
  currentlyHeldByUsers: CurrentBelt[];
}

export interface CurrentBelt {
  id: number;
  color: string;
}

export interface AchievedBelt {
  id: number;
  color: string;
}
