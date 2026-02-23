<template>
  <UApp :locale="ar" :toaster="{ position: 'top-right' }">
    <VitePwaManifest />
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <div v-if="isLoading" class="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <span class="font-medium text-black text-xl animate-pulse">در حال بارگذاری اطلاعات...</span>
    </div>
    <div v-else>
      <header class="w-full h-full shadow-xs shadow-black p-4 px-5">
        <TheHeader />
      </header>
      <main class="p-[10px] w-full h-full flex flex-1 justify-center items-center">
        <NuxtPage />
        <WidgetPlanLockOverlay />
      </main>
    </div>
  </UApp>
</template>
<script setup lang="ts">
  import { ar } from '@nuxt/ui/locale'

  const isLoading: Ref<boolean> = ref(true)

  onNuxtReady(() => {
    isLoading.value = false
  })

  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - سامانه پنل هوشمند باشگاه` : 'سامانه پنل هوشمند باشگاه'
    },
  })
</script>
