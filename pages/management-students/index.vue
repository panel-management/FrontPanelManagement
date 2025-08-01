<template>
  <section class="container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-2 sm:p-2">
        <h2 class="text-lg sm:text-3xl font-bold">لیست هنرجویان</h2>
        <span class="text-xs sm:text-sm font-medium">مشاهده و مدیریت اطلاعات هنرجویان باشگاه</span>
      </div>
      <div class="sm:p-2">
        <UButton @click="modalStore.toggleModal('studentAdd')" trailing-icon="material-symbols:person-add" size="lg" color="primary" variant="subtle">
          افزودن هنرجو جدید
        </UButton>
      </div>
    </div>
    <div class="bg-white flex flex-col gap-3 p-3 rounded-lg">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-bold">لیست هنرجویان (5 نفر)</span>
        <p class="break-words font-medium text-sm">مشاهده کامل اطلاعات هنرجویان و مدیریت آنها</p>
      </div>
      <LazyTableStudentsTable/>
    </div>
    <LazyWidgetModalStudentAdd v-model:open="modalStore.modals.studentAdd"/>
  </section>
</template>
<script setup lang="ts">
const modalStore = useModalStore()
</script>