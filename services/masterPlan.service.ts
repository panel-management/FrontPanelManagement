import type { MasterPlanData } from "~/models/plan/masterPlan/MasterPlanData";
import type { UpdateMasterPlanData } from "~/models/plan/masterPlan/UpdateMasterPlanData";
import type { CreatePlanStudent } from "~/models/plan/studentPlan/CreatePlanStudent";

export const getPlanMasterOrAdminService = () => {
  return FetchApi("/financials/master-plans");
};

export const getPlanMasterByStudentService = () => {
  return FetchApi("/financials/plans");
};

export const createMasterPlanService = (master: MasterPlanData) => {
  return FetchApi("/financials/master-plans", {
    method: "POST",
    body: master,
  });
};

export const createPlanMasterByStudentService = (data: CreatePlanStudent) => {
  return FetchApi("/financials/plans", {
    method: "POST",
    body: data,
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

export const deletePlanMasterByStudentService = (id: number) => {
  return FetchApi(`/financials/plans/${id}`, {
    method: "DELETE",
  });
};
