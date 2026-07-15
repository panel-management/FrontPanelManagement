<template>
  <div
    class="w-full h-full p-2 sm:p-4 bg-white rounded-lg flex sm:flex-col sm:justify-center items-center gap-4"
    :class="props.baseClass"
  >
    <div
      class="size-10 sm:size-14 rounded-full flex justify-center items-center"
      :class="props.bgColorIcon"
    >
      <UIcon :name="props.nameIcon" :class="props.classIcon" />
    </div>
    <div class="flex flex-col sm:items-center gap-1">
      <span class="text-lg sm:text-xl font-semibold">
        <slot></slot>
      </span>
      <span class="text-base">{{ props.title }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps<{
    bgColorIcon: string
    nameIcon: string
    classIcon: string
    baseClass?: string
    title: string
  }>()
</script>
