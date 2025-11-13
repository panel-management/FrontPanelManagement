import type { Active } from "~/models/Active";
import type { SubscriptionListData } from "~/models/Payments/Subscriptions/SubscriptionListData";
import type { PaymentStatus } from "~/models/PaymentStatus";
import type { Belt } from "~/models/sportAndBelt/belt";
import type { Sport } from "~/models/sportAndBelt/sport";

export interface StudentListData {
  user_id: number;
  fullName: string;
  phoneNumber: string;
  active: Active;
  paymentStatus: PaymentStatus;
  currentBelt: Belt;
  achievedBelts: Belt;
  sport: Sport;
  subscriptionPayments: SubscriptionListData;
  createdAt: string;
  updatedAt: string;
}
