export default defineNuxtRouteMiddleware((to, from) => {
    const accountStore = useAccountStore();
    const publicPage = ['/']
    const isAuthPage = to.path.toLocaleLowerCase().startsWith("/auth")
    const isPublicPage = publicPage.includes(to.path)

    if (!isAuthPage && !isPublicPage) {
        if (!accountStore.isLogin) {
            return navigateTo(`/auth?redirect=${encodeURIComponent(to.fullPath)}`, {replace: true})
        }
    } else {
        if (accountStore.isLogin && (isAuthPage || isPublicPage)) {
            return navigateTo("/dashboard", {replace: true})
        }
    }
})