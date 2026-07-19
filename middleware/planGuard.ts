import { Role } from '~/models/Role'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUsersStore()

  const publicPaths = ['/membership/plans', '/payment']

  if (publicPaths.includes(to.path)) return

  if (!userStore.planStatusLoaded) {
    await userStore.getStatusPlanUsers()
  }

  const plan = userStore.planStatus

  if (!plan) return abortNavigation('خطا در دریافت اطلاعات اشتراک')

  if (plan.isActive) return

  if (plan.userType === Role.Student) return

  if (plan.needsPayment && to.path !== '/payment') {
    return navigateTo('/payment')
  }

  if ((plan.noPlan || plan.isExpired) && to.path !== '/membership/plans') {
    return navigateTo('/membership/plans')
  }

  if (plan.isPending) return
})
