import type { DataUsers } from "~/models/users/dataUsers";

export interface SubscriptionListData {
  id: number;
  amount: string;
  paymentDate: string;
  trackingNumber: string;
  payerFullName: string;
  bankName: string;
  receiptImageUrl: string;
  status: SubscriptionStatus;
  masterId: number;
  confirmerId: number;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
  master: DataUsers;
}

export enum SubscriptionStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
}
