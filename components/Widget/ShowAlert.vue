<template>
  <UAlert
    v-if="pwa?.needRefresh"
    color="info"
    variant="solid"
    orientation="horizontal"
    class="rounded-none"
    icon="i-heroicons-arrow-path"
    title="نسخه جدید موجوده!"
    description="برای دریافت آخرین تغییرات، اپلیکیشن رو بروزرسانی کنید."
    :ui="{ icon: 'size-7' }"
    :actions="[
      {
        label: 'بروزرسانی',
        color: 'primary',
        onClick() {
          handleUpdate()
        },
      },
    ]"
  />
</template>
<script setup lang="ts">
  const { pwa, handleUpdate } = usePwa()
</script>
