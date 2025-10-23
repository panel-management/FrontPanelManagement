export interface confirmSubscriptionsMaster {
  status: statusConfirmSubscriptionsMaster;
  adminNotes?: string;
}

export enum statusConfirmSubscriptionsMaster {
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
}
