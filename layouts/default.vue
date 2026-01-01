<template>
  <UApp :locale="ar" :toaster="{ position: 'top-right' }">
    <header class="w-full h-full shadow-xs shadow-black p-4 px-5">
      <TheHeader />
    </header>
    <main class="p-[10px] w-full h-full flex justify-center items-center">
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
      return titleChunk ? `${titleChunk} - سامانه مدیریت هوشمند` : 'سامانه مدیریت'
    },
  })
</script>
