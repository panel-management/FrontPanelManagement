export interface MasterPlanData {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  type: string;
  durationInDays: number;
  createdAt: string;
}

export enum TypePlan {
  TRIAL = "TRIAL",
  PAID = "PAID",
}
