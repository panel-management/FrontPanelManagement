<template>
  <section
    class="w-full lg:h-dvh flex flex-col justify-center items-center gap-8 lg:gap-2 max-md:pt-5"
  >
    <div class="flex flex-col gap-2 max-md:text-center place-items-center">
      <span class="text-2xl lg:text-4xl font-bold text-black">پلن عضویت خود را انتخاب کنید</span>
      <p class="text-lg text-black font-light">
        برای استفاده کامل از امکانات پنل، یکی از پلن های زیر را بر اساس نیاز خود انتخاب نمایید.
      </p>
    </div>
    <CartsPlans />
  </section>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: ['role-guard', 'plan-guard'],
  })

  useHead({
    title: 'پلن‌ های عضویت',
    meta: [{ name: 'description', content: 'مشاهده و انتخاب پلن‌های عضویت باشگاه.' }],
  })
</script>
