import type { Sport } from "~/models/sportAndBelt/sport";
import type { Active } from "~/models/Active";
import type { PaymentStatus } from "~/models/PaymentStatus";
import type { MasterPlanData } from "~/models/plan/masterPlan/MasterPlanData";
import type { SubscriptionListData } from "~/models/Payments/Subscriptions/SubscriptionListData";
import type { StudentListData } from "../student/StudentData";

export interface MasterData {
  user_id: number;
  type: number;
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  history: string;
  image: string;
  active: Active;
  certificates: string;
  masterPlanId: string;
  sport: Sport;
  students: StudentListData;
  subscriptionPayments: SubscriptionListData;
  masterPlan: MasterPlanData;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}
