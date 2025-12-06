import type { CreateTransactionEquipment } from "~/models/transactions/CreateTransactionEquipment";
import type { RejectTransaction } from "~/models/transactions/RejectTransaction";

export const getHistoryTransactionMasterService = (page: number, limit: number) => {
  return FetchApi(`/financials/transactions/master/history?page=${page}&limit=${limit}`);
};

export const getHistoryTransactionStudentService = () => {
  return FetchApi("/financials/transactions/student/history");
};

export const createTransactionEquipmentService = (
  data: CreateTransactionEquipment
) => {
  return FetchApi("/financials/transactions/equipment", {
    method: "POST",
    body: data,
  });
};

export const confirmTransactionService = (id: number) => {
  return FetchApi(`/financials/transactions/${id}/confirm`, { method: "PUT" });
};

export const rejectTransactionService = (
  id: number,
  reject: RejectTransaction
) => {
  return FetchApi(`/financials/transactions/${id}/reject`, {
    method: "POST",
    body: reject,
  });
};
