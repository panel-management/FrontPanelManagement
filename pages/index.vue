<template>
  <div class="flex flex-col justify-center items-center w-full h-dvh px-7">
    <div class="flex flex-col items-center-safe gap-3">
      <span class="font-medium text-xl md:text-4xl text-black leading-relaxed">خوش امدید به پنل مدیریت باشگاه</span>
      <span class="text-black/80 font-normal text-sm md:text-lg">لطف جهت روند کار ورود یا ثبت نام کنید.</span>
    </div>
    <div class="flex flex-col items-center justify-center gap-3 w-full md:w-2/3 lg:w-1/2 xl:w-1/3 pt-5">
      <ULink raw to="/dashboard" class="btn btn-outline">ورود</ULink>
      <ULink raw to="/dashboard" class="btn btn-outline">ثبت نام</ULink>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>