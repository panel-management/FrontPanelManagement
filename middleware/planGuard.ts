export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUsersStore()

  const publicPaths = ['/membership/plans', '/payment']

  if (publicPaths.includes(to.path)) return

  if (!userStore.planStatusLoaded) {
    await userStore.getStatusPlanUsers()
  }

  const plan = userStore.planStatus

  if (!plan) return

  if (plan.isActive) return

  if (plan.userType === 'STUDENT') return

  if (plan.needsPayment) {
    if (to.path !== '/payment') {
      return navigateTo('/payment')
    }
    return
  }

  if (plan.noPlan || plan.isExpired) {
    if (to.path !== '/membership/plans') {
      return navigateTo('/membership/plans')
    }
    return
  }

  if (plan.isPending) return
})
