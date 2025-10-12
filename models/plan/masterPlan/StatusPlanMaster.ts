export interface StatusPlanMaster {
  planName: string;
  planType: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  daysTotal: number;
  daysLeft: number;
  progressPercentage: number;
}
