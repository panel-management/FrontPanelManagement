<template>
  <UApp :locale="ar" :toaster="{ position: 'top-right' }">
    <div
      v-if="isInitialLoading"
      class="fixed inset-0 flex flex-col items-center justify-center bg-white"
    >
      <span class="font-medium text-black text-xl animate-pulse">در حال بارگذاری اطلاعات...</span>
    </div>
    <template v-else>
      <header class="w-full h-full shadow-xs shadow-black p-4 px-5">
        <TheHeader />
      </header>
      <main class="p-[10px] w-full h-full flex justify-center items-center">
        <VitePwaManifest />
        <NuxtLoadingIndicator />
        <NuxtRouteAnnouncer />
        <NuxtPage />
        <WidgetPlanLockOverlay />
      </main>
    </template>
  </UApp>
</template>
<script setup lang="ts">
  import { ar } from '@nuxt/ui/locale'

  const isInitialLoading = ref(true)
  const roleStore = useRolesStore()

  onMounted(async () => {
    try {
      await roleStore.getDetailUser()
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isInitialLoading.value = false
    }
  })

  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - سامانه پنل هوشمند باشگاه` : 'سامانه پنل هوشمند باشگاه'
    },
  })
</script>
