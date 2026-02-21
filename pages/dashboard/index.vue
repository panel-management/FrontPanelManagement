<template>
  <section class="h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div
      class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between items-center-safe gap-5 md:gap-10"
    >
      <div
        class="w-full rounded-xl p-4 bg-white shadow flex items-center-safe gap-3 overflow-hidden"
      >
        <div class="size-16 rounded-full flex justify-center items-center bg-muted">
          <UIcon name="ph:student-duotone" class="size-9 text-muted" />
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="font-medium text-3xl">
            {{ cardData?.totalStudents.toLocaleString('fa-IR') }}
          </h1>
          <span class="font-medium text-muted text-nowrap"> هنرجو فعال </span>
        </div>
      </div>
      <div
        class="w-full rounded-xl p-4 bg-white shadow flex items-center-safe gap-3 overflow-hidden"
      >
        <div class="size-16 rounded-full flex justify-center items-center bg-turquoise-400/10">
          <UIcon name="ci:users-group" class="size-9 text-turquoise-400/40" />
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="font-medium text-3xl">
            {{ cardData?.totalCoaches.toLocaleString('fa-IR') }}
          </h1>
          <span class="font-medium text-muted text-nowrap"> مربی متخصص </span>
        </div>
      </div>
      <div
        class="w-full rounded-xl p-4 bg-white shadow flex items-center-safe gap-3 overflow-hidden"
      >
        <div class="size-16 rounded-full flex justify-center items-center bg-pink-400/10">
          <UIcon name="tabler:database-dollar" class="size-9 text-pink-400/40" />
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="font-medium text-3xl">
            {{ cardData?.currentMonthRevenue.toLocaleString('fa-IR').slice(0, 1) }}
            <span class="text-xl">تومان</span>
          </h1>
          <span class="font-medium text-muted text-nowrap"> درآمد ماهانه </span>
        </div>
      </div>
      <div
        class="w-full rounded-xl p-4 bg-white shadow flex items-center-safe gap-3 overflow-hidden"
      >
        <div class="size-16 rounded-full flex justify-center items-center bg-yellow-400/10">
          <UIcon name="material-symbols:android-chat" class="size-9 text-yellow-400/40" />
        </div>
        <div class="flex flex-col gap-2">
          <h1 class="font-medium text-3xl">
            {{ cardData?.openTickets.toLocaleString('fa-IR') }}
          </h1>
          <span class="font-medium text-muted text-nowrap"> تیکت باز </span>
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
    <div class="w-full h-full flex max-lg:flex-col gap-2">
      <div class="bg-white p-2 rounded-lg w-full h-full">
        <LazyChartsPayment :series="seriesPayment" :chart-labels="chartLabels" />
      </div>
      <div class="bg-white p-4 rounded-lg w-full h-full">
        <LazyWidgetProgressBar />
      </div>
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
    CardsData,
    ChartData,
    DashboardMasterResponse,
    StatusData,
  } from '~/models/dashboard/DashboardMaster'
  import { getDashboardDataMasterService } from '~/services/dashboard.service'

  const cardData = ref<CardsData | null>(null)
  const chartLabels = ref<string[]>([])
  const color = ref<string[]>(['#10B981', '#EF4444', '#F59E0B', '#3B82F6'])
  const categories = ['پرداخت شده', 'پرداخت نشده', 'در انتظار', 'آینده']
  const seriesPayment = ref<number[]>([])
  const seriesTransaction = ref([
    {
      name: 'مبلغ',
      data: [] as number[],
    },
  ])

  async function getDashboardMaster() {
    try {
      const result = await getDashboardDataMasterService()
      if (result.statusCode === 200) {
        const data = result.data as DashboardMasterResponse
        const stats = data.statusData as StatusData
        const cart = data.cards as CardsData

        cardData.value = cart

        const rawChartData: ChartData[] = Array.isArray(data.chartData) ? data.chartData : []
        chartLabels.value = rawChartData.map((item) => item.name)
        seriesPayment.value = rawChartData.map((item) => item.value)

        seriesTransaction.value = [
          {
            name: 'مبلغ',
            data: [
              Number(stats.paid),
              Number(stats.unpaid),
              Number(stats.pending),
              Number(stats.upcoming),
            ],
          },
        ]
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  onMounted(getDashboardMaster)

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
