<template>
  <UApp :locale="ar" :toaster="{ position: 'top-right' }">
    <WidgetShowAlert />
    <header class="w-full h-full shadow-xs shadow-black p-4 px-5">
      <TheHeader />
    </header>
    <main class="p-[10px] w-full h-full flex flex-1 justify-center items-center">
      <VitePwaManifest />
      <NuxtLoadingIndicator />
      <NuxtRouteAnnouncer />
      <NuxtPage />
      <WidgetPlanLockOverlay />
    </main>
  </UApp>
</template>
<script setup lang="ts">
  import { ar } from '@nuxt/ui/locale'

  useHead({
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - سامانه پنل هوشمند باشگاه` : 'سامانه پنل هوشمند باشگاه'
    },
  })
</script>
