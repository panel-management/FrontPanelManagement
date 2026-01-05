<template>
  <div class="w-full py-12 flex flex-col items-center justify-center gap-1">
    <UIcon :name="icon" class="size-10 md:size-12 opacity-50" />
    <span class="text-lg md:text-xl font-medium">
      {{ title }}
    </span>
    <p class="text-base md:text-lg">
      {{ description }}
    </p>
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    icon: string
    title: string
    description: string
  }>()
</script>
