import type { createSubscriptionsMaster } from "~/models/Payments/createSubscriptionsMaster";

export const createSubscriptionsMasterService = (
  subscriptions: createSubscriptionsMaster
) => {
  let data = new FormData();
  data.append("payerFullName", subscriptions.payerFullName);
  data.append("bankName", subscriptions.bankName);
  data.append("paymentDate", subscriptions.paymentDate.toString());
  data.append("trackingNumber", subscriptions.trackingNumber);
  data.append("amount", subscriptions.amount.toString());
  data.append("imageFile", subscriptions.imageFile);
  return FetchApi("/financials/subscriptions", {
    method: "POST",
    body: data,
  });
};
