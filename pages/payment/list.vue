<template>
  <section class="h-full w-full rounded-sm p-2 sm:p-3 bg-muted flex flex-col gap-4">
    <div class="flex flex-col gap-2 sm:p-2">
      <h2 class="text-xl sm:text-3xl font-bold">مدیریت مالی</h2>
      <span class="text-sm font-medium">مدیریت کامل امور مالی تمامی باشگاه ها</span>
    </div>
    <div class="w-full h-full flex flex-col gap-5">
      <TablePaymentListMaster />
    </div>
  </section>
</template>
<script setup lang="ts">
  import { Role } from '~/models/Role'

  definePageMeta({
    middleware: ['plan-guard'],
    roles: [Role.Admin],
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
