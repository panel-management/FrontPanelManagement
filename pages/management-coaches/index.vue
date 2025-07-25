<template>
  <section class="container h-full w-full rounded-sm p-3 bg-muted flex flex-col gap-4">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col gap-2 sm:p-2">
        <h2 class="text-lg sm:text-3xl font-bold">مدیریت مربیان</h2>
        <span class="text-xs sm:text-sm font-medium">مشاهده و مدیریت اطلاعات مربیان باشگاه</span>
      </div>
      <div class="sm:p-2">
        <UButton @click="openModal" trailing-icon="material-symbols:person-add" size="lg" color="primary" variant="subtle">
          افزودن مربی جدید
        </UButton>
      </div>
    </div>
    <div class="bg-white flex flex-col gap-3 p-3 rounded-lg">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-bold">لیست مربیان (5 نفر)</span>
        <p class="break-words font-medium text-sm">مشاهده کامل اطلاعات مربیان و مدیریت آنها</p>
      </div>
      <LazyTableCoacheTable/>
    </div>
    <LazyWidgetModalCoacheAdd v-model:open="isOpen"/>
  </section>
</template>
<script setup lang="ts">
const isOpen: Ref<boolean> = ref(false);

function openModal() {
  isOpen.value = !isOpen.value;
}
</script>