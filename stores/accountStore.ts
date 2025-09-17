import {defineStore} from "pinia";

export const useAccountStore = defineStore("account", () => {
    const tokenCookieName = "token";

    const cookie = useCookie<string | null>(tokenCookieName, {
        maxAge: 60 * 60 * 24 * 7, // ۷ روز
        path: "/", // اگه بخوای کوکی تو همه صفحات در دسترس باشه
    });

    const getToken = computed(() => cookie.value);

    const isLogin = computed(() => !!cookie.value);

    const isLogout = () => {
        cookie.value = null;
    };

    const setAuthToken = (data: any) => {
        cookie.value = data.token;
    };

    return {
        getToken,
        isLogin,
        isLogout,
        setAuthToken,
    };
});
