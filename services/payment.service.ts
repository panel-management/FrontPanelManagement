import type { createSubscriptionsMaster } from "~/models/Payments/CreateSubscriptionsMaster";
import type { confirmSubscriptionsMaster } from "~/models/Payments/Subscriptions/confirmSubscriptionsMaster";

export const getSubscriptionsPendingMasterService = () => {
  return FetchApi("/financials/subscriptions/pending");
};

export const confirmSubscriptionsMasterService = (id: number, data: confirmSubscriptionsMaster) => {
  return FetchApi(`/financials/subscriptions/${id}/review`, {
    method: "PUT",
    body: data
  });
};

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
