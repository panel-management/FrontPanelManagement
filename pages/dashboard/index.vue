<template>
  <section class="container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div
        class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between items-center-safe gap-5 md:gap-10">
      <WidgetCards v-for="item in itemsCard" :key="item.id" :data="item"/>
    </div>
    <div class="bg-white w-full p-2 rounded-lg max-lg:overflow-auto">
      <div class="max-md:w-[490%]">
        <LazyChartsStackedLineChart/>
      </div>
    </div>
    <div class="w-full h-full flex max-lg:flex-col gap-2">
      <div class="bg-white p-2 rounded-lg w-full h-full max-lg:overflow-auto">
        <div class="max-md:w-[200%]">
          <LazyChartsPiePadAngle/>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg flex flex-col gap-3 w-full h-full">
        <div class="w-full flex items-center gap-3">
          <div class="bg-rose-300/50 flex items-center justify-center rounded-full p-2">
            <UIcon name="material-symbols:notifications-unread-rounded" class="size-7 text-rose-500/70"/>
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-medium text-xl">فعالیت‌های اخیر</span>
            <p class="text-xs">آخرین رویدادهای باشگاه</p>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          <div class="bg-muted rounded-md w-full flex gap-2 p-3" v-for="i in 12" :key="i">
            <UIcon name="material-symbols:supervised-user-circle" class="size-12 bg-black"/>
            <div class="flex flex-col gap-2">
              <span class="font-bold">پرداخت شهریه</span>
              <p class="text-sm">
                فاطمه رضایی شهریه ماه جاری را پرداخت کرد
              </p>
              <span class="text-xs">۴ ساعت پیش</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const itemsCard = ref([
  {
    id: 1,
    icon: 'ph:student-duotone',
    colorIcon: 'text-muted',
    colorBackgroundIcon: 'bg-muted',
    count: '142',
    title: 'هنرجو فعال'
  },
  {
    id: 2,
    icon: 'ci:users-group',
    colorIcon: 'text-turquoise-400/40',
    colorBackgroundIcon: 'bg-turquoise-400/10',
    count: '12',
    title: 'مربی متخصص'
  },
  {
    id: 3,
    icon: 'tabler:database-dollar',
    colorIcon: 'text-pink-400/40',
    colorBackgroundIcon: 'bg-pink-400/10',
    count: '۸۵M',
    title: 'درآمد ماهانه'
  },
  {
    id: 4,
    icon: 'material-symbols:android-chat',
    colorIcon: 'text-yellow-400/40',
    colorBackgroundIcon: 'bg-yellow-400/10',
    count: '۷',
    title: 'تیکت باز'
  }
])
</script>