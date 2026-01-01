<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">مدیریت مالی</h2>
      <span class="text-xs sm:text-sm font-medium">مدیریت کامل امور مالی تمامی باشگاه ها</span>
    </div>
    <div class="w-full h-full flex flex-col gap-5">
      <TablePaymentListMaster />
    </div>
  </section>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: ['role-guard', 'plan-guard'],
  })

  useHead({
    title: 'مدیریت مالی',
    meta: [
      {
        name: 'description',
        content: 'مشاهده و مدیریت پرداخت‌ های اعضا، وضعیت تسویه و تاریخچه تراکنش‌ ها.',
      },
    ],
  })
</script>
