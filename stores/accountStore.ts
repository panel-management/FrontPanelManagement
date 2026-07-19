import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', () => {
  const tokenCookieName = 'token'

  const cookie = useCookie<string | null>(tokenCookieName, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  })

  const getToken = computed(() => cookie.value)

  const isLogin = computed(() => !!cookie.value)

  const isLogout = () => {
    cookie.value = null
  }

  const setAuthToken = (data: string) => {
    cookie.value = data
  }

  return {
    getToken,
    isLogin,
    isLogout,
    setAuthToken,
  }
})
