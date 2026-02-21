<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div
      class="w-full grid grid-cols-1 md:grid-cols-3 justify-between items-center-safe gap-5 md:gap-10"
    >
      <div
        class="w-full rounded-xl p-4 bg-white shadow flex items-center-safe gap-3 overflow-hidden"
      >
        <div class="size-16 rounded-full flex justify-center items-center bg-primary-400/10">
          <UIcon name="game-icons:confirmed" class="size-9 text-primary-400/40" />
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="font-medium text-3xl">
            {{ countData?.confirmedCount.toLocaleString('fa-IR') }}
          </h1>
          <span class="font-medium text-muted text-nowrap"> تایید شده </span>
        </div>
      </div>
      <div
        class="w-full rounded-xl p-4 bg-white shadow flex items-center-safe gap-3 overflow-hidden"
      >
        <div class="size-16 rounded-full flex justify-center items-center bg-warning-400/10">
          <UIcon name="codicon:vm-pending" class="size-9 text-warning-400/40" />
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="font-medium text-3xl">
            {{ countData?.pendingCount.toLocaleString('fa-IR') }}
          </h1>
          <span class="font-medium text-muted text-nowrap"> در انتظار تایید </span>
        </div>
      </div>
      <div
        class="w-full rounded-xl p-4 bg-white shadow flex items-center-safe gap-3 overflow-hidden"
      >
        <div class="size-16 rounded-full flex justify-center items-center bg-error-400/10">
          <UIcon name="si-glyph:button-error" class="size-9 text-error-400/40" />
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="font-medium text-3xl">
            {{ countData?.rejectCount.toLocaleString('fa-IR') }}
          </h1>
          <span class="font-medium text-muted text-nowrap"> رد شده </span>
        </div>
      </div>
    </div>
    <div class="bg-white p-2 w-full h-full rounded-lg">
      <LazyChartsTransactions
        :series="seriesTransaction"
        :categories="categories"
        :colors="color"
      />
    </div>
    <!-- <div class="w-full h-full">
      <div class="bg-white p-4 rounded-lg flex flex-col gap-3 w-full h-full">
        <div class="w-full flex items-center gap-3">
          <div class="bg-rose-300/50 flex items-center justify-center rounded-full p-2">
            <UIcon
              name="material-symbols:notifications-unread-rounded"
              class="size-7 text-rose-500/70"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-medium text-xl">فعالیت‌های اخیر</span>
            <p class="text-xs">آخرین رویدادهای باشگاه</p>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          <div class="bg-muted rounded-md w-full flex gap-2 p-3" v-for="i in 12" :key="i">
            <UIcon name="material-symbols:supervised-user-circle" class="size-12 bg-black" />
            <div class="flex flex-col gap-2">
              <span class="font-bold">پرداخت شهریه</span>
              <p class="text-sm">فاطمه رضایی شهریه ماه جاری را پرداخت کرد</p>
              <span class="text-xs">۴ ساعت پیش</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </section>
</template>
<script setup lang="ts">
  import type {
    Counts,
    DashboardAdminResponse,
    StatusData,
  } from '~/models/dashboard/DashboardAdmin'
  import { getDashboardDataAdminService } from '~/services/dashboard.service'

  const color = ref<string[]>(['#10B981', '#F59E0B', '#EF4444'])
  const categories = ['تایید شده', 'در انتظار', 'رد شده']
  const countData = ref<Counts | null>(null)
  const seriesTransaction = ref([
    {
      name: 'مبلغ',
      data: [] as number[],
    },
  ])

  async function getDashboardAdmin() {
    try {
      const result = await getDashboardDataAdminService()
      if (result.statusCode === 200) {
        const data = result.data as DashboardAdminResponse
        const stats = data.statusData as StatusData
        countData.value = stats.counts as Counts

        seriesTransaction.value = [
          {
            name: 'مبلغ',
            data: [
              Number(stats.confirmedRevenue),
              Number(stats.pendingRevenue),
              Number(stats.rejectRevenue),
            ],
          },
        ]
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  onMounted(getDashboardAdmin)

  definePageMeta({
    middleware: ['role-guard', 'plan-guard'],
  })

  useHead({
    title: 'پنل مدیریت',
    meta: [
      {
        name: 'description',
        content: 'خلاصه‌ای از اطلاعات کلیدی باشگاه شامل اعضا، برنامه کلاس‌ ها و وضعیت مالی.',
      },
    ],
  })
</script>
