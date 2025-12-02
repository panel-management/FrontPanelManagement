import { defineStore } from "pinia";
import { getStatusPlanService } from "~/services/users.service";

type PlanStatus = {
  isActive: boolean;
  isAdmin: boolean;
  needsPayment: boolean;
  isPending: boolean;
  userType: string;
  message: string;
  statusCode: number;
};

export const useUsersStore = defineStore("users", {
  state: () => ({
    planStatus: {
      isActive: false,
      isAdmin: false,
      needsPayment: false,
      isPending: false,
      userType: "",
      message: "",
      statusCode: 0,
    } as PlanStatus,
  }),
  actions: {
    async getStatusPlanUsers(): Promise<PlanStatus> {
      try {
        const result = await getStatusPlanService();
        this.planStatus = {
          isActive: result?.isActive,
          isAdmin: result?.isAdmin,
          needsPayment: result?.needsPayment,
          isPending: result?.isPending,
          userType: result?.userType,
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
