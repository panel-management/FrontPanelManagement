<template>
  <section class="w-full flex flex-col justify-center items-center gap-8 lg:gap-2 max-md:pt-5">
    <div class="flex flex-col items-center gap-2">
      <span class="text-2xl lg:text-4xl font-bold text-black">پلن عضویت خود را انتخاب کنید</span>
      <p class="text-lg font-light text-center leading-relaxed">
        برای استفاده کامل از امکانات پنل، یکی از پلن های زیر را بر اساس نیاز خود انتخاب نمایید.
      </p>
    </div>
    <WidgetPlans />
  </section>
</template>
<script setup lang="ts">
  import { Role } from '~/models/Role'

  definePageMeta({
    middleware: ['plan-guard'],
    roles: [Role.Master],
  })

  useHead({
    title: 'پلن‌ های عضویت',
    meta: [{ name: 'description', content: 'مشاهده و انتخاب پلن‌های عضویت باشگاه.' }],
  })
</script>
