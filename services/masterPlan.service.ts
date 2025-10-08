import type { MasterPlanData } from "~/models/plan/masterPlan/MasterPlanData";
import type { UpdateMasterPlanData } from "~/models/plan/masterPlan/UpdateMasterPlanData";

export const getPlanMasterOrAdminService = () => {
  return FetchApi("/financials/master-plans");
};

export const createMasterPlanService = (master: MasterPlanData) => {
  return FetchApi("/financials/master-plans", {
    method: "POST",
    body: master,
  });
};

export const updateMasterPlanService = (
  id: number,
  master: UpdateMasterPlanData
) => {
  return FetchApi(`/financials/master-plans/${id}`, {
    method: "PUT",
    body: master,
  });
};

export const deleteMasterPlanService = (id: number) => {
  return FetchApi(`/financials/master-plans/${id}`, {
    method: "DELETE",
  });
};
