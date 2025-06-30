<template>
  <div class="w-full rounded-xl p-4 bg-white shadow flex items-center-safe gap-3 overflow-hidden">
    <div class="size-16 rounded-full flex justify-center items-center" :class="props.data.colorBackgroundIcon">
      <UIcon :name="props.data.icon" class="size-9" :class="props.data.colorIcon"/>
    </div>
    <div class="flex flex-col gap-2">
      <h1 class="font-medium text-3xl">
        {{ props.data.count }}
      </h1>
      <span class="font-medium text-muted text-nowrap">
        {{ props.data.title }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>