import { defineStore } from "pinia";
import { getStatusPlanService } from "~/services/master.service";

type PlanStatus = {
  isActive: boolean;
  needsPayment: boolean;
  isPending: boolean;
  message: string;
  statusCode: number;
};

export const useUsersStore = defineStore("users", {
  state: () => ({
    planStatus: {
      isActive: false,
      needsPayment: false,
      isPending: false,
      message: "",
      statusCode: 0,
    } as PlanStatus,
  }),
  actions: {
    async getStatusPlanUsers(): Promise<PlanStatus> {
      try {
        const result = await getStatusPlanService();
        this.planStatus = {
          isActive: result.data?.isActive,
          needsPayment: result?.needsPayment,
          isPending: result?.isPending,
          message: result.message,
          statusCode: result.statusCode,
        };
      } catch (error: any) {
        console.error("getStatusPlanUsers failed:", error);
      }
      return this.planStatus;
    },
  },
});
