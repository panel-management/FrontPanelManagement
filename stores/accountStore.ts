import {defineStore} from "pinia";
import type {AuthData} from "~/models/auth/AuthData";

export const useAccountStore = defineStore("account", () => {
    const tokenCookieName = "token";

    const cookie = useCookie<string | null>(tokenCookieName, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    const getToken = computed(() => cookie.value);

    const isLogin = computed(() => !!cookie.value);

    const isLogout = () => {
        cookie.value = null;
    };

    const setAuthToken = (data: AuthData) => {
        cookie.value = data;
    };

    return {
        getToken,
        isLogin,
        isLogout,
        setAuthToken,
    };
});
