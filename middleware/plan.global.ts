export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUsersStore();

  const publicPaths = ["/memberShip/plans", "/payment"];

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
    return navigateTo("/memberShip/plans");
  }

  if (plan.isPending) return;
});
