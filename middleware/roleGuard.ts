import { Role } from '~/models/Role'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const roleStore = useRolesStore()

  if (!roleStore.detailUser) {
    try {
      await roleStore.getDetailUser()
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  if (roleStore.isBanned) return

  const user = roleStore.detailUser

  if (!user) {
    return navigateTo('/auth', { replace: true })
  }

  const role = user.type as Role

  const roleRoutes: Record<Role, (string | RegExp)[]> = {
    [Role.Admin]: [
      /^\/dashboard$\/admin$/,
      /^\/supports$/,
      /^\/supports\/chat-.*$/,
      '/setting/admin',
      '/management-master',
      '/payment/list',
    ],
    [Role.Master]: [
      /^\/dashboard$/,
      '/profile/master',
      '/setting/master',
      '/supports/ticket',
      /^\/supports\/chat-.*$/,
      '/management-student',
      '/management-coach',
      '/presence-absence',
      '/management-financial',
      '/membership/plans',
      '/membership',
      /^\/payment$/,
    ],
    [Role.Coach]: ['/profile/coach'],
    [Role.Student]: ['/profile/student', '/management-financial/my-financial'],
  }

  const fallbackByRole: Record<Role, string> = {
    [Role.Admin]: '/dashboard/admin',
    [Role.Master]: '/dashboard',
    [Role.Coach]: '/profile/coach',
    [Role.Student]: '/profile/student',
  }

  const allowedRoutes = roleRoutes[role] || []

  const isAllowed = allowedRoutes.some((route) => {
    if (route instanceof RegExp) {
      return route.test(to.path)
    }
    return to.path === route || to.path.startsWith(route + '/')
  })

  if (isAllowed) return

  const fallback = fallbackByRole[role]

  if (fallback && to.path !== fallback) {
    return navigateTo(fallback, { replace: true })
  }
})
