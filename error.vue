<template>
  <div
    class="w-full h-dvh flex flex-col justify-center items-center gap-5 overflow-hidden"
    v-if="error.statusCode === 404"
  >
    <div class="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      <img
        class="object-cover rounded-xl"
        src="/image/404.png"
        alt="404"
        loading="lazy"
        draggable="false"
      />
    </div>
    <div class="flex flex-col justify-center items-center gap-3 w-full">
      <h1 class="text-base lg:text-2xl font-bold text-black">
        متاسفانه صفحه مورد نظر یافت نشد دوباره تلاش کنید.
      </h1>
      <div class="w-1/2 md:w-1/3 lg:w-1/4">
        <UButton to="/dashboard" class="btn btn-outline flex justify-center items-center"
          >بازگشت به داشتبورد</UButton
        >
      </div>
    </div>
  </div>
  <div class="w-full h-dvh flex flex-col justify-center items-center gap-5 overflow-hidden" v-else>
    <div class="md:w-1/3 lg:w-1/4">
      <img
        class="object-cover rounded-xl"
        src="/image/500.png"
        alt="404"
        loading="lazy"
        draggable="false"
      />
    </div>
    <div class="flex flex-col justify-center items-center gap-3 w-full">
      <h1 class="text-base lg:text-2xl font-bold text-black">
        متاسفانه سروریس به مشکل خورده است دوباره تلاش کنید.
      </h1>
      <div class="w-1/2 md:w-1/3 lg:w-1/4">
        <UButton to="/dashboard" class="btn btn-outline flex justify-center items-center"
          >بازگشت به داشتبورد</UButton
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { NuxtError } from '#app'

  defineProps<{
    error: NuxtError
  }>()
</script>
