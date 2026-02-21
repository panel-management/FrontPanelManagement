import type { Role } from '~/models/Role'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const accountStore = useAccountStore()
  const rolesStore = useRolesStore()
  const publicPage = ['/']
  const isAuthPage = to.path.toLocaleLowerCase().startsWith('/auth')
  const isPublicPage = publicPage.includes(to.path)

  if (!isAuthPage && !isPublicPage) {
    if (!accountStore.isLogin) {
      return navigateTo(`/auth?redirectTo=${to.path}`)
    }
  }

  if (accountStore.isLogin && !rolesStore.detailUser) {
    await rolesStore.getDetailUser()
  }

  if (rolesStore.isBanned) return

  const userRole = rolesStore.detailUser?.type as Role

  if (accountStore.isLogin && (isAuthPage || isPublicPage)) {
    return navigateTo(fallbackByRole[userRole], { replace: true })
  }

  const allowedRoles = to.meta.roles as Role[]

  if (!allowedRoles) return

  if (!allowedRoles.includes(userRole)) {
    const fallback = fallbackByRole[userRole]
    if (fallback && to.path !== fallback) {
      return navigateTo(fallback, { replace: true })
    }
    throw createError({
      statusCode: 403,
      message: 'شما دسترسی لازم برای مشاهده این صفحه را ندارید',
    })
  }
})
