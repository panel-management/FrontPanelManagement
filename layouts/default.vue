<template>
  <UApp :locale="ar">
    <div>
      <header class="w-full shadow-xs shadow-black p-4 px-5">
        <TheHeader/>
      </header>
      <main class="p-4 w-full h-full">
        <NuxtLoadingIndicator/>
        <NuxtRouteAnnouncer/>
        <NuxtPage/>
      </main>
    </div>
  </UApp>
</template>
<script setup lang="ts">
import {ar} from '@nuxt/ui/locale'
</script>