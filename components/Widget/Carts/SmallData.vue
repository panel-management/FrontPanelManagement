<template>
  <div class="w-full rounded-xl p-4 bg-white shadow flex items-center-safe gap-3 overflow-hidden">
    <div
      class="size-14 sm:size-16 rounded-full flex justify-center items-center"
      :class="props.bgColorIcon"
    >
      <UIcon :name="props.nameIcon" :class="props.classIcon" />
    </div>
    <div class="flex flex-col gap-1">
      <h1 class="font-medium text-2xl sm:text-3xl">
        <slot></slot>
      </h1>
      <span class="font-medium text-muted text-nowrap">{{ props.title }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps<{
    bgColorIcon: string
    classIcon: string
    nameIcon: string
    title: string
  }>()
</script>
