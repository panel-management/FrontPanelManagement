<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="flex flex-col gap-2 sm:p-2">
      <h2 class="text-lg sm:text-3xl font-bold">مدیریت مالی</h2>
      <span class="text-xs sm:text-sm font-medium">مدیریت کامل امور مالی باشگاه</span>
    </div>
    <div class="w-full h-full flex flex-col gap-5">
      <TableManagementFinancial />
    </div>
  </section>
</template>
<script setup lang="ts">
  import { Role } from '~/models/Role'

  definePageMeta({
    middleware: ['plan-guard'],
    roles: [Role.Master],
  })

  useHead({
    title: 'مدیریت امور مالی',
    meta: [
      {
        name: 'description',
        content: 'مدیریت امور مالی باشگاه شامل پرداخت‌ ها، درآمد ها و گزارش‌ های مالی.',
      },
    ],
  })
</script>
