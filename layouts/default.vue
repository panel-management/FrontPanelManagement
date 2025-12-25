<template>
  <UApp :locale="ar" :toaster="{ position: 'top-right' }">
    <div class="w-full h-full flex flex-col justify-center items-center">
      <div class="w-full h-full">
        <header class="w-full shadow-xs shadow-black p-4 px-5">
          <TheHeader />
        </header>
      </div>
    </div>
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
</script>