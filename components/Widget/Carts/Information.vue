<template>
  <div
    class="w-full h-full p-4 sm:p-5 bg-white rounded-lg flex sm:flex-col sm:justify-center items-center gap-4"
  >
    <div
      class="size-16 sm:size-14 rounded-full flex justify-center items-center"
      :class="props.bgColorIcon"
    >
      <UIcon :name="props.nameIcon" :class="props.classIcon" />
    </div>
    <div class="flex flex-col sm:items-center gap-1">
      <span class="text-xl sm:text-2xl font-semibold">
        <slot></slot>
      </span>
      <span class="text-sm">{{ props.title }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps<{
    bgColorIcon: string
    nameIcon: string
    classIcon: string
    title: string
  }>()
</script>
