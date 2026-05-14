<template>
  <UModal :title="props.title">
    <template #description></template>
    <template #body>
      <div class="flex justify-center items-center w-full h-full">
        <img
          class="rounded-lg object-cover"
          :src="props.imageSrc"
          :alt="props.title"
          loading="lazy"
          draggable="false"
        />
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  const props = defineProps<{
    title: string
    imageSrc: string
  }>()
</script>
