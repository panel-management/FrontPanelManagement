<template>
  <UDropdownMenu :items="items" :content="{ align: 'end' }" class="py-3">
    <UButton
      :label="label"
      color="neutral"
      variant="outline"
      trailing-icon="i-lucide-chevron-down"
      class="w-full flex justify-between items-center"
      aria-label="انتخاب فهرست منو"
    />
  </UDropdownMenu>
</template>
<script setup lang="ts">
  const { items, label = 'انتخاب منو' } = defineProps<{
    items: any
    label: string
  }>()
</script>
