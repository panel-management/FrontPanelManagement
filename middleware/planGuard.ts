export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUsersStore();

  const publicPaths = ["/membership/plans", "/payment"];

  if (publicPaths.includes(to.path)) return;

  if (!userStore.planStatusLoaded || !userStore.planStatus) {
    await userStore.getStatusPlanUsers();
  }

  const plan = userStore.planStatus;

  if (!plan) return;

  if (plan.isActive) return;

  if (plan.userType === "STUDENT") return;

  if (plan.needsPayment) {
    return navigateTo("/payment");
  }

  if (plan.noPlan || plan.isExpired) {
    return navigateTo("/membership/plans");
  }

  if (plan.isPending) return;
});
