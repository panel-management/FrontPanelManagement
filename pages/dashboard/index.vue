<template>
  <section class="container h-dvh w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="bg-white/70 w-full px-4 py-3 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between items-center-safe gap-5 md:gap-10">
      <WidgetCards v-for="item in itemsCard" :key="item.id" :data="item" />
    </div>
    <div class="bg-white w-full p-2 rounded-lg"></div>
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