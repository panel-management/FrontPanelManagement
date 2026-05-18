<template>
  <UApp :locale="ar">
    <div class="w-full h-dvh px-5 md:px-7 flex justify-center items-center">
      <div class="max-md:w-full flex flex-col items-center-safe gap-3">
        <h1 class="font-medium text-xl md:text-4xl text-black">خوش آمدید به پنل هوشمند باشگاه</h1>
        <span class="font-normal text-sm md:text-lg"> لطف جهت روند کار ورود یا ثبت نام کنید </span>
        <NuxtLink to="/auth" class="btn btn-outline">ورود یا ثبت نام</NuxtLink>
      </div>
    </div>
  </UApp>
</template>
<script setup lang="ts">
  import { ar } from '#ui/locale'

  definePageMeta({
    layout: false,
  })

  useHead({
    title: 'خوش آمدید به پنل هوشمند باشگاه',
    meta: [
      {
        name: 'description',
        content: 'نمای کلی داشبورد برای دسترسی سریع به اطلاعات اعضا، کلاس‌ها و فعالیت‌های مدیریتی.',
      },
    ],
  })
</script>
