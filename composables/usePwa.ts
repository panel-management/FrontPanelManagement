export const usePwa = () => {
  const nuxtApp = useNuxtApp()
  const toastStore = useToastStore()

  const isInstalling: Ref<boolean> = ref(false)

  const pwa = nuxtApp.$pwa

  const isInstalled = computed(() => pwa?.isPWAInstalled)
  const showInstallPrompt = computed(() => pwa?.showInstallPrompt)

  const shouldShowInstall = computed(() => {
    return !isInstalled.value && showInstallPrompt.value
  })

  const handleInstall = async () => {
    if (!pwa?.install || !showInstallPrompt.value) {
      toastStore.setAlert(
        'امکان نصب وجود ندارد',
        'لطفاً از منوی مرورگر اقدام کن',
        'error',
        'ci:error-outline'
      )
      return
    }

    isInstalling.value = true

    try {
      await pwa.install()

      setTimeout(() => {
        if (isInstalled.value) {
          toastStore.setAlert('اپلیکیشن با موفقیت نصب شد', '', 'success', 'ep:success-filled')
        } else {
          toastStore.setAlert(
            'نصب لغو شد',
            'می‌توانید بعداً دوباره تلاش کنید',
            'warning',
            'bx:bx-info-circle'
          )
        }
      }, 1000)
    } catch (err) {
      console.error('PWA Install Error:', err)
      toastStore.setAlert('خطا در نصب', 'لطفاً دوباره تلاش کنید', 'error', 'bx:bxs-error')
    } finally {
      isInstalling.value = false
    }
  }

  const handleUpdate = async () => {
    await pwa?.updateServiceWorker()
  }

  return {
    pwa,
    isInstalling,
    isInstalled,
    showInstallPrompt,
    shouldShowInstall,
    handleInstall,
    handleUpdate,
  }
}
